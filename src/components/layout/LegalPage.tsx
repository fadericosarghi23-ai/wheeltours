import { Fragment, type ReactNode } from 'react';
import { PageHeader } from './PageHeader';
import { Seo } from './Seo';
import { Reveal } from '@/components/motion/Reveal';
import { useI18n } from '@/lib/i18n';
import type { LegalBlock } from '@/data/legal';

/** rende cliccabili gli indirizzi web presenti nel testo */
function linkify(text: string): ReactNode {
  return text.split(/(https?:\/\/[^\s)]+)/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part.replace(/[.,]$/, '')} target="_blank" rel="noopener">
        {part}
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function LegalPage({ title, updated, blocks, note }: { title: string; updated?: string; blocks: LegalBlock[]; note?: string }) {
  const { t, lang } = useI18n();
  return (
    <>
      <Seo title={title} />
      <PageHeader title={[title]} intro={updated ? <p className="text-sm uppercase tracking-[0.16em]">{t.legal.updated}: {new Date(updated).toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p> : undefined} />
      <section className="bg-paper pb-28 pt-14 text-ink sm:pt-20">
        <Reveal className="container-wt">
          <div className="prose-wt max-w-3xl text-[1.02rem] leading-relaxed text-body">
            {note && <p className="rounded-2xl border border-yellow bg-yellow/15 p-4 text-ink">{note}</p>}
            {blocks.map((b, i) => (
              <div key={i}>
                {b.h && <h2>{b.h}</h2>}
                {b.p?.map((p) => <p key={p}>{linkify(p)}</p>)}
                {b.ul && (
                  <ul>
                    {b.ul.map((li) => (
                      <li key={li}>{linkify(li)}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
