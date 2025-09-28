import { getCollection } from 'astro:content';

export function invalidResult(): never {
  throw new Error('Invalid result')
}

export function slugify(text: string) {
  if (text) {
    return text
    .toString()
    .toLowerCase()
    // Replace whitespace with dash
    .replace(/\s+/g, '-')
    // Remove or replace special characters, but keep Chinese characters
    .replace(/[^\w\u4e00-\u9fff-]+/g, '')
    // Merge multiple consecutive dashes into one
    .replace(/--+/g, '-')
    // Remove leading dash
    .replace(/^-+/, '')
    // Remove trailing dash
    .replace(/-+$/, '');
  } else {
    return invalidResult()
  }
}

export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    timeZone: "UTC",
  })
}

export function sortAndLimit<T extends { data: { date?: string | number } }>(
  items: T[],
  limit?: number
) {
  const sorted = [...items].sort(
    (a, b) =>
      new Date(b.data.date ?? 0).getTime() -
      new Date(a.data.date ?? 0).getTime()
  );

  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export function getPublishedCollection(collection: string) {
  return getCollection(collection as any, ({ data }) => !data.draft);
}
