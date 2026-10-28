import { Link } from 'react-router-dom';

const FILE_EXT_RE = /\.(pdf|docx?|xlsx?|pptx?|zip|rar)$/i;
const EXTERNAL_URL_RE = /^(https?:)?\/\//i;

export default function ActionLink({ href, children, className = '', target, rel, ...props }) {
  if (!href) {
    return (
      <button
        type="button"
        className={className}
        aria-disabled="true"
        title="Ссылка пока не настроена"
        onClick={() => window.alert('Ссылка пока не настроена. Обратитесь к организаторам: 8 (800) 100-19-34.')}
        {...props}
      >
        {children}
      </button>
    );
  }

  // Внутренние маршруты React Router (кроме прямых ссылок на скачиваемые файлы)
  if (href.startsWith('/') && !href.startsWith('//') && !FILE_EXT_RE.test(href)) {
    return (
      <Link className={className} to={href} {...props}>
        {children}
      </Link>
    );
  }

  const isExternal = EXTERNAL_URL_RE.test(href);
  const resolvedTarget = target ?? (isExternal ? '_blank' : undefined);
  const resolvedRel = rel ?? (resolvedTarget === '_blank' ? 'noopener noreferrer' : undefined);

  return (
    <a className={className} href={href} target={resolvedTarget} rel={resolvedRel} {...props}>
      {children}
    </a>
  );
}
