import type { AstroGlobal } from 'astro';

const RAW_LOCALES = ['zh-tw', 'en'] as const;

export type Locale = typeof RAW_LOCALES[number];

export const locales: readonly Locale[] = RAW_LOCALES;

export const defaultLocale: Locale = 'zh-tw';

function normalizeBase(base: string | undefined) {
  if (!base || base === '/' || base === './') {
    return '';
  }

  let normalized = base;
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }

  if (normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}

function isLocale(value: string | undefined | null): value is Locale {
  return !!value && locales.includes(value.toLowerCase() as Locale);
}

function toPathname(target: string | URL | AstroGlobal) {
  if (target instanceof URL) {
    return target.pathname;
  }

  if (typeof target === 'object' && 'url' in target) {
    return (target as AstroGlobal).url.pathname;
  }

  if (typeof target === 'string') {
    try {
      if (target.startsWith('http://') || target.startsWith('https://')) {
        return new URL(target).pathname;
      }
    } catch {
      return target;
    }

    return target;
  }

  return '/';
}

function stripBase(pathname: string) {
  const base = normalizeBase(import.meta.env.BASE_URL as string | undefined);

  if (!pathname.startsWith('/')) {
    pathname = `/${pathname}`;
  }

  if (!base) {
    return pathname;
  }

  if (pathname === base) {
    return '/';
  }

  if (pathname.startsWith(`${base}/`)) {
    return pathname.slice(base.length);
  }

  return pathname;
}

export function getLocaleFromPath(target: string | URL | AstroGlobal): Locale {
  const pathname = stripBase(toPathname(target));
  const segments = pathname.replace(/^\//, '').split('/');
  const maybeLocale = segments[0]?.toLowerCase();

  return isLocale(maybeLocale) ? (maybeLocale as Locale) : defaultLocale;
}

export function getPathWithoutLocale(target: string | URL | AstroGlobal) {
  const pathname = stripBase(toPathname(target));
  const segments = pathname.split('/');
  const maybeLocale = segments[1]?.toLowerCase();

  if (isLocale(maybeLocale)) {
    segments.splice(1, 1);
  } else if (segments[0] && isLocale(segments[0].toLowerCase())) {
    segments.splice(0, 1);
  }

  const normalized = segments.join('/') || '/';

  if (normalized === '/') {
    return '/';
  }

  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

function applyBase(path: string) {
  const base = normalizeBase(import.meta.env.BASE_URL as string | undefined);

  if (!base) {
    return path;
  }

  return `${base}${path}`;
}

export function localizePath(target: string | URL | AstroGlobal, locale: Locale) {
  const path = getPathWithoutLocale(target);
  const localized = `/${locale}${path}`;

  return applyBase(localized);
}

export function localizeUrl(target: string | URL | AstroGlobal, locale: Locale) {
  let original: URL;

  if (target instanceof URL) {
    original = new URL(target.toString());
  } else if (typeof target === 'object' && target !== null && 'url' in target) {
    original = new URL((target as AstroGlobal).url.toString());
  } else if (typeof target === 'string') {
    if (target.startsWith('http://') || target.startsWith('https://')) {
      original = new URL(target);
    } else {
      original = new URL(target, 'http://localhost');
    }
  } else {
    original = new URL('http://localhost');
  }

  const localizedPath = localizePath(original, locale);
  original.pathname = localizedPath;

  return original;
}
