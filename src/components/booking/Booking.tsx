import { CalendarDays, ExternalLink, ShieldCheck } from 'lucide-react';
import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { setConsent, useConsent } from '@/lib/consent';
import { useI18n } from '@/lib/i18n';
import { bokunCalendarUrl } from '@/data/site';

/**
 * Prenotazione con Bokun (lo stesso canale del sito attuale).
 * Il widget Bokun NON viene caricato all'apertura della pagina: parte solo dopo il clic su "Book now"
 * e la conferma nel pannello (o se il visitatore ha chiesto di ricordare la scelta).
 */
type Req = { id: string; title: string } | null;
let current: Req = null;
const subs = new Set<() => void>();
const setReq = (r: Req) => {
  current = r;
  subs.forEach((s) => s());
};
const useReq = () =>
  useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => current,
    () => null,
  );

export function BookButton({ experienceId, tourTitle, children, ...rest }: ButtonProps & { experienceId: string; tourTitle: string; children?: ReactNode }) {
  const { t } = useI18n();
  return (
    <Button onClick={() => setReq({ id: experienceId, title: tourTitle })} {...rest}>
      <CalendarDays />
      {children ?? t.nav.book}
    </Button>
  );
}

export function BookingDialog() {
  const req = useReq();
  const { t, lang } = useI18n();
  const remembered = useConsent('bokun');
  const [accepted, setAccepted] = useState(false);
  const [remember, setRemember] = useState(false);
  const show = remembered || accepted;
  const close = () => {
    setReq(null);
    setAccepted(false);
  };
  const url = req ? bokunCalendarUrl(req.id, lang) : '';

  return (
    <Dialog open={!!req} onClose={close} title={t.booking.title} closeLabel={t.booking.close} className="max-w-4xl">
      {req && (
        <div className="flex h-full flex-col">
          <p className="px-5 pt-4 text-sm text-mist sm:px-7">{req.title}</p>
          {show ? (
            <iframe title={`${t.booking.title}: ${req.title}`} src={url} className="mt-3 h-[72svh] w-full border-0 bg-white" allow="payment" />
          ) : (
            <div className="px-5 pb-8 pt-6 sm:px-7">
              <div className="flex gap-4 rounded-2xl border border-white/10 bg-night-soft p-5">
                <ShieldCheck className="mt-0.5 size-6 shrink-0 text-cyan" />
                <p className="text-[0.95rem] leading-relaxed text-mist">{t.booking.notice}</p>
              </div>
              <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-mist">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 accent-[var(--wt-cyan)]" />
                {t.booking.remember}
              </label>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    if (remember) setConsent('bokun', true);
                    setAccepted(true);
                  }}
                >
                  <CalendarDays />
                  {t.booking.open}
                </Button>
                <a href={url} target="_blank" rel="noopener" className="inline-flex h-12 items-center gap-2 px-4 text-sm font-semibold text-white/80 underline-offset-4 hover:text-yellow hover:underline">
                  <ExternalLink className="size-4" />
                  {t.booking.newTab}
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}
