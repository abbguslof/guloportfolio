// src/utils/projects.ts - Localized Project Loader & Slug Grouping
import { getCollection, type CollectionEntry } from 'astro:content';

export interface GroupedProject {
  slug: string;
  en: CollectionEntry<'projects'>;
  sv: CollectionEntry<'projects'>;
}

export async function getGroupedProjects(): Promise<GroupedProject[]> {
  const allProjects = await getCollection('projects');
  const projectMap = new Map<string, { slug: string; en?: CollectionEntry<'projects'>; sv?: CollectionEntry<'projects'> }>();

  for (const p of allProjects) {
    const slug = p.id.replace(/^(en|sv)\//, '');
    const isSv = p.id.startsWith('sv/');

    if (!projectMap.has(slug)) {
      projectMap.set(slug, { slug });
    }

    const item = projectMap.get(slug)!;
    if (isSv) {
      item.sv = p;
    } else {
      item.en = p;
    }
  }

  // Ensure fallback if one language is missing
  const grouped: GroupedProject[] = [];
  for (const [slug, pair] of projectMap.entries()) {
    const en = pair.en || pair.sv!;
    const sv = pair.sv || pair.en!;
    grouped.push({ slug, en, sv });
  }

  // Sort by defined order in frontmatter
  return grouped.sort((a, b) => (a.en.data.order ?? 100) - (b.en.data.order ?? 100));
}
