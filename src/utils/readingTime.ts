// src/utils/readingTime.ts
// Computes prose word count and estimated reading time (~200 wpm)

export interface ReadingTimeResult {
  minutes: number;
  words: number;
  textEn: string;
  textSv: string;
}

export function calculateReadingTime(content: string): ReadingTimeResult {
  if (!content) {
    return {
      minutes: 1,
      words: 0,
      textEn: '~1 min read',
      textSv: '~1 min läsning',
    };
  }

  // Strip code blocks, HTML tags, and markdown markup for accurate prose counting
  const cleanText = content
    .replace(/```[\s\S]*?```/g, '') // code fences
    .replace(/`.*?`/g, '') // inline code
    .replace(/<[^>]*>/g, '') // HTML tags
    .replace(/^#+\s+/gm, '') // headings
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // links
    .replace(/!\[[^\]]*\]\([^\)]+\)/g, '') // images
    .trim();

  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return {
    minutes,
    words,
    textEn: `~${minutes} min read`,
    textSv: `~${minutes} min läsning`,
  };
}
