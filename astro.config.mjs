// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://alexisgallard.vercel.app/',
	integrations: [
		sitemap({
			// Les images de partage ne sont pas des pages : les indexer noierait
			// le sitemap sous des entrees sans contenu.
			filter: (page) => !page.includes('/og/'),
			// Pas de lastmod : le renseigner a la date du build annoncerait toutes
			// les pages comme modifiees a chaque deploiement. Un signal faux est
			// ignore par les moteurs, quand il ne leur coute pas leur confiance.
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
