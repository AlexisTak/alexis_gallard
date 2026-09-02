import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../lib/site';

/**
 * Flux des articles. Utile aux lecteurs, et surtout aux agrégateurs et aux
 * moteurs qui découvrent les publications sans attendre un nouveau passage
 * d'exploration.
 */
export async function GET(context: { site?: URL }) {
	const posts = await getCollection('blog');

	return rss({
		title: `Écrits — ${SITE.name}`,
		description: "Notes techniques sur le développement Fullstack et l'IA appliquée.",
		site: context.site?.toString() ?? SITE.url,
		trailingSlash: true,
		items: posts
			.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
			.map((post) => ({
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.pubDate,
				link: `/blog/${post.id}/`,
				categories: post.data.tags,
			})),
		customData: `<language>${SITE.lang}</language>`,
	});
}
