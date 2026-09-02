/**
 * Champ d'embeddings — un nuage de points épars rendu en WebGL brut.
 *
 * Trois couches de points dérivent à des vitesses différentes (parallaxe).
 * `pulse()` envoie une onde depuis la gauche du champ : les points qu'elle
 * traverse s'éclairent et virent à l'accent, comme une recherche de plus
 * proches voisins qui remonte ses résultats.
 *
 * Un quad plein écran et un fragment shader suffisent : pas de graphe de
 * scène, donc pas de moteur 3D à charger.
 */

const VERTEX = `
attribute vec2 aPosition;
void main() {
	gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uRing;
uniform vec3 uAccent;
uniform vec3 uInk;
uniform float uAlpha;

vec2 hash22(vec2 p) {
	p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
	return fract(sin(p) * 43758.5453);
}

// Une couche de points : grille irrégulière, chaque cellule porte un point
// qui respire autour de sa position d'origine.
float layer(vec2 uv, float scale, float t, float radius) {
	vec2 p = uv * scale + vec2(t * 0.035, t * 0.014);
	vec2 cell = floor(p);
	vec2 f = fract(p);
	float acc = 0.0;

	for (int y = -1; y <= 1; y++) {
		for (int x = -1; x <= 1; x++) {
			vec2 neighbour = vec2(float(x), float(y));
			vec2 h = hash22(cell + neighbour);
			vec2 pos = neighbour + 0.15 + 0.7 * h;
			pos += 0.1 * vec2(sin(t * 0.5 + h.x * 6.283), cos(t * 0.4 + h.y * 6.283));
			acc += smoothstep(radius, 0.0, length(f - pos)) * (0.55 + 0.45 * h.x);
		}
	}

	return acc;
}

void main() {
	vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;

	// L'onde de recherche : une bande fine qui s'éloigne de son origine.
	vec2 origin = vec2(-0.35, 0.0);
	float band = 0.0;
	if (uRing > 0.0) {
		float d = abs(length(uv - origin) - uRing);
		band = exp(-d * d * 70.0) * smoothstep(1.7, 0.6, uRing);
	}

	// Le rayon est exprimé en espace cellule : 0.18 sur une grille de 5
	// donne un point d'environ 6 px de haut sur un écran de 900 px.
	float points =
		layer(uv, 5.0, uTime, 0.19) * 0.95 +
		layer(uv, 9.0, uTime * 1.25, 0.15) * 0.6 +
		layer(uv, 15.0, uTime * 0.75, 0.12) * 0.4;

	points *= 1.0 + band * 3.2;

	vec3 colour = mix(uInk, uAccent, clamp(band * 1.4 + 0.05, 0.0, 1.0));
	float vignette = smoothstep(1.25, 0.2, length(uv - vec2(0.1, 0.0)));

	gl_FragColor = vec4(colour, clamp(points, 0.0, 1.0) * uAlpha * vignette);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
	const shader = gl.createShader(type);
	if (!shader) return null;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

/** Lit une couleur du thème courant et la convertit en RGB normalisé. */
function readColour(variable: string, fallback: [number, number, number]) {
	const raw = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
	const hex = raw.replace('#', '');
	if (hex.length !== 6) return fallback;
	const value = Number.parseInt(hex, 16);
	if (Number.isNaN(value)) return fallback;
	return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255] as [
		number,
		number,
		number,
	];
}

export interface HeroField {
	pulse: () => void;
	destroy: () => void;
}

export function createHeroField(canvas: HTMLCanvasElement): HeroField | null {
	const gl = (canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false }) ??
		canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
	if (!gl) return null;

	const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
	const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
	const program = gl.createProgram();
	if (!vertex || !fragment || !program) return null;

	gl.attachShader(program, vertex);
	gl.attachShader(program, fragment);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
	gl.useProgram(program);

	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
	const position = gl.getAttribLocation(program, 'aPosition');
	gl.enableVertexAttribArray(position);
	gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

	const uniforms = {
		resolution: gl.getUniformLocation(program, 'uResolution'),
		time: gl.getUniformLocation(program, 'uTime'),
		ring: gl.getUniformLocation(program, 'uRing'),
		accent: gl.getUniformLocation(program, 'uAccent'),
		ink: gl.getUniformLocation(program, 'uInk'),
		alpha: gl.getUniformLocation(program, 'uAlpha'),
	};

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	let ring = -1;
	let ringStart = 0;
	let frame = 0;
	let running = true;
	const started = performance.now();

	const syncColours = () => {
		gl.uniform3fv(uniforms.accent, readColour('--c-accent', [0.94, 0.71, 0.16]));
		gl.uniform3fv(uniforms.ink, readColour('--c-text', [0.91, 0.9, 0.88]));
		gl.uniform1f(uniforms.alpha, document.documentElement.dataset.theme === 'light' ? 0.5 : 0.72);
	};

	const resize = () => {
		const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
		const width = Math.round(canvas.clientWidth * dpr);
		const height = Math.round(canvas.clientHeight * dpr);
		if (canvas.width === width && canvas.height === height) return;
		canvas.width = width;
		canvas.height = height;
		gl.viewport(0, 0, width, height);
		gl.uniform2f(uniforms.resolution, width, height);
	};

	const render = (now: number) => {
		if (!running) return;
		resize();

		if (ring >= 0) {
			ring = ((now - ringStart) / 1000) * 0.85;
			if (ring > 2.4) ring = -1;
		}

		gl.uniform1f(uniforms.time, (now - started) / 1000);
		gl.uniform1f(uniforms.ring, ring);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		frame = requestAnimationFrame(render);
	};

	// Le champ s'arrête quand l'onglet passe en arrière-plan : rien à calculer.
	const onVisibility = () => {
		if (document.hidden) {
			running = false;
			cancelAnimationFrame(frame);
		} else if (!running) {
			running = true;
			frame = requestAnimationFrame(render);
		}
	};

	const themeObserver = new MutationObserver(syncColours);
	themeObserver.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-theme'],
	});
	document.addEventListener('visibilitychange', onVisibility);

	syncColours();
	resize();

	// Une première image tout de suite : le canvas n'est jamais vide, même si
	// la boucle d'animation tarde à démarrer.
	gl.uniform1f(uniforms.time, 0);
	gl.uniform1f(uniforms.ring, -1);
	gl.drawArrays(gl.TRIANGLES, 0, 3);

	frame = requestAnimationFrame(render);

	return {
		pulse() {
			ringStart = performance.now();
			ring = 0;
		},
		destroy() {
			running = false;
			cancelAnimationFrame(frame);
			themeObserver.disconnect();
			document.removeEventListener('visibilitychange', onVisibility);
			gl.getExtension('WEBGL_lose_context')?.loseContext();
		},
	};
}
