import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string().optional(),
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
  loader: glob({ pattern: '**/*.{json,yaml,yml}', base: './src/content/projects' }),
  schema: z.object({
    id: z.string().optional(),
    title: z.string(),
    description: z.string(),
    date: z.string(),
    category: z.string(),
    tags: z.array(z.string()).optional(),
    cover: z.string(),
    images: z.array(z.object({
      src: z.string(),
      description: z.string().optional()
    })).optional(),
    designers: z.array(z.string()),
    draft: z.boolean().default(false)
  })
});


const educationSchema = z.array(z.object({
  school: z.string(),
  degree: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string()
}));

const workExperienceSchema = z.array(z.object({
  company: z.string(),
  position: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.array(z.string())
}));

const skillsSchema = z.object({
  architecture: z.record(z.any()),
  software: z.record(z.any())
});

const contactInfoSchema = z.object({
  email: z.email(),
  GitHub: z.url(),
  LinkedIn: z.url(),
  about: z.string()
});

const static_content = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/static' }),
  schema: z.discriminatedUnion('_type', [
    z.object({ _type: z.literal('education'), data: educationSchema }),
    z.object({ _type: z.literal('workExperience'), data: workExperienceSchema }),
    z.object({ _type: z.literal('skills'), data: skillsSchema }),
    z.object({ _type: z.literal('contactInfo'), data: contactInfoSchema })
  ])
});

export const collections = { 
  posts,
  projects,
  static: static_content
};