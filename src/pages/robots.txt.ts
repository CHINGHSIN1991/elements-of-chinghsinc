import { createAbsoluteUrl, ensureBasePath, getSiteBaseUrl } from "../ts/siteUrl";

export const prerender = true;

const resolveUrl = (path: string) => createAbsoluteUrl(path) ?? ensureBasePath(path);

export function GET() {
  const sitemapUrl = resolveUrl("/sitemap.xml");
  const host = (() => {
    const base = getSiteBaseUrl();
    if (!base) return undefined;
    try {
      return new URL(base).host;
    } catch {
      return undefined;
    }
  })();

  const lines = ["User-agent: *", "Allow: /", ""]; // blank line before directives

  if (sitemapUrl) {
    lines.push(`Sitemap: ${sitemapUrl}`);
  }

  if (host) {
    lines.push(`Host: ${host}`);
  }

  const body = lines.join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
