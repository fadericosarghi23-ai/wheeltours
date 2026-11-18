import { LegalPage } from '@/components/layout/LegalPage';
import { useI18n } from '@/lib/i18n';
import { COOKIES } from '@/data/legal';

export default function Cookies() {
  const { lang } = useI18n();
  const d = COOKIES[lang];
  return <LegalPage title={d.title} updated={d.updated} blocks={d.blocks} />;
}
