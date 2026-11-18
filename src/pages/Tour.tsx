import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowLeft, Check, Phone } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookButton } from '@/components/booking/Booking';
import { PageHeader } from '@/components/layout/PageHeader';
import { Seo } from '@/components/layout/Seo';
import { WhatsAppIcon } from '@/components/layout/Navbar';
import { Reveal } from '@/components/motion/Reveal';
import { AppianDescent } from '@/components/tours/AppianDescent';
import { DayNight } from '@/components/tours/DayNight';
import { FeatureIcon } from '@/components/tours/FeatureIcon';
import { Gallery } from '@/components/tours/Gallery';
import { RouteMap } from '@/components/tours/RouteMap';
import { TourCard } from '@/components/tours/TourCard';
import { Stars } from '@/components/ui/stars';
import { ROUTES, useI18n } from '@/lib/i18n';
import { content } from '@/data/content';
import { getTour, getTours, type Tour as TourT } from '@/data/tours';
import NotFound from './NotFound';

/** sezione interattiva diversa per ogni tour, in un riquadro scuro dentro la pagina */
function Interactive({ tour }: { tour: TourT }) {
  const { t } = useI18n();
  const [title, hint, body] =
    tour.slug === 'rome-highlights-golf-cart-tour'
      ? [t.route.title, null, <RouteMap />]
      : tour.slug === 'catacombs-appian-way-golf-cart-tour'
        ? [t.appian.title, t.appian.hint, <AppianDescent />]
        : [t.dayNight.title, null, <DayNight />];
  return (
    <section className="rounded-3xl bg-night p-5 text-white sm:p-8">
      <h2 className="font-display text-3xl uppercase sm:text-4xl">{title}</h2>
      {hint && <p className="mt-2 text-mist">{hint}</p>}
      <div className="mt-6">{body}</div>
    </section>
  );
}

function H2({ children }: { children: string }) {
  return <h2 className="font-display text-3xl uppercase text-ink sm:text-4xl">{children}</h2>;
}

export default function Tour() {
  const { slug = '' } = useParams();
  const { t, to, lang } = useI18n();
  const tour = getTour(lang, slug);
  const [bar, setBar] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (v) => setBar(v > 600));
  if (!tour) return <NotFound />;
  const others = getTours(lang).filter((x) => x.slug !== tour.slug);
  const f = (k: string) => tour.features.find((x) => x.kind === k);
  const price = tour.priceText.match(/€\s?\d+/)?.[0];
  const reassurance = [f('cancel'), f('group'), f('comfort')].filter(Boolean);
  const c = content.contacts;

  return (
    <>
      <Seo title={tour.title.replace(/\p{Extended_Pictographic}/gu, '').trim()} description={tour.description[0].slice(0, 158)} image={tour.cover.sizes.lg.src} />
      <PageHeader
        kicker={tour.short}
        title={[tour.title]}
        image={tour.cover}
        className="min-h-[72svh] content-end"
        titleClassName="text-[2rem] sm:text-4xl lg:text-5xl max-w-5xl"
        intro={
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base">
            <Stars rating={tour.rating} label={t.tours.rated(tour.rating)} className="text-lg" />
            <b className="text-white">{tour.rating.toFixed(1)}</b>
            <span>
              ({tour.reviews} {t.tours.reviews})
            </span>
          </div>
        }
      >
        <div className="mt-6 flex flex-wrap gap-2">
          {[f('time'), f('group'), f('cart')].filter(Boolean).map((x) => (
            <span key={x!.text} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              <FeatureIcon kind={x!.kind} className="size-4 text-cyan" />
              {x!.text}
            </span>
          ))}
        </div>
      </PageHeader>

      <div className="bg-paper text-ink">
        <div className="container-wt grid gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_360px] lg:gap-14">
          <div className="min-w-0 space-y-14">
            <Link to={to(ROUTES.tours)} className="inline-flex items-center gap-2 text-sm font-semibold text-body hover:text-cyan">
              <ArrowLeft className="size-4" />
              {t.tour.back}
            </Link>

            <Reveal className="-mt-6">
              <H2>{t.tour.overview}</H2>
              <div className="mt-4 space-y-4 text-lg leading-relaxed text-body">
                {tour.description.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>

            <div>
              <H2>{t.tour.included}</H2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {tour.features.map((x, i) => (
                  <motion.li
                    key={x.text}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '0px 0px -5% 0px' }}
                    transition={{ delay: (i % 2) * 0.06 + Math.floor(i / 2) * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-3 rounded-xl border border-line p-4"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-cyan/10 text-cyan">
                      <FeatureIcon kind={x.kind} className="size-[18px]" />
                    </span>
                    <span className="pt-1.5 text-[0.95rem] leading-snug">{x.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <Interactive tour={tour} />

            <div>
              <H2>{t.tour.gallery}</H2>
              <Gallery photos={tour.gallery} alt={tour.title} className="mt-5" />
            </div>
          </div>

          {/* box di prenotazione sempre visibile */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_30px_60px_-35px_rgb(27_37_47/0.45)]">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-body">{t.tour.from}</p>
              <p className="mt-1">
                <span className="text-4xl font-bold">{price}</span> <span className="text-body">{t.tour.perPerson}</span>
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm text-body">
                <Stars rating={tour.rating} label={t.tours.rated(tour.rating)} />
                {tour.rating.toFixed(1)} · {tour.reviews} {t.tours.reviews}
              </div>
              <BookButton experienceId={tour.bokunId} tourTitle={tour.title} size="lg" className="mt-6 w-full" />
              <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm">
                {reassurance.map((x) => (
                  <li key={x!.text} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-cyan" strokeWidth={3} />
                    {x!.text}
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-xl bg-yellow/20 px-4 py-3 text-center text-sm">
                {t.promo.text.split(t.promo.code)[0]}
                <b className="font-promo">{t.promo.code}</b>
                {t.promo.text.split(t.promo.code)[1]}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2 border-t border-line pt-5">
                <a href={c.whatsapp} target="_blank" rel="noopener" className="flex items-center justify-center gap-2 rounded-full bg-whatsapp/12 px-3 py-2.5 text-sm font-semibold text-ink transition hover:bg-whatsapp hover:text-white">
                  <WhatsAppIcon className="size-4" />
                  WhatsApp
                </a>
                <a href={c.phoneHref} className="flex items-center justify-center gap-2 rounded-full bg-paper-2 px-3 py-2.5 text-sm font-semibold transition hover:bg-ink hover:text-white">
                  <Phone className="size-4" />
                  {t.home.call}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <section className="bg-paper-2 py-16 text-ink sm:py-24">
        <div className="container-wt">
          <H2>{t.tour.others}</H2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {others.map((x, i) => (
              <TourCard key={x.slug} tour={x} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* su mobile: barra di prenotazione in basso */}
      <AnimatePresence>
        {bar && (
          <motion.div initial={{ y: 120 }} animate={{ y: 0 }} exit={{ y: 120 }} transition={{ type: 'spring', damping: 26, stiffness: 260 }} className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white px-4 py-3 text-ink shadow-[0_-10px_30px_-15px_rgb(0_0_0/0.3)] lg:hidden">
            <div className="flex items-center justify-between gap-4">
              <p className="leading-tight">
                <span className="block text-[0.7rem] uppercase tracking-wide text-body">{t.tour.from}</span>
                <b className="text-xl">{price}</b> <span className="text-sm text-body">{t.tour.perPerson}</span>
              </p>
              <BookButton experienceId={tour.bokunId} tourTitle={tour.title} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
