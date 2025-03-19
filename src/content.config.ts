import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/project" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    tags: z.array(z.string()).optional(),
    cover: z.string(),
    images: z.array(z.string()).optional(),
    designers: z.array(z.string()),
    draft: z.boolean().default(false)
  })
});

export const collections = { projects };