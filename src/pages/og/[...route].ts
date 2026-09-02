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
};

for (const project of projects) {
	pages[`projets/${project.id}`] = {
		title: project.data.title,
		description: project.data.subtitle,
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
		logo: undefined,
		// Mêmes couleurs que le thème sombre du site : la vignette doit être
		// reconnaissable comme une page de ce site, pas comme une carte générique.
		bgGradient: [
			[8, 9, 11],
			[20, 22, 26],
		],
		border: { color: [240, 180, 41], width: 10, side: 'inline-start' },
		padding: 96,
		font: {
			title: {
				size: 88,
				weight: 'Bold',
				color: [232, 230, 225],
				lineHeight: 1.1,
				families: ['Archivo', 'Instrument Sans', 'sans-serif'],
			},
			description: {
				size: 36,
				weight: 'Normal',
				color: [122, 140, 163],
				lineHeight: 1.4,
				families: ['Instrument Sans', 'sans-serif'],
			},
		},
		fonts: [
			'./node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2',
			'./node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2',
		],
		format: 'PNG',
	}),
});

export const getStaticPaths = route.getStaticPaths;
export const GET = route.GET;
