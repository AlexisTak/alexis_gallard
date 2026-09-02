import Lenis from 'lenis';
import { prefersReducedMotion } from './motion';

/**
 * Scroll interpolé.
 *
 * Lenis pilote le scroll natif de la fenêtre plutôt que de transformer un
 * conteneur : `position: sticky` et `fixed` continuent de fonctionner, ce dont
 * dépend la carte de visite latérale.
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
			// Sortie exponentielle : rapide au relâchement, arrêt net.
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
			// Le tactile garde son inertie native, qu'aucune interpolation
			// n'égale sous le doigt.
			syncTouch: false,
		});

		const frame = (time: number) => {
			lenis.raf(time);
			requestAnimationFrame(frame);
		};
		requestAnimationFrame(frame);

		// Les ancres passent par Lenis, sinon deux défilements se disputent la page.
		document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
			anchor.addEventListener('click', (event) => {
				const id = anchor.getAttribute('href');
				if (!id || id === '#') return;
				const target = document.querySelector(id);
				if (!target) return;
				event.preventDefault();
				lenis.scrollTo(target as HTMLElement, { offset: -24 });
			});
		});
	});
}
