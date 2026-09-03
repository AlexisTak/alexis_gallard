export const prefersReducedMotion = () =>
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Révélations au scroll.
 *
 * L'animation elle-même est faite en CSS : ce script ne fait qu'ajouter une
 * classe au bon moment. Une bibliothèque d'animation coûterait ici quarante
 * fois le poids de ce fichier pour le même fondu.
 *
 * Aucune mesure de géométrie n'est faite à la main. `getBoundingClientRect`
 * force le navigateur à calculer la mise en page sur-le-champ, dans le fil
 * principal — une cinquantaine de millisecondes sur cette page, juste avant le
 * premier rendu. L'observateur, lui, rapporte l'état initial de tous les
 * éléments qu'il surveille sans rien bloquer : son premier appel dit déjà
 * lesquels sont à l'écran.
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

	// Le premier appel décrit la page telle qu'elle s'ouvre : ce qui y est déjà
	// visible se place sans transition. Animer ce que le visiteur regarde déjà
	// retarde sa lecture pour rien.
	let isFirstPass = true;

	const observer = new IntersectionObserver(
		(entries) => {
			const instant = isFirstPass;
			isFirstPass = false;

			const revealed: HTMLElement[] = [];

			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const element = entry.target as HTMLElement;

				if (instant) {
					element.style.transition = 'none';
					revealed.push(element);
				} else {
					element.style.transitionDelay = `${Number(element.dataset.revealDelay ?? 0)}ms`;
				}

				reveal(element);
				observer.unobserve(element);
			});

			// Transition rendue au cadre suivant, une fois l'état final peint.
			if (revealed.length > 0) {
				requestAnimationFrame(() => {
					revealed.forEach((element) => element.style.removeProperty('transition'));
				});
			}
		},
		{ rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
	);

	targets.forEach((target) => observer.observe(target));

	// Filet : le contenu ne dépend jamais d'une animation qui aboutit. Onglet
	// ouvert en arrière-plan, observateur muet, erreur — au bout du délai,
	// l'état final est appliqué quoi qu'il arrive.
	window.setTimeout(() => targets.forEach(reveal), 3000);
}
