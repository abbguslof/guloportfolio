import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const thoughts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/thoughts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['tanke', 'guide', 'anteckning']).default('tanke'),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['ACTIVE', 'MAINTAINED', 'COMPLETED', 'WIP', 'ARCHIVED']),
    category: z.enum(['School', 'Homelab', 'Minecraft', 'Web', 'Other']),
    tech: z.array(z.string()),
    repoUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    order: z.number().default(100),
    featured: z.boolean().default(false),
  }),
});

const downloads = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/downloads' }),
  schema: z.object({
    name: z.string(),
    filename: z.string(),
    size: z.string(),
    category: z.string(),
    fileUrl: z.string(),
    description: z.string(),
    usage: z.string().optional(),
    updatedAt: z.string(),
    checksum: z.string().optional(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    relatedProjects: z.array(z.string()).default([]),
    relatedThoughts: z.array(z.string()).default([]),
  }),
});

export const collections = {
  thoughts,
  projects,
  downloads,
};
