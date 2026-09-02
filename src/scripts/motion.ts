import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const prefersReducedMotion = () =>
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Filet de sécurité : le contenu ne dépend jamais d'une animation qui aboutit.
 * Onglet ouvert en arrière-plan, rAF gelé, WebGL indisponible, erreur JS — au
 * bout du délai, l'état final est appliqué quoi qu'il arrive.
 */
export function ensureVisible(targets: Element | Element[] | null, delay = 2500) {
	const list = (Array.isArray(targets) ? targets : [targets]).filter(Boolean) as Element[];
	if (list.length === 0) return () => {};

	const timer = window.setTimeout(() => {
		list.forEach((el) => {
			if (Number(getComputedStyle(el).opacity) < 0.99) {
				gsap.set(el, { opacity: 1, y: 0, clearProps: 'transform' });
			}
		});
	}, delay);

	return () => window.clearTimeout(timer);
}

/**
 * Révélations au scroll : une coupe par bloc, jamais une cascade d'effets.
 * Sans JS — ou en mouvement réduit — les blocs sont visibles d'emblée : c'est
 * la classe `js-motion` sur <html> qui autorise le masquage initial.
 */
export function initReveals() {
	const targets = gsap.utils.toArray<HTMLElement>('[data-reveal]');
	if (targets.length === 0) return;

	if (prefersReducedMotion()) {
		gsap.set(targets, { opacity: 1, y: 0 });
		return;
	}

	gsap.registerPlugin(ScrollTrigger);

	ScrollTrigger.batch(targets, {
		start: 'top 88%',
		once: true,
		onEnter: (batch) =>
			gsap.to(batch, {
				opacity: 1,
				y: 0,
				duration: 0.9,
				ease: 'power3.out',
				stagger: 0.08,
				overwrite: true,
			}),
	});

	// Si les déclencheurs n'ont jamais tourné, on montre au moins ce qui est
	// déjà à l'écran : personne ne doit tomber sur une page vide.
	ensureVisible(
		targets.filter((el) => el.getBoundingClientRect().top < window.innerHeight),
		3000,
	);

	// Les filets de section se tracent au passage, comme une coupe au montage.
	gsap.utils.toArray<HTMLElement>('[data-rule]').forEach((rule) => {
		gsap.fromTo(
			rule,
			{ scaleX: 0 },
			{
				scaleX: 1,
				duration: 1.1,
				ease: 'power2.out',
				scrollTrigger: { trigger: rule, start: 'top 92%', once: true },
			},
		);
	});
}
