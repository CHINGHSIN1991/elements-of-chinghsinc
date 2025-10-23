import siteData from "../data/siteData.json";

const ensureTrailingSlash = (value: string) =>
  value.endsWith("/") ? value : `${value}/`;

export function getSiteBaseUrl() {
  const envSite = typeof import.meta.env.SITE === "string" ? import.meta.env.SITE.trim() : "";
  if (envSite) {
    return ensureTrailingSlash(envSite);
  }

  const dataSite = typeof siteData.site === "string" ? siteData.site.trim() : "";
  if (dataSite) {
    return ensureTrailingSlash(dataSite);
  }

  return undefined;
}

export function getSiteOrigin() {
  const baseUrl = getSiteBaseUrl();
  if (!baseUrl) return undefined;

  try {
    return new URL(baseUrl).origin;
  } catch {
    return undefined;
  }
}

export function createAbsoluteUrl(path?: string, baseUrl = getSiteBaseUrl()) {
  if (!path) return undefined;
  if (/^https?:/i.test(path)) return path;

  if (!baseUrl) return path;

  try {
    const normalizedBase = ensureTrailingSlash(baseUrl);
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    return new URL(`./${normalizedPath}`, normalizedBase).href;
  } catch {
    return path;
  }
}

export function ensureBasePath(path: string) {
  const basePath = typeof import.meta.env.BASE_URL === "string" ? import.meta.env.BASE_URL : "/";
  const normalizedBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  return path.startsWith("/") ? `${normalizedBase}${path}` : `${normalizedBase}/${path}`;
}
