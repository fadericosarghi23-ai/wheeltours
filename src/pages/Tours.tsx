import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BookButton } from '@/components/booking/Booking';
import { PageHeader } from '@/components/layout/PageHeader';
import { Seo } from '@/components/layout/Seo';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal } from '@/components/motion/Reveal';
import { SplitTitle } from '@/components/motion/SplitTitle';
import { FeatureIcon } from '@/components/tours/FeatureIcon';
import { GroupCalculator } from '@/components/tours/GroupCalculator';
import { TourQuiz } from '@/components/tours/TourQuiz';
import { Stars } from '@/components/ui/stars';
import { ROUTES, useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { photo, srcSet } from '@/data/content';
import { getTours } from '@/data/tours';

export default function Tours() {
  const { t, to, lang } = useI18n();
  const tours = getTours(lang);
  return (
    <>
      <Seo title={t.meta.toursTitle} description={t.meta.toursDescription} image={tours[0].cover.sizes.lg.src} />
      <PageHeader kicker={t.tours.heading} title={[t.toursPage.title]} intro={<p>{t.toursPage.intro}</p>} image={photo('unnamed-1-scaled-e1666344965191')} />

      <section className="bg-paper pb-24 pt-16 text-ink sm:pt-24">
        <div className="container-wt space-y-20 sm:space-y-28">
          {tours.map((tour, i) => (
            <article key={tour.slug} className={cn('grid items-center gap-8 lg:grid-cols-2 lg:gap-16', i % 2 && 'lg:[&>*:first-child]:order-2')}>
              <Link to={to(ROUTES.tour(tour.slug))} className="group relative block" aria-label={tour.title}>
                <ParallaxImage src={tour.cover.sizes.lg.src} srcSet={srcSet(tour.cover)} sizes="(min-width:1024px) 50vw, 100vw" alt="" className="aspect-[4/3] rounded-2xl" strength={8} />
              </Link>
              <div>
                <Reveal>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-body">
                    <Stars rating={tour.rating} label={t.tours.rated(tour.rating)} className="text-lg" />
                    <b className="text-ink">{tour.reviews}</b> {t.tours.reviews}
                  </div>
                  <h2 className="mt-3 font-sans text-2xl font-semibold leading-tight text-ink sm:text-3xl">
                    <Link to={to(ROUTES.tour(tour.slug))} className="transition-colors hover:text-cyan">
                      {tour.title}
                    </Link>
                  </h2>
                  <p className="mt-4 leading-relaxed text-body">{tour.description[0]}</p>
                </Reveal>
                <ul className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {tour.features.map((f, k) => (
                    <motion.li key={f.text} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: k * 0.05 }} className="flex items-start gap-2.5 text-sm text-ink">
                      <FeatureIcon kind={f.kind} className="mt-0.5 size-4 shrink-0 text-cyan" />
                      {f.text}
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <p className="text-2xl font-bold">{tour.priceText}</p>
                  <BookButton experienceId={tour.bokunId} tourTitle={tour.title} />
                  <Link to={to(ROUTES.tour(tour.slug))} className="group inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:underline">
                    {t.tours.discover}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-night py-24 sm:py-32">
        <div className="container-wt grid gap-14 xl:grid-cols-[1fr_1.25fr]">
          <div>
            <SplitTitle lines={[t.quiz.title]} className="mb-8 font-display text-4xl uppercase text-white sm:text-5xl" />
            <TourQuiz />
          </div>
          <div>
            <SplitTitle lines={[t.calc.title]} className="mb-8 font-display text-4xl uppercase text-white sm:text-5xl" />
            <GroupCalculator />
          </div>
        </div>
      </section>
    </>
  );
}
