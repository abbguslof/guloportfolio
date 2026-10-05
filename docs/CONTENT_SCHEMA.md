# Content Collections & Datastruktur

Alla Markdown-filer styrs via Astro Content Collections i `src/content/config.ts`.

## 1. Schema: Tankar / Blogg (`src/content/thoughts/`)
Filformat: `.md` eller `.mdx`

```typescript
import { defineCollection, z } from 'astro:content';

const thoughts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});