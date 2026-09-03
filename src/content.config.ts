import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		subtitle: z.string(),
		stack: z.array(z.string()),
		summary: z.string(),
		context: z.string(),
		challenges: z.string(),
		solution: z.string(),
		results: z.string(),
		link: z.url().optional(),
		featured: z.boolean().default(false),
		order: z.number().default(0),
	}),
});

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	/*
	 * Les longueurs sont contraintes ici plutôt que vérifiées après coup. Un
	 * titre au-delà d'une soixantaine de caractères et une description au-delà
	 * de cent cinquante-cinq sont tronqués dans les résultats de recherche et
	 * dans les aperçus de partage : autant que la compilation le refuse, plutôt
	 * que de le découvrir sur un lien déjà diffusé.
	 */
	schema: z.object({
		title: z.string().max(60),
		description: z.string().max(155),
		pubDate: z.date(),
		/** Renseignée seulement si l'article est retouché après publication. */
		updatedDate: z.date().optional(),
		tags: z.array(z.string()).default([]),
	}),
});

export const collections = { projects, blog };
