import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
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
  type: 'data',
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
  email: z.string().email(),
  GitHub: z.string().url(),
  LinkedIn: z.string().url(),
  about: z.string()
});

const static_content = defineCollection({
  type: 'data',
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