import { getCollection, type CollectionKey } from 'astro:content';

/**
 * Collections that share the article shape (title / date / category / tags).
 * Narrower than CollectionKey, which also includes `static` — a discriminated
 * union with none of those fields.
 */
export type ContentCollectionKey = Extract<CollectionKey, 'posts' | 'projects'>;

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

/**
 * Machine-readable date for the HTML `datetime` attribute (YYYY-MM-DD).
 * A Date's toString() is not a valid datetime value.
 */
export function toDateAttr(date: Date | string | number) {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? undefined
    : parsed.toISOString().slice(0, 10);
}

// `date` must allow Date: `z.coerce.date()` in the schema produces Date objects,
// and a narrower constraint makes TS fall back to inferring T as the constraint
// itself, which loses `id`/`title`/`category` at every call site.
export function sortAndLimit<T extends { data: { date?: string | number | Date } }>(
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

export function getPublishedCollection<T extends CollectionKey>(collection: T) {
  return getCollection(collection, (entry) => !(entry.data as { draft?: boolean }).draft);
}
