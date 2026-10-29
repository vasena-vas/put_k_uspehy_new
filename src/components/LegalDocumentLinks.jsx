import { YANDEX_PERSONAL_DATA_POLICY_URL, YANDEX_PRIVACY_POLICY_URL } from '../config';
import ActionLink from './ActionLink';

const documents = [
  {
    title: 'Политика конфиденциальности',
    code: 'СМК-ПВД-3/2-60-25',
    href: YANDEX_PRIVACY_POLICY_URL,
    icon: 'document',
  },
  {
    title: 'Политика обработки и защиты персональных данных',
    code: 'СМК-ПВД-3/2-61-25',
    href: YANDEX_PERSONAL_DATA_POLICY_URL,
    icon: 'shield',
  },
];

function DocumentIcon({ type }) {
  if (type === 'shield') {
    return (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M24 4.5 39.5 11v11.3c0 10-6.6 17.3-15.5 21.2C15.1 39.6 8.5 32.3 8.5 22.3V11L24 4.5Z" stroke="currentColor" strokeWidth="2.2" />
        <path d="m16.5 24.5 5 5L32 19" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M12 5.5h16l9 9v28H12a3 3 0 0 1-3-3v-31a3 3 0 0 1 3-3Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M28 5.5v10h9M16.5 24h16M16.5 30h16M16.5 36h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LegalDocumentLinks({ tone = 'light' }) {
  return (
    <div className={`legal-doc-links legal-doc-links-${tone}`}>
      {documents.map((document) => (
        <ActionLink
          className="legal-doc-card"
          href={document.href}
          key={document.code}
          aria-label={`${document.title}, PDF, открыть на Яндекс Диске`}
        >
          <span className={`legal-doc-icon legal-doc-icon-${document.icon}`}>
            <DocumentIcon type={document.icon} />
          </span>
          <span className="legal-doc-copy">
            <span className="legal-doc-code">{document.code} · PDF</span>
            <strong>{document.title}</strong>
            <span className="legal-doc-open">Открыть официальный документ</span>
          </span>
          <span className="legal-doc-arrow" aria-hidden="true">↗</span>
        </ActionLink>
      ))}
    </div>
  );
}
