import { getCollection, type CollectionKey } from 'astro:content';

export function invalidResult(): never {
  throw new Error('Invalid result');
}

export function slugify(text: string) {
  if (text) {
    return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
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

export function getPublishedCollection<K extends CollectionKey>(collectionName: K) {
  return getCollection(collectionName, ({ data }) => !data.draft);
}
