import { LegalPage } from '@/components/layout/LegalPage';
import { useI18n } from '@/lib/i18n';
import { PRIVACY } from '@/data/legal';

export default function Privacy() {
  const { lang } = useI18n();
  const d = PRIVACY[lang];
  return <LegalPage title={d.title} updated={d.updated} blocks={d.blocks} />;
}
