import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/post" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string(),
    image: z.object({
      src: z.string(),
      alt: z.string()
    }),
    draft: z.boolean().default(false),
    category: z.string(),
    tags: z.array(z.string())
  })
});

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

export const collections = { posts, projects };