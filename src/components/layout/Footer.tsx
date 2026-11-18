import { motion } from 'framer-motion';
import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react';
import { InstagramIcon } from '@/components/brand/SocialIcons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/brand/Logo';
import { WhatsAppIcon } from './Navbar';
import { ROUTES, useI18n } from '@/lib/i18n';
import { clearConsent } from '@/lib/consent';
import { lenisStore } from '@/lib/motion';
import { content } from '@/data/content';
import { COMPANY, MAPS_LINK, ADDRESS } from '@/data/site';
import { getTours } from '@/data/tours';

function TripadvisorIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="7" cy="13" r="3.6" />
      <circle cx="17" cy="13" r="3.6" />
      <circle cx="7" cy="13" r="1" fill="currentColor" />
      <circle cx="17" cy="13" r="1" fill="currentColor" />
      <path d="M2 8.5h3.2M22 8.5h-3.2M5.2 8.5C7.3 6.9 9.6 6 12 6s4.7.9 6.8 2.5M12 17.5l-1.6-2M12 17.5l1.6-2" strokeLinecap="round" />
    </svg>
  );
}

export function Footer() {
  const { t, to, lang } = useI18n();
  const c = content.contacts;
  const [cleared, setCleared] = useState(false);
  const tours = getTours(lang);
  const year = new Date().getFullYear();

  const toTop = () => {
    if (lenisStore.current) lenisStore.current.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-night-deep pt-20 text-mist">
      <div className="container-wt relative">
        <div className="flex flex-col items-start justify-between gap-10 border-b border-white/10 pb-14 lg:flex-row lg:items-end">
          <div>
            <p className="font-display text-[2.2rem] uppercase leading-none text-white sm:text-5xl">{t.footer.cta}</p>
            <a href={c.phoneHref} className="group mt-5 inline-flex items-center gap-4 font-display text-4xl text-cyan transition-colors hover:text-yellow sm:text-6xl">
              <Phone className="size-8 transition-transform group-hover:-rotate-12 sm:size-12" />
              {c.phone}
            </a>
          </div>
          <button
            type="button"
            onClick={toTop}
            className="group flex items-center gap-3 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.12em] text-white hover:text-yellow"
          >
            {t.footer.backTop}
            <span className="grid size-11 place-items-center rounded-full border border-white/20 transition group-hover:border-yellow">
              <ArrowUp className="size-4" />
            </span>
          </button>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to={to(ROUTES.home)} className="block h-14" aria-label="Wheel Tours">
              <Logo className="h-full" />
            </Link>
            <p className="mt-5 text-sm font-semibold uppercase tracking-wide">{t.hero.title}</p>
          </div>
          <div>
            <p className="mb-4 font-display text-xl uppercase text-white">{t.nav.tours}</p>
            <ul className="space-y-2 text-sm">
              {tours.map((x) => (
                <li key={x.slug}>
                  <Link className="link-underline" to={to(ROUTES.tour(x.slug))}>
                    {x.short}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="link-underline" to={to(ROUTES.visit)}>
                  {t.nav.visit}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-4 font-display text-xl uppercase text-white">{t.visit.address}</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href={MAPS_LINK} target="_blank" rel="noopener" className="flex items-start gap-2 hover:text-yellow">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-cyan" />
                  <span>
                    {ADDRESS}
                    <br />
                    {t.visit.hours}, {t.visit.hoursValue}
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${c.email}`} className="flex items-center gap-2 hover:text-yellow">
                  <Mail className="size-4 text-cyan" />
                  {c.email}
                </a>
              </li>
              <li>
                <a href={c.whatsapp} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-yellow">
                  <WhatsAppIcon className="size-4 text-whatsapp" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-4 font-display text-xl uppercase text-white">Social</p>
            <div className="flex gap-3">
              {[
                { href: c.tripadvisor, label: 'Tripadvisor', Icon: TripadvisorIcon },
                { href: c.instagram, label: 'Instagram', Icon: InstagramIcon },
              ].map(({ href, label, Icon }) => (
                <motion.a key={label} href={href} target="_blank" rel="noopener" aria-label={label} whileHover={{ y: -4, rotate: -6 }} className="grid size-12 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-yellow hover:text-yellow">
                  <Icon className="size-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Wheel Tours{COMPANY.name ? `, ${COMPANY.name}` : ''}
            {COMPANY.vat ? ` · ${t.footer.vat} ${COMPANY.vat}` : ''}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link className="link-underline" to={to(ROUTES.terms)}>
                {t.footer.terms}
              </Link>
            </li>
            <li>
              <Link className="link-underline" to={to(ROUTES.privacy)}>
                {t.footer.privacy}
              </Link>
            </li>
            <li>
              <Link className="link-underline" to={to(ROUTES.cookies)}>
                {t.footer.cookies}
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="link-underline"
                onClick={() => {
                  clearConsent();
                  setCleared(true);
                }}
              >
                {t.footer.choices}
                {cleared ? ' ✓' : ''}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
