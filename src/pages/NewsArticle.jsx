import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchYandexNews } from '../yandexDisk';
import { news as fallbackNews } from '../data';

export default function NewsArticle() {
  const { id } = useParams();
  const [items, setItems] = useState(null);

  useEffect(() => {
    let alive = true;
    fetchYandexNews()
      .then((loaded) => {
        if (alive) setItems(loaded.length ? loaded : fallbackNews);
      })
      .catch((err) => {
        console.error('[Yandex Disk: news article]', err);
        if (alive) setItems(fallbackNews);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (items === null) {
    return (
      <main className="sec inner article">
        <Link className="btn back" to="/news">
          ← Все новости
        </Link>
        <div className="article-body">
          <p>Загрузка новости...</p>
        </div>
      </main>
    );
  }

  const item = items.find((n) => String(n.id) === String(id));

  return (
    <main className="sec inner article">
      <Link className="btn back" to="/news">
        ← Все новости
      </Link>
      {item ? (
        <>
          <h1>{item.title}</h1>
          <time>{item.date}</time>
          <div className="article-body news-article-body">
            {item.image && (
              <img
                className="news-article-img"
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            )}
            {(item.body || '')
              .split(/\n+/)
              .map((line) => line.trim())
              .filter(Boolean)
              .map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            {!item.body && <p>{item.title}</p>}
          </div>
        </>
      ) : (
        <>
          <h1>Новость не найдена</h1>
          <div className="article-body">
            <p>Запрошенная новость не найдена. Перейдите ко списку всех новостей.</p>
          </div>
        </>
      )}
    </main>
  );
}
