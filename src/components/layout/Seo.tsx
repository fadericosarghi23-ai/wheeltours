import { useEffect } from 'react';
import { basePath, localize, useI18n } from '@/lib/i18n';
import { SITE_URL } from '@/data/site';

type Props = { title: string; description?: string; image?: string; noindex?: boolean };

/** Titolo, description, canonical e hreflang EN/IT per pagina. */
export function Seo({ title, description, image, noindex }: Props) {
  const { lang } = useI18n();
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = /wheel tours/i.test(title) ? title : `${title} | Wheel Tours Rome`;
    const meta = (sel: string, attrs: Record<string, string>, content?: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(sel);
      if (!content) {
        el?.remove();
        return;
      }
      if (!el) {
        el = document.createElement('meta');
        Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
        document.head.appendChild(el);
      }
      el.content = content;
    };
    meta('meta[name="description"]', { name: 'description' }, description);
    meta('meta[property="og:title"]', { property: 'og:title' }, document.title);
    meta('meta[property="og:description"]', { property: 'og:description' }, description);
    meta('meta[property="og:image"]', { property: 'og:image' }, image ? SITE_URL + image : undefined);
    meta('meta[property="og:locale"]', { property: 'og:locale' }, lang === 'it' ? 'it_IT' : 'en_US');
    meta('meta[name="robots"]', { name: 'robots' }, noindex ? 'noindex' : undefined);

    const link = (rel: string, href: string, hreflang?: string) => {
      const sel = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
      let el = document.head.querySelector<HTMLLinkElement>(sel);
      if (!el) {
        el = document.createElement('link');
        el.rel = rel;
        if (hreflang) el.hreflang = hreflang;
        document.head.appendChild(el);
      }
      el.href = href;
    };
    const base = basePath(window.location.pathname);
    link('canonical', SITE_URL + localize(base, lang));
    link('alternate', SITE_URL + localize(base, 'en'), 'en');
    link('alternate', SITE_URL + localize(base, 'it'), 'it');
    link('alternate', SITE_URL + localize(base, 'en'), 'x-default');
  }, [title, description, image, lang, noindex]);
  return null;
}
