import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Navigation, Phone, RotateCcw, Star, Ticket, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { avgRating, Hero } from '@/components/hero/Hero';
import { PhotoRoad } from '@/components/home/PhotoRoad';
import { Seo } from '@/components/layout/Seo';
import { WhatsAppIcon } from '@/components/layout/Navbar';
import { Counter } from '@/components/motion/Counter';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal } from '@/components/motion/Reveal';
import { SplitTitle } from '@/components/motion/SplitTitle';
import { TourCard } from '@/components/tours/TourCard';
import { buttonVariants } from '@/components/ui/button';
import { Stars } from '@/components/ui/stars';
import { ROUTES, useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { content, photo, srcSet, totalReviews } from '@/data/content';
import { ADDRESS, MAPS_LINK } from '@/data/site';
import { getTours } from '@/data/tours';

export default function Home() {
  const { t, to, lang } = useI18n();
  const tours = getTours(lang);
  const locale = lang === 'it' ? 'it-IT' : 'en-US';
  const visitBg = photo(content.visit.background ?? 'img-3688-copy-t');
  const cancel = tours[0].features.find((f) => f.kind === 'cancel')?.text ?? '';
  const c = content.contacts;

  const trust = [
    { Icon: Star, value: `${avgRating.toLocaleString(locale)}/5`, label: <><Counter to={totalReviews} duration={2} /> {t.home.trustReviews}</>, href: undefined as string | undefined },
    { Icon: Users, value: t.home.trustGroup, label: tours[0].features.find((f) => f.kind === 'cart')?.text },
    { Icon: Ticket, value: t.home.trustIncluded, label: t.included.title },
    { Icon: RotateCcw, value: cancel, label: '' },
  ];

  return (
    <>
      <Seo title={t.meta.homeTitle} description={t.meta.homeDescription} image={photo('whatsapp-image-2022-06-26-at-9-35-02-pm').sizes.lg.src} />
      <Hero />

      {/* fascia di fiducia */}
      <section className="bg-night-deep lg:h-[100px]">
        <ul className="container-full grid grid-cols-1 divide-white/10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x">
          {trust.map(({ Icon, value, label, href }, i) => {
            const body = (
              <>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cyan/12 text-cyan">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.95rem] font-semibold text-white">{value}</span>
                  {label && <span className="block text-sm text-mist">{label}</span>}
                </span>
              </>
            );
            return (
              <Reveal key={i} delay={i * 0.06} y={16} className="flex items-center py-5 lg:h-[100px] lg:px-6 lg:py-0 lg:first:pl-0">
                {href ? (
                  <a href={href} target="_blank" rel="noopener" className="flex items-center gap-4 hover:opacity-90">
                    {body}
                  </a>
                ) : (
                  <div className="flex items-center gap-4">{body}</div>
                )}
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* i tour */}
      <section className="bg-paper py-20 text-ink sm:py-28" id="tours">
        <div className="container-wt">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <SplitTitle lines={[t.tours.heading]} className="font-display text-4xl uppercase text-ink sm:text-5xl" />
              <Reveal delay={0.1}>
                <p className="mt-4 text-lg text-body">{t.home.toursIntro}</p>
              </Reveal>
            </div>
            <Link to={to(ROUTES.tours)} className="inline-flex items-center gap-2 font-semibold text-cyan hover:underline">
              {t.nav.allTours} →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour, i) => (
              <TourCard key={tour.slug} tour={tour} index={i} />
            ))}
          </div>
          <Reveal className="mt-8 flex items-center justify-center gap-3 rounded-2xl border border-dashed border-yellow bg-yellow/15 px-5 py-4 text-center text-ink">
            <span className="font-promo text-lg">{t.promo.code}</span>
            <span>{t.promo.text}</span>
          </Reveal>
        </div>
      </section>

      <PhotoRoad />

      {/* valutazioni */}
      <section className="bg-paper-2 py-20 text-ink sm:py-28">
        <div className="container-wt grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <SplitTitle lines={[t.home.ratingsTitle]} className="font-display text-4xl uppercase sm:text-5xl" />
            <Reveal delay={0.1} className="mt-6 flex items-end gap-4">
              <span className="font-display text-8xl leading-none text-ink">{avgRating.toLocaleString(locale)}</span>
              <span className="pb-2">
                <Stars rating={avgRating} label={t.tours.rated(avgRating)} className="text-2xl" />
                <span className="mt-1 block text-body">{t.home.ratingsText(totalReviews.toLocaleString(locale))}</span>
              </span>
            </Reveal>
            <Reveal delay={0.2}>
              <a href={c.tripadvisor} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: 'outline' }), 'mt-8 h-auto min-h-12 whitespace-normal py-3 text-center border-ink/80 text-ink before:bg-ink hover:text-white')}>
                {t.home.readReviews}
                <ExternalLink />
              </a>
            </Reveal>
          </div>
          <ul className="space-y-4">
            {tours.map((tour, i) => (
              <motion.li key={tour.slug} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                <Link to={to(ROUTES.tour(tour.slug))} className="group flex items-center gap-5 rounded-2xl border border-line bg-white p-4 transition hover:shadow-[0_20px_40px_-25px_rgb(27_37_47/0.4)] sm:p-5">
                  <img src={tour.cover.sizes.sm.src} alt="" className="size-16 shrink-0 rounded-xl object-cover sm:size-20" loading="lazy" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold leading-snug group-hover:text-cyan">{tour.short}</span>
                    <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-paper-2">
                      <motion.span className="block h-full rounded-full bg-yellow" initial={{ width: 0 }} whileInView={{ width: `${(tour.rating / 5) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }} />
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-xl font-bold">{tour.rating.toFixed(1)}</span>
                    <span className="block text-xs text-body">
                      {tour.reviews} {t.tours.reviews}
                    </span>
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* welcome to Rome */}
      <section className="relative isolate overflow-hidden">
        <ParallaxImage src={visitBg.sizes.lg.src} srcSet={srcSet(visitBg)} alt="" className="absolute inset-0 -z-10 h-full" strength={12} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night/90 via-night/70 to-night/30" />
        <div className="container-wt grid min-h-[70svh] items-center gap-10 py-24 lg:grid-cols-2">
          <div>
            <SplitTitle lines={[t.visit.title]} className="font-display text-4xl uppercase text-white sm:text-6xl" />
            <Reveal delay={0.1}>
              <p className="mt-4 text-lg font-semibold uppercase tracking-[0.1em] text-white/90">{t.visit.subtitle}</p>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="rounded-3xl bg-white p-6 text-ink shadow-2xl sm:p-8">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-body">
              <MapPin className="size-4 text-cyan" />
              {t.visit.address}
            </p>
            <p className="mt-2 text-2xl font-semibold">{ADDRESS}</p>
            <p className="mt-1 text-body">
              {t.visit.hours}, {t.visit.hoursValue}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <a href={MAPS_LINK} target="_blank" rel="noopener" className={cn(buttonVariants({ size: 'sm' }), 'w-full')}>
                <Navigation />
                Maps
              </a>
              <a href={c.whatsapp} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: 'whatsapp', size: 'sm' }), 'w-full')}>
                <WhatsAppIcon className="size-4" />
                WhatsApp
              </a>
              <a href={c.phoneHref} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full border-ink/70 text-ink before:bg-ink hover:text-white')}>
                <Phone />
                {t.home.call}
              </a>
            </div>
            <Link to={to(ROUTES.visit)} className="mt-5 inline-block text-sm font-semibold text-cyan hover:underline">
              {t.visit.cta} →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
