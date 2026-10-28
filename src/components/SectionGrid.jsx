import { OLYMPIAD_SECTIONS } from '../sections';
import { LINKS } from '../config';
import ActionLink from './ActionLink';

export function SectionIcon({ name }) {
  switch (name) {
    case 'doc':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
          <path d="M5 3h10l4 4v14H5V3Z" />
          <path d="M15 3v4h4M8 10h8M8 14h8M8 18h5" />
        </svg>
      );
    case 'calendar':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" />
          <path d="M3 10h18M8 3v4M16 3v4" />
          <rect x="7" y="13" width="2" height="2" fill="currentColor" stroke="none" />
          <rect x="11" y="13" width="2" height="2" fill="currentColor" stroke="none" />
          <rect x="15" y="13" width="2" height="2" fill="currentColor" stroke="none" />
          <rect x="7" y="17" width="2" height="2" fill="currentColor" stroke="none" />
          <rect x="11" y="17" width="2" height="2" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'user':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-2c0-3 3.5-5 8-5s8 2 8 5v2" />
        </svg>
      );
    case 'quill':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
          <path d="M20 4c-5 0-10 3.5-12.5 8.5L5 19l6.5-2.5C16.5 14 20 9 20 4Z" />
          <path d="M14 10 5 19M4 21h16" />
        </svg>
      );
    case 'rewind':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" aria-hidden="true">
          <path d="M6 6v12" />
          <polygon points="13,12 19,7 19,17" fill="currentColor" stroke="none" />
          <polygon points="7,12 13,7 13,17" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'check':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true">
          <path d="m4 12.5 5.2 5.2L20 7" />
        </svg>
      );
    case 'photo':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" />
          <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
          <circle cx="11.5" cy="10" r="1.4" fill="currentColor" stroke="none" />
          <path d="m8 16 3-3 2 2 3-3" />
        </svg>
      );
    case 'contact':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
          <rect x="9" y="4" width="12" height="9" />
          <path d="m9 5 6 4.5L21 5" />
          <path d="M4 10c0 6 4 10 10 10l2-2.5-3-2-1.5 1.5c-2.2-.8-4.2-2.8-5-5L8 10.5l-2-3L4 10Z" />
        </svg>
      );
    case 'trophy':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
          <path d="M7 4h10v6a5 5 0 0 1-10 0V4Z" />
          <path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 15v5M8 20h8" />
        </svg>
      );
    default:
      return null;
  }
}

export default function SectionGrid() {
  const visibleSections = OLYMPIAD_SECTIONS.filter((item) => item.showInGrid !== false);

  return (
    <div className="about-sections" id="sections">
      <h2 className="d h2 about-sec-h">Разделы олимпиады</h2>
      <div className="hub-grid">
        {visibleSections.map((item) => {
          const href = LINKS[item.linkKey] || `/sections/${item.slug}`;
          return (
            <ActionLink
              key={item.slug}
              className="hub-card"
              href={href}
              style={{ '--accent': item.accent }}
            >
              <span className="hub-ic">
                <SectionIcon name={item.icon} />
              </span>
              <span className="hub-title">{item.title}</span>
              <i className="ic ic-arrow hub-arrow" aria-hidden="true" />
            </ActionLink>
          );
        })}
      </div>
    </div>
  );
}
