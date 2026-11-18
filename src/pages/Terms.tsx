import { LegalPage } from '@/components/layout/LegalPage';
import { useI18n } from '@/lib/i18n';
import { content } from '@/data/content';
import type { LegalBlock } from '@/data/legal';

/** Termini e condizioni: testo integrale importato dal sito attuale (solo inglese). */
function toBlocks(src: typeof content.legal.terms): LegalBlock[] {
  const out: LegalBlock[] = [];
  for (const b of src) {
    const last = out[out.length - 1];
    if (b.type === 'h') out.push({ h: b.text });
    else if (b.type === 'li') {
      if (last && last.ul && !last.p?.length) last.ul.push(b.text);
      else if (last) (last.ul ??= []).push(b.text);
      else out.push({ ul: [b.text] });
    } else if (last && !last.ul) (last.p ??= []).push(b.text);
    else out.push({ p: [b.text] });
  }
  return out;
}

export default function Terms() {
  const { t, lang } = useI18n();
  return <LegalPage title={lang === 'it' ? t.footer.terms : content.legal.termsTitle} blocks={toBlocks(content.legal.terms)} note={lang === 'it' ? t.legal.termsNote : undefined} />;
}
