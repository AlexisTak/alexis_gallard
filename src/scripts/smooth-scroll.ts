import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './motion';

/**
 * Scroll interpolé.
 *
 * Lenis pilote le scroll natif de la fenêtre plutôt que de transformer un
 * conteneur : `position: sticky` et `fixed` continuent de fonctionner, ce dont
 * dépendent le header et les labels de section.
 *
 * L'initialisation attend une première image : Lenis intercepte la molette et
 * applique son propre défilement, donc si `requestAnimationFrame` ne tourne
 * jamais, la page deviendrait impossible à faire défiler. Tant qu'aucune image
 * n'est calculée, on ne touche à rien et le scroll natif reste seul maître.
 */
export function initSmoothScroll() {
	if (prefersReducedMotion()) return;

	requestAnimationFrame(() => {
		const lenis = new Lenis({
			duration: 1.05,
			// Sortie exponentielle : rapide au relâchement, arrêt net, sans flottement.
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
			// Le tactile garde son inertie native : la remplacer donne toujours
			// une sensation de décalage sous le doigt.
			syncTouch: false,
		});

		// Une seule horloge pour le scroll et les animations : sans cela,
		// ScrollTrigger mesure des positions d'une image de retard.
		lenis.on('scroll', ScrollTrigger.update);
		gsap.ticker.add((time) => lenis.raf(time * 1000));
		gsap.ticker.lagSmoothing(0);

		// Les ancres passent par Lenis, sinon deux défilements se disputent la page.
		document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
			anchor.addEventListener('click', (event) => {
				const id = anchor.getAttribute('href');
				if (!id || id === '#') return;
				const target = document.querySelector(id);
				if (!target) return;
				event.preventDefault();
				lenis.scrollTo(target as HTMLElement, { offset: -80 });
			});
		});
	});
}
