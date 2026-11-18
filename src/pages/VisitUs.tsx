import { motion } from 'framer-motion';
import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { InstagramIcon } from '@/components/brand/SocialIcons';
import { MapEmbed } from '@/components/consent/MapEmbed';
import { PageHeader } from '@/components/layout/PageHeader';
import { Seo } from '@/components/layout/Seo';
import { WhatsAppIcon } from '@/components/layout/Navbar';
import { Reveal } from '@/components/motion/Reveal';
import { buttonVariants } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { content, photo } from '@/data/content';
import { ADDRESS, MAPS_LINK } from '@/data/site';

export default function VisitUs() {
  const { t } = useI18n();
  const c = content.contacts;
  const cards = [
    { Icon: Phone, label: t.footer.cta, value: c.phone, href: c.phoneHref, accent: 'bg-cyan' },
    { Icon: WhatsAppIcon, label: 'WhatsApp', value: c.phone, href: c.whatsapp, accent: 'bg-whatsapp', ext: true },
    { Icon: Mail, label: 'Email', value: c.email, href: `mailto:${c.email}`, accent: 'bg-yellow text-night' },
    { Icon: InstagramIcon, label: 'Instagram', value: '@wheel.tours', href: c.instagram, accent: 'bg-grey', ext: true },
  ];
  return (
    <>
      <Seo title={t.meta.visitTitle} description={t.meta.visitDescription} />
      <PageHeader kicker={t.visit.subtitle} title={[t.visit.title]} image={photo(content.visit.background ?? 'img-3688-copy-t')} />

      <section className="bg-night pb-24">
        <div className="container-wt grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <Reveal className="rounded-[2rem] border border-white/10 bg-night-soft p-7">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan">
                <MapPin className="size-4" />
                {t.visit.address}
              </p>
              <p className="mt-3 font-display text-4xl uppercase leading-none sm:text-5xl">{ADDRESS}</p>
              <p className="mt-5 flex items-center gap-2 text-mist">
                <Clock className="size-4 text-yellow" />
                {t.visit.hours}, <b className="text-white">{t.visit.hoursValue}</b>
              </p>
              <a href={MAPS_LINK} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: 'yellow' }), 'mt-6')}>
                <Navigation />
                {t.visit.directions}
              </a>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {cards.map(({ Icon, label, value, href, accent, ext }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target={ext ? '_blank' : undefined}
                  rel={ext ? 'noopener' : undefined}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className="group flex flex-col rounded-[1.5rem] border border-white/10 bg-night-soft p-5 transition-colors hover:border-white/30"
                >
                  <span className={cn('grid size-11 place-items-center rounded-2xl text-white transition-transform duration-500 group-hover:rotate-12', accent)}>
                    <Icon className="size-5" />
                  </span>
                  <span className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-mist">{label}</span>
                  <span className="mt-1 break-all font-semibold">{value}</span>
                </motion.a>
              ))}
            </div>
          </div>
          <MapEmbed className="self-start" />
        </div>
      </section>
    </>
  );
}
