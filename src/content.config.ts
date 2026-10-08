import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Robust preprocessors to gracefully handle empty, null, or whitespace-only YAML frontmatter values
const optionalString = z.preprocess((val) => {
  if (val === null || val === undefined) return undefined;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed === '' || trimmed === '""' || trimmed === "''") return undefined;
    return trimmed;
  }
  return val;
}, z.string().optional());

const optionalUrl = z.preprocess((val) => {
  if (val === null || val === undefined) return undefined;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed === '' || trimmed === '""' || trimmed === "''") return undefined;
    return trimmed;
  }
  return val;
}, z.string().url().optional());

const optionalStringArray = z.preprocess((val) => {
  if (val === null || val === undefined) return [];
  if (Array.isArray(val)) {
    return val
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed === '' || trimmed === '[]') return [];
    return [trimmed];
  }
  return val;
}, z.array(z.string()).default([]));

const thoughts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/thoughts' }),
  schema: z.object({
    title: z.string().default('Untitled Note'),
    description: optionalString,
    pubDate: z.coerce.date().default(() => new Date()),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['tanke', 'thought', 'guide', 'anteckning', 'note', 'idea', 'idé']).default('tanke'),
    tags: optionalStringArray,
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    pdfUrl: optionalString,
    pdfName: optionalString,
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['ACTIVE', 'MAINTAINED', 'COMPLETED', 'WIP', 'ARCHIVED']),
    category: z.enum(['School', 'Homelab', 'Minecraft', 'Web', 'Other']),
    tech: optionalStringArray,
    repoUrl: optionalUrl,
    liveUrl: optionalUrl,
    order: z.number().default(100),
    featured: z.boolean().default(false),
    pdfUrl: optionalString,
    pdfName: optionalString,
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
