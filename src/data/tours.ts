import { content, photo, type Photo } from './content';
import { TOURS_IT } from './i18n/tours-it';
import { TOUR_MEDIA, type TourSlug } from './site';
import type { Lang } from '@/lib/i18n';

export type FeatureKind = 'time' | 'group' | 'cart' | 'comfort' | 'food' | 'ticket' | 'child' | 'language' | 'cancel';

/** riconosce il tipo di voce dal testo originale inglese (per scegliere l'icona) */
function kindOf(en: string): FeatureKind {
  if (/cancel/i.test(en)) return 'cancel'; // prima di "hours": "Free cancellation up to 24 hours"
  if (/hours/i.test(en)) return 'time';
  if (/per golf cart/i.test(en)) return 'cart';
  if (/group/i.test(en)) return 'group';
  if (/water|headset/i.test(en)) return 'comfort';
  if (/gelato|pizza/i.test(en)) return 'food';
  if (/ticket/i.test(en)) return 'ticket';
  if (/child/i.test(en)) return 'child';
  if (/language/i.test(en)) return 'language';
  return 'cancel';
}

export type Tour = {
  slug: TourSlug;
  title: string;
  short: string;
  description: string[];
  features: { kind: FeatureKind; text: string }[];
  priceText: string;
  priceAmount: number;
  reviews: number;
  rating: number;
  bokunId: string;
  cover: Photo;
  gallery: Photo[];
};

export function getTours(lang: Lang): Tour[] {
  return content.tours.map((t) => {
    const slug = t.slug as TourSlug;
    const media = TOUR_MEDIA[slug];
    const it = TOURS_IT[slug];
    return {
      slug,
      title: lang === 'it' ? it.title : t.title,
      short: media.short[lang],
      description: lang === 'it' ? it.description : t.description,
      features: t.features.map((f, i) => ({ kind: kindOf(f), text: lang === 'it' ? it.features[i] : f })),
      priceText: lang === 'it' ? it.price : t.price.text,
      priceAmount: t.price.amount,
      reviews: t.reviews,
      rating: t.rating,
      bokunId: t.bokunExperienceId,
      cover: photo(media.cover),
      gallery: media.gallery.map(photo),
    };
  });
}

export const getTour = (lang: Lang, slug: string) => getTours(lang).find((t) => t.slug === slug);
