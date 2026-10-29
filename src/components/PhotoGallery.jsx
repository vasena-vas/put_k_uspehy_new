import { useEffect, useMemo, useState } from 'react';
import { fetchYandexPhotoAlbums } from '../yandexDisk';

export default function PhotoGallery() {
  const [albums, setAlbums] = useState(null);
  const [error, setError] = useState('');
  const [errorDetail, setErrorDetail] = useState('');
  const [activeAlbumId, setActiveAlbumId] = useState('ALL');
  const [lightbox, setLightbox] = useState(null); // { list, index }

  function loadAlbums(force = false) {
    setError('');
    setErrorDetail('');
    if (force) setAlbums(null);
    fetchYandexPhotoAlbums({ force })
      .then((data) => {
        setAlbums(data);
      })
      .catch((err) => {
        console.error('[Yandex Disk: photos]', err);
        setError('Не удалось загрузить фотографии с Яндекс Диска. Проверьте подключение и попробуйте снова.');
        setErrorDetail(err instanceof Error ? `${err.name}: ${err.message}` : String(err));
        setAlbums([]);
      });
  }

  useEffect(() => {
    loadAlbums(false);
  }, []);

  const visibleAlbums = useMemo(() => {
    if (!albums) return [];
    if (activeAlbumId === 'ALL') return albums;
    return albums.filter((a) => a.id === activeAlbumId);
  }, [albums, activeAlbumId]);

  const totalPhotos = useMemo(
    () => (albums ? albums.reduce((sum, a) => sum + a.photos.length, 0) : 0),
    [albums]
  );

  // Клавиатурная навигация в полноэкранном просмотре (←, →, Esc)
  useEffect(() => {
    if (!lightbox) return undefined;
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        setLightbox(null);
      } else if (e.key === 'ArrowRight') {
        setLightbox((prev) =>
          prev ? { ...prev, index: (prev.index + 1) % prev.list.length } : null
        );
      } else if (e.key === 'ArrowLeft') {
        setLightbox((prev) =>
          prev ? { ...prev, index: (prev.index - 1 + prev.list.length) % prev.list.length } : null
        );
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightbox]);

  if (albums === null) {
    return (
      <div className="gallery-loading" aria-busy="true" aria-live="polite">
        <p className="gallery-status">Загружаем альбомы и фотографии с Яндекс Диска...</p>
        <div className="photo-grid">
          {Array.from({ length: 8 }, (_, idx) => (
            <div className="photo-card photo-skeleton" key={idx} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="article-body gallery-empty">
        <p>{error}</p>
        {import.meta.env.DEV && errorDetail && (
          <details className="yandex-debug">
            <summary>Техническая причина (режим разработки)</summary>
            <pre>{errorDetail}</pre>
          </details>
        )}
        <button type="button" className="btn" onClick={() => loadAlbums(true)}>
          Повторить загрузку
        </button>
      </div>
    );
  }

  if (!albums.length) {
    return (
      <div className="article-body">
        <p>В папке Яндекс Диска пока нет загруженных фотографий.</p>
      </div>
    );
  }

  const currentSlide = lightbox ? lightbox.list[lightbox.index] : null;

  return (
    <div className="photo-gallery">
      <div className="gallery-filters" role="tablist" aria-label="Категории фотографий">
        <button
          type="button"
          role="tab"
          aria-selected={activeAlbumId === 'ALL'}
          className={`gallery-chip${activeAlbumId === 'ALL' ? ' is-active' : ''}`}
          onClick={() => setActiveAlbumId('ALL')}
        >
          Все альбомы <span>{totalPhotos}</span>
        </button>
        {albums.map((album) => (
          <button
            type="button"
            role="tab"
            key={album.id}
            aria-selected={activeAlbumId === album.id}
            className={`gallery-chip${activeAlbumId === album.id ? ' is-active' : ''}`}
            onClick={() => setActiveAlbumId(album.id)}
          >
            {album.title} <span>{album.photos.length}</span>
          </button>
        ))}
      </div>

      <div className="gallery-albums">
        {visibleAlbums.map((album) => {
          const slideList = album.photos.map((p) => ({
            ...p,
            albumTitle: album.title,
          }));
          return (
            <section className="gallery-album" key={album.id}>
              <div className="gallery-album-head">
                <h2 className="gallery-album-title">{album.title}</h2>
                <span className="gallery-album-count">{album.photos.length} фото</span>
              </div>
              <div className="photo-grid">
                {album.photos.map((photo, idx) => (
                  <button
                    type="button"
                    className="photo-card"
                    key={photo.id}
                    onClick={() => setLightbox({ list: slideList, index: idx })}
                    aria-label={`${album.title} — фото ${idx + 1}`}
                  >
                    <img
                      src={photo.thumb}
                      alt={`${album.title} — ${photo.name}`}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {currentSlide && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фотографии"
          onClick={() => setLightbox(null)}
        >
          <div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-top">
              <div className="lightbox-meta">
                <b>{currentSlide.albumTitle}</b>
                <span>
                  {lightbox.index + 1} / {lightbox.list.length}
                </span>
              </div>
              <div className="lightbox-actions">
                {currentSlide.original && (
                  <a
                    className="lightbox-btn"
                    href={currentSlide.original}
                    target="_blank"
                    rel="noopener noreferrer"
                    referrerPolicy="no-referrer"
                  >
                    Оригинал ↗
                  </a>
                )}
                <button
                  type="button"
                  className="lightbox-btn"
                  onClick={() => setLightbox(null)}
                  aria-label="Закрыть просмотр"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="lightbox-stage">
              {lightbox.list.length > 1 && (
                <button
                  type="button"
                  className="lightbox-nav prev"
                  onClick={() =>
                    setLightbox((prev) => ({
                      ...prev,
                      index: (prev.index - 1 + prev.list.length) % prev.list.length,
                    }))
                  }
                  aria-label="Предыдущее фото"
                >
                  ←
                </button>
              )}
              <img src={currentSlide.full} alt={currentSlide.name} referrerPolicy="no-referrer" />
              {lightbox.list.length > 1 && (
                <button
                  type="button"
                  className="lightbox-nav next"
                  onClick={() =>
                    setLightbox((prev) => ({
                      ...prev,
                      index: (prev.index + 1) % prev.list.length,
                    }))
                  }
                  aria-label="Следующее фото"
                >
                  →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
