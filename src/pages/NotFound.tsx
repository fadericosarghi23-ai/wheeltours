import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WheelGlyph } from '@/components/brand/WheelGlyph';
import { Seo } from '@/components/layout/Seo';
import { buttonVariants } from '@/components/ui/button';
import { ROUTES, useI18n } from '@/lib/i18n';

export default function NotFound() {
  const { t, to } = useI18n();
  return (
    <section className="relative flex min-h-[90svh] items-center overflow-hidden bg-night pt-28">
      <Seo title={t.notFound.title} noindex />
      <div className="container-wt grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="font-display text-[8rem] leading-none text-yellow sm:text-[11rem]">404</p>
          <h1 className="font-display text-5xl uppercase text-white">{t.notFound.title}</h1>
          <p className="mt-4 text-mist">{t.notFound.text}</p>
          <Link to={to(ROUTES.home)} className={`${buttonVariants()} mt-8`}>
            {t.notFound.back}
          </Link>
        </div>
        <motion.div className="mx-auto w-56 sm:w-72" animate={{ x: [-30, 30, -30], rotate: [-120, 120, -120] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
          <WheelGlyph className="size-full" />
        </motion.div>
      </div>
    </section>
  );
}
