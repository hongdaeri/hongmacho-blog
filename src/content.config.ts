import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    category: z.enum(['dev', 'invest', 'learn', 'daily']),
    excerpt: z.string().max(140),
    featured: z.boolean().optional().default(false),
    tags: z.array(z.string()).min(1),
    readTime: z.number().optional(),
  }),
});

export const collections = { blog };
