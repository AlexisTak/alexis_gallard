// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://alexisgallard.vercel.app/',
	integrations: [
		sitemap({
			filter: (page) => !page.includes('/og/'),
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
