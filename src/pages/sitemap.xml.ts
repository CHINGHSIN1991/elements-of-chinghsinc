import { getCollection } from "astro:content";
import { createAbsoluteUrl, ensureBasePath } from "../ts/siteUrl";
import { slugify } from "../ts/utils";

export const prerender = true;

const PAGE_SIZE = 6;

const toIsoDate = (value?: string) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");

const resolveUrl = (path: string) => createAbsoluteUrl(path) ?? ensureBasePath(path);

interface SitemapEntry {
  path: string;
  changefreq?: string;
  priority?: string;
  lastmod?: string;
}

const addEntry = (map: Map<string, SitemapEntry>, entry: SitemapEntry) => {
  const key = entry.path;
  const existing = map.get(key);
  if (!existing) {
    map.set(key, { ...entry });
    return;
  }

  if (!existing.lastmod && entry.lastmod) {
    existing.lastmod = entry.lastmod;
  }

  if (!existing.changefreq && entry.changefreq) {
    existing.changefreq = entry.changefreq;
  }

  if (!existing.priority && entry.priority) {
    existing.priority = entry.priority;
  }
};

const updateLatest = (map: Map<string, number>, value?: string, date?: string) => {
  if (!value) return;
  const slug = slugify(value);
  if (!slug) return;
  const timestamp = date ? new Date(date).getTime() : undefined;
  if (typeof timestamp === "number" && !Number.isNaN(timestamp)) {
    const current = map.get(slug) ?? 0;
    if (timestamp > current) {
      map.set(slug, timestamp);
    }
  } else if (!map.has(slug)) {
    map.set(slug, 0);
  }
};

export async function GET() {
  const [posts, projects] = await Promise.all([
    getCollection("posts", ({ data }) => !data.draft),
    getCollection("projects", ({ data }) => !data.draft),
  ]);

  const entries = new Map<string, SitemapEntry>();

  const staticPages: SitemapEntry[] = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/about", changefreq: "yearly", priority: "0.5" },
    { path: "/project", changefreq: "weekly", priority: "0.8" },
    { path: "/blog", changefreq: "weekly", priority: "0.8" },
    { path: "/contact", changefreq: "yearly", priority: "0.5" },
  ];

  staticPages.forEach((entry) => addEntry(entries, entry));

  posts.forEach((post) => {
    const identifier = post.slug || post.id;
    const path = `/blog/${identifier}`;
    addEntry(entries, {
      path,
      changefreq: "monthly",
      priority: "0.7",
      lastmod: toIsoDate(post.data.date),
    });
  });

  projects.forEach((project) => {
    const identifier = project.id || slugify(project.data.title);
    const path = `/project/${identifier}`;
    addEntry(entries, {
      path,
      changefreq: "monthly",
      priority: "0.7",
      lastmod: toIsoDate(project.data.date),
    });
  });

  const blogCategories = new Map<string, number>();
  const blogTags = new Map<string, number>();

  posts.forEach((post) => {
    updateLatest(blogCategories, post.data.category, post.data.date);
    if (Array.isArray(post.data.tags)) {
      post.data.tags.forEach((tag) => updateLatest(blogTags, tag, post.data.date));
    }
  });

  blogCategories.forEach((timestamp, slug) => {
    addEntry(entries, {
      path: `/blog/category/${slug}`,
      changefreq: "monthly",
      priority: "0.6",
      lastmod: timestamp ? new Date(timestamp).toISOString() : undefined,
    });
  });

  blogTags.forEach((timestamp, slug) => {
    addEntry(entries, {
      path: `/blog/tag/${slug}`,
      changefreq: "monthly",
      priority: "0.5",
      lastmod: timestamp ? new Date(timestamp).toISOString() : undefined,
    });
  });

  const projectCategories = new Map<string, number>();
  const projectTags = new Map<string, number>();

  projects.forEach((project) => {
    updateLatest(projectCategories, project.data.category, project.data.date);
    if (Array.isArray(project.data.tags)) {
      project.data.tags.forEach((tag) =>
        updateLatest(projectTags, tag, project.data.date)
      );
    }
  });

  projectCategories.forEach((timestamp, slug) => {
    addEntry(entries, {
      path: `/project/category/${slug}`,
      changefreq: "monthly",
      priority: "0.6",
      lastmod: timestamp ? new Date(timestamp).toISOString() : undefined,
    });
  });

  projectTags.forEach((timestamp, slug) => {
    addEntry(entries, {
      path: `/project/tag/${slug}`,
      changefreq: "monthly",
      priority: "0.5",
      lastmod: timestamp ? new Date(timestamp).toISOString() : undefined,
    });
  });

  const blogPageCount = Math.ceil(posts.length / PAGE_SIZE);
  for (let page = 2; page <= blogPageCount; page += 1) {
    addEntry(entries, {
      path: `/blog/${page}`,
      changefreq: "weekly",
      priority: "0.6",
    });
  }

  const projectPageCount = Math.ceil(projects.length / PAGE_SIZE);
  for (let page = 2; page <= projectPageCount; page += 1) {
    addEntry(entries, {
      path: `/project/${page}`,
      changefreq: "weekly",
      priority: "0.6",
    });
  }

  const sortedEntries = Array.from(entries.values()).sort((a, b) =>
    a.path.localeCompare(b.path)
  );

  const urlset = sortedEntries
    .map((entry) => {
      const loc = resolveUrl(entry.path);
      if (!loc) return undefined;
      const lines = [`  <url>`, `    <loc>${escapeXml(loc)}</loc>`];
      if (entry.lastmod) {
        lines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
      }
      if (entry.changefreq) {
        lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      }
      if (entry.priority) {
        lines.push(`    <priority>${entry.priority}</priority>`);
      }
      lines.push("  </url>");
      return lines.join("\n");
    })
    .filter(Boolean)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
