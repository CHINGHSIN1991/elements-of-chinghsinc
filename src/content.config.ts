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


const localizedString = z.object({
  'zh-tw': z.string(),
  en: z.string()
});

const localizedStringArray = z.object({
  'zh-tw': z.array(z.string()),
  en: z.array(z.string())
});

const educationSchema = z.array(z.object({
  school: localizedString,
  degree: localizedString,
  location: localizedString,
  startDate: localizedString,
  endDate: localizedString,
  description: localizedString
}));

const workExperienceSchema = z.array(z.object({
  company: localizedString,
  position: localizedString,
  location: localizedString,
  startDate: localizedString,
  endDate: localizedString,
  description: localizedStringArray
}));

const skillsSchema = z.object({
  architecture: z.record(z.any()),
  software: z.record(z.any())
});

const contactInfoSchema = z.object({
  email: z.string().email(),
  GitHub: z.string().url(),
  LinkedIn: z.string().url(),
  about: localizedString
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