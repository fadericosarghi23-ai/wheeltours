import { Link } from 'react-router-dom';
import { localize, useI18n, type Lang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** Selettore EN / IT: porta alla stessa pagina nell'altra lingua. La scelta non viene ricordata: il sito si apre sempre in inglese. */
export function LangSwitch({ className }: { className?: string }) {
  const { lang, base, t } = useI18n();
  const opts: Lang[] = ['en', 'it'];
  return (
    <div role="group" aria-label={t.nav.language} className={cn('relative flex rounded-full border border-white/20 p-0.5 text-xs font-bold', className)}>
      {opts.map((l) => (
        <Link
          key={l}
          to={localize(base, l)}
          hrefLang={l}
          lang={l}
          aria-current={l === lang ? 'true' : undefined}
          className={cn('relative z-10 rounded-full px-2.5 py-1 uppercase transition-colors', l === lang ? 'bg-yellow text-night' : 'text-white/80 hover:text-white')}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
