import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

/**
 * Images de partage générées à la compilation, une par page.
 *
 * Sans elles, un lien partagé sur LinkedIn ou Slack s'affiche en bloc de texte
 * gris. Les générer ici plutôt que de dessiner un visuel unique garantit que la
 * vignette annonce la page réellement partagée.
 */

const projects = await getCollection('projects');
const posts = await getCollection('blog');

const pages: Record<string, { title: string; description: string }> = {
	index: {
		title: 'Alexis Gallard',
		description: 'Développeur Fullstack Senior · AI Engineer · Poitiers',
	},
	expertises: {
		title: 'Expertises',
		description: 'Applications web et desktop, IA appliquée, infrastructure',
	},
	'a-propos': {
		title: 'Parcours',
		description: "12 ans à construire, déployer, réparer",
	},
	projets: {
		title: 'Travail',
		description: 'Études de cas : contexte, choix techniques, résultats',
	},
	blog: {
		title: 'Écrits',
		description: 'Notes techniques sur le développement et l’IA appliquée',
	},
	contact: {
		title: 'Contact',
		description: 'Ouvert aux opportunités · Poitiers ou à distance',
	},
	'mentions-legales': {
		title: 'Mentions légales',
		description: 'Éditeur, directeur de la publication et hébergeur',
	},
	confidentialite: {
		title: 'Confidentialité',
		description: 'Aucun cookie, aucun traceur, aucune mesure d’audience',
	},
};

for (const project of projects) {
	pages[`projets/${project.id}`] = {
		title: project.data.title,
		description: project.data.subtitle,
	};
}

for (const post of posts) {
	pages[`blog/${post.id}`] = {
		title: post.data.title,
		description: post.data.description,
	};
}

// L'API est asynchrone depuis la 0.13, et deduit le nom du parametre du nom de
// fichier. Le slug porte deja l'extension : la route ne doit donc pas s'appeler
// `.png.ts`, sinon l'URL finirait en `.png.png`.
const route = await OGImageRoute({
	pages,
	getImageOptions: (_path, page) => ({
		title: page.title,
		description: page.description,
		// Le monogramme signe la vignette : partagee sur LinkedIn ou dans une
		// messagerie, elle doit etre reconnaissable avant meme d'etre lue.
		logo: { path: './public/icon-192.png', size: [104] },
		// Seules couleurs du projet qui ne sont pas en OKLCH : astro-og-canvas
		// dessine sur un canevas et n'accepte que des triplets RVB. Ce sont les
		// équivalents exacts de --c-bg, --c-surface, --c-accent et --c-text.
		// La vignette doit rester reconnaissable comme une page de ce site.
		bgGradient: [
			[232, 226, 214],
			[245, 241, 233],
		],
		border: { color: [240, 180, 41], width: 14, side: 'inline-start' },
		padding: 96,
		font: {
			title: {
				size: 88,
				weight: 'Bold',
				color: [22, 24, 28],
				lineHeight: 1.1,
				families: ['Schibsted Grotesk', 'sans-serif'],
			},
			description: {
				size: 36,
				weight: 'Normal',
				color: [109, 102, 89],
				lineHeight: 1.4,
				families: ['Schibsted Grotesk', 'sans-serif'],
			},
		},
		fonts: [
			'./node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2',
		],
		format: 'PNG',
	}),
});

export const getStaticPaths = route.getStaticPaths;
export const GET = route.GET;
