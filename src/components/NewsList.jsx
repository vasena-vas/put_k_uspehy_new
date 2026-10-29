import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchYandexNews } from '../yandexDisk';
import { news as fallbackNews } from '../data';

export default function NewsList({ limit }) {
  const [items, setItems] = useState(null);
  const [failed, setFailed] = useState(false);
  const [failureReason, setFailureReason] = useState('');

  useEffect(() => {
    let alive = true;
    fetchYandexNews()
      .then((loaded) => {
        if (alive) {
          setItems(loaded.length ? loaded : fallbackNews);
          setFailed(false);
          setFailureReason('');
        }
      })
      .catch((err) => {
        console.error('[Yandex Disk: news]', err);
        if (alive) {
          setItems(fallbackNews);
          setFailed(true);
          setFailureReason(err instanceof Error ? `${err.name}: ${err.message}` : String(err));
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  if (items === null) {
    const count = limit || 4;
    return (
      <div className="news-loading" aria-busy="true" aria-live="polite">
        {Array.from({ length: count }, (_, idx) => (
          <div className="news-item news-skeleton" key={idx}>
            <div className="news-skel-lines">
              <span className="skel-bar skel-title" />
              <span className="skel-bar skel-date" />
            </div>
            <span className="skel-bar skel-btn" />
          </div>
        ))}
      </div>
    );
  }

  const list = limit ? items.slice(0, limit) : items;

  return (
    <>
      {failed && (
        <div className="news-note" role="status">
          <p>Не удалось обновить таблицу Яндекс Диска — показаны сохранённые новости.</p>
          {import.meta.env.DEV && failureReason && (
            <details className="yandex-debug">
              <summary>Техническая причина (режим разработки)</summary>
              <pre>{failureReason}</pre>
            </details>
          )}
        </div>
      )}
      {list.map((n) => (
        <article className="news-item" key={n.id}>
          <div>
            <h4>{n.title}</h4>
            <time>{n.date}</time>
          </div>
          <Link className="btn" to={`/news/${n.id}`}>
            Читать полностью
          </Link>
        </article>
      ))}
    </>
  );
}
