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
		link: z.string().url().optional(),
		featured: z.boolean().default(false),
		order: z.number().default(0),
	}),
});

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.date(),
		tags: z.array(z.string()).default([]),
	}),
});

export const collections = { projects, blog };
