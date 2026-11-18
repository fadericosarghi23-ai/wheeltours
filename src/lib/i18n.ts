import { useLocation } from 'react-router-dom';
import { dictionaries, type Dict } from '@/data/i18n/ui';

export type Lang = 'en' | 'it';

/** Inglese senza prefisso (come il sito attuale), italiano sotto /it. */
export function langFromPath(pathname: string): Lang {
  return pathname === '/it' || pathname.startsWith('/it/') ? 'it' : 'en';
}

/** percorso senza prefisso lingua: "/it/tours" -> "/tours" */
export function basePath(pathname: string): string {
  if (pathname === '/it') return '/';
  return pathname.startsWith('/it/') ? pathname.slice(3) : pathname;
}

export function localize(path: string, lang: Lang): string {
  if (lang === 'en') return path;
  return path === '/' ? '/it' : `/it${path}`;
}

export function useI18n(): { lang: Lang; t: Dict; to: (path: string) => string; base: string } {
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  return { lang, t: dictionaries[lang], to: (p) => localize(p, lang), base: basePath(pathname) };
}

export const ROUTES = {
  home: '/',
  tours: '/tours',
  tour: (slug: string) => `/tours/${slug}`,
  visit: '/visit-us',
  terms: '/terms',
  privacy: '/privacy',
  cookies: '/cookies',
};
