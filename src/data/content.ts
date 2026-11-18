import raw from './content.json';

/** Contenuti importati da www.wheel.tours con scripts/import-content.mjs. Non modificare il JSON a mano. */
export type Photo = {
  id: number;
  slug: string;
  original: string;
  alt: string;
  w: number;
  h: number;
  sizes: { lg: { src: string; w: number; h: number }; sm: { src: string; w: number; h: number } };
};

export type TourSource = {
  slug: string;
  title: string;
  titlePlain: string;
  reviews: number;
  rating: number;
  description: string[];
  features: string[];
  price: { text: string; amount: number };
  bokunExperienceId: string;
  image: string | null;
};

export const content = raw as unknown as {
  meta: { title: string; description: string };
  promo: { text: string; code: string };
  hero: { title: string; lines: string[]; background: string | null };
  toursHeading: string;
  tours: TourSource[];
  visit: { title: string; subtitle: string; background: string | null };
  contacts: {
    phone: string;
    phoneHref: string;
    whatsapp: string;
    email: string;
    hours: string;
    address: string;
    tripadvisor: string;
    instagram: string;
  };
  footer: { cta: string; copyright: string };
  legal: { company: string; termsTitle: string; terms: { type: 'h' | 'p' | 'li'; text: string }[] };
  photos: Photo[];
};

const bySlug = new Map(content.photos.map((p) => [p.slug, p]));

export function photo(slug: string): Photo {
  const p = bySlug.get(slug);
  if (!p) throw new Error(`Foto non importata: ${slug}`);
  return p;
}

export const srcSet = (p: Photo) => `${p.sizes.sm.src} ${p.sizes.sm.w}w, ${p.sizes.lg.src} ${p.sizes.lg.w}w`;

/** somma delle recensioni dichiarate sul sito attuale (1375 + 1285 + 375) */
export const totalReviews = content.tours.reduce((a, t) => a + t.reviews, 0);
