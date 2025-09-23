import type { AstroGlobal } from 'astro';
import { defaultLocale, locales, type Locale, ui } from './ui';

type Replacements = Record<string, string | number>;

function stripBase(pathname: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const trimmedBase = base !== '/' && base.endsWith('/') ? base.slice(0, -1) : base;
  if (trimmedBase && trimmedBase !== '/' && pathname.startsWith(trimmedBase)) {
    return pathname.slice(trimmedBase.length);
  }
  return pathname;
}

function getPathSegments(url: URL): string[] {
  const relative = stripBase(url.pathname).replace(/^\/+/, '');
  return relative ? relative.split('/').filter(Boolean) : [];
}

export function getLocaleFromUrl(url: URL): Locale {
  const segments = getPathSegments(url);
  const maybeLocale = segments[0]?.toLowerCase();
  if (maybeLocale && locales.includes(maybeLocale as Locale)) {
    return maybeLocale as Locale;
  }
  return defaultLocale;
}

export function getPathWithoutLocale(url: URL): string {
  const segments = getPathSegments(url);
  if (segments[0] && locales.includes(segments[0] as Locale)) {
    segments.shift();
  }
  const trailingSlash = url.pathname.endsWith('/');
  if (segments.length === 0) {
    return '/';
  }
  const path = `/${segments.join('/')}`;
  return trailingSlash ? `${path}/` : path;
}

export function localizePath(path: string, locale: Locale): string {
  const cleaned = path.replace(/^\/+/, '');
  const trailingSlash = path === '/' || path.endsWith('/');
  const segments = cleaned ? cleaned.split('/').filter(Boolean) : [];
  const localizedSegments = [locale, ...segments];
  let suffix = localizedSegments.join('/');
  if (!suffix) {
    suffix = locale;
  }
  if (trailingSlash) {
    suffix += '/';
  }
  return `${import.meta.env.BASE_URL}${suffix}`;
}

export function localizeUrl(url: URL, locale: Locale): string {
  const segments = getPathSegments(url);
  const trailingSlash = url.pathname.endsWith('/');
  if (segments[0] && locales.includes(segments[0] as Locale)) {
    segments.shift();
  }
  const localizedSegments = [locale, ...segments];
  let suffix = localizedSegments.join('/');
  if (!suffix) {
    suffix = locale;
  }
  if (trailingSlash) {
    suffix += '/';
  }
  return `${import.meta.env.BASE_URL}${suffix}${url.search}${url.hash}`;
}

function getDictionary(locale: Locale) {
  return ui[locale] ?? ui[defaultLocale];
}

function getValue(dictionary: any, key: string) {
  return key.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), dictionary);
}

function applyReplacements(value: string, replacements?: Replacements): string {
  if (!replacements) return value;
  return value.replace(/\{(\w+)\}/g, (match, token) => {
    const replacement = replacements[token];
    return replacement !== undefined ? String(replacement) : match;
  });
}

export function useTranslations(Astro: AstroGlobal, initialLocale?: Locale) {
  const lang = initialLocale ?? (Astro.locals?.locale as Locale | undefined) ?? getLocaleFromUrl(Astro.url);
  const dictionary = getDictionary(lang);

  function t(key: string, replacements?: Replacements): any {
    const result = getValue(dictionary, key);
    if (typeof result === 'string') {
      return applyReplacements(result, replacements);
    }
    if (result === undefined) {
      return key;
    }
    return result;
  }

  return { lang, t } as const;
}

export type TranslationFunction = ReturnType<typeof useTranslations>['t'];
