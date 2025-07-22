import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string(),
    image: z.object({
      src: z.string(),
      alt: z.string().optional().default("")
    }),
    draft: z.boolean().default(false),
    category: z.string(),
    tags: z.array(z.string())
  })
});

const projects = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    description: z.string(),
    date: z.string(),
    category: z.string(),
    tags: z.array(z.string()).optional(),
    cover: z.string(),
    images: z.array(z.string()).optional(),
    designers: z.array(z.string()),
    draft: z.boolean().default(false)
  })
});

export const collections = { posts, projects };