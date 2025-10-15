import { getCollection } from "astro:content";
import siteData from "../data/siteData.json";
import { createAbsoluteUrl, ensureBasePath } from "../ts/siteUrl";

export const prerender = true;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");

const formatRssDate = (value?: string) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toUTCString();
};

const resolveUrl = (path: string) => createAbsoluteUrl(path) ?? ensureBasePath(path);

export async function GET() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  const siteLink = resolveUrl("/") ?? "/";
  const selfLink = resolveUrl("/rss.xml") ?? "/rss.xml";
  const lastBuildDate =
    sortedPosts.length > 0
      ? formatRssDate(sortedPosts[0].data.date)
      : new Date().toUTCString();

  const channelLanguage = (siteData.locale || "en_US").replace("_", "-");

  const itemsXml = sortedPosts
    .map((post) => {
      const identifier = post.slug || post.id;
      const link = resolveUrl(`/blog/${identifier}`);
      const pubDate = formatRssDate(post.data.date);
      const description = post.data.description
        ? `<![CDATA[${post.data.description}]]>`
        : "";
      const categories = [
        post.data.category,
        ...(Array.isArray(post.data.tags) ? post.data.tags : []),
      ].filter(Boolean);

      const categoryXml = categories
        .map((category) => `<category>${escapeXml(category!)}</category>`)
        .join("\n      ");

      return [
        "    <item>",
        `      <title>${escapeXml(post.data.title)}</title>`,
        link ? `      <link>${escapeXml(link)}</link>` : undefined,
        `      <guid isPermaLink="true">${escapeXml(link ?? identifier)}</guid>`,
        description ? `      <description>${description}</description>` : undefined,
        pubDate ? `      <pubDate>${pubDate}</pubDate>` : undefined,
        siteData.author
          ? `      <author>${escapeXml(siteData.author)}</author>`
          : undefined,
        categoryXml ? `      ${categoryXml}` : undefined,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
    "  <channel>\n" +
    `    <title>${escapeXml(siteData.title)} Blog</title>\n` +
    `    <link>${escapeXml(siteLink)}</link>\n` +
    `    <description>${escapeXml(siteData.description)}</description>\n` +
    `    <language>${escapeXml(channelLanguage)}</language>\n` +
    (lastBuildDate ? `    <lastBuildDate>${lastBuildDate}</lastBuildDate>\n` : "") +
    `    <generator>Astro</generator>\n` +
    (selfLink
      ? `    <atom:link href="${escapeXml(selfLink)}" rel="self" type="application/rss+xml" />\n`
      : "") +
    (siteData.author
      ? `    <managingEditor>${escapeXml(siteData.author)}</managingEditor>\n`
      : "") +
    (itemsXml ? `${itemsXml}\n` : "") +
    "  </channel>\n" +
    "</rss>";

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
