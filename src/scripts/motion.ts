export const prefersReducedMotion = () =>
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Révélations au scroll.
 *
 * L'animation elle-même est faite en CSS : ce script ne fait qu'ajouter une
 * classe au bon moment. Une bibliothèque d'animation coûterait ici quarante
 * fois le poids de ce fichier pour le même fondu.
 */
export function initReveals() {
	const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
	if (targets.length === 0) return;

	const reveal = (element: HTMLElement) => element.classList.add('is-revealed');

	// Sans observateur ou en mouvement réduit, tout est visible d'emblée.
	if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
		targets.forEach(reveal);
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const element = entry.target as HTMLElement;
				const delay = Number(element.dataset.revealDelay ?? 0);
				element.style.transitionDelay = `${delay}ms`;
				reveal(element);
				observer.unobserve(element);
			});
		},
		{ rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
	);

	targets.forEach((target) => observer.observe(target));

	// Filet : le contenu ne dépend jamais d'une animation qui aboutit. Onglet
	// ouvert en arrière-plan, observateur muet, erreur — au bout du délai,
	// l'état final est appliqué quoi qu'il arrive.
	window.setTimeout(() => targets.forEach(reveal), 3000);
}
