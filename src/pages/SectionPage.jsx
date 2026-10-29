import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  OLYMPIAD_SECTIONS,
  CONTACTS_INFO,
  ARCHIVE_YEARS,
  CALENDAR_META,
  CALENDAR_ROWS,
} from '../sections';
import { artwork, documents } from '../assets';
import { LINKS, ACCOUNT_URL, YANDEX_ARCHIVE_FOLDER_URL } from '../config';
import { getYandexArchiveDownloadUrl } from '../yandexDisk';
import ActionLink from '../components/ActionLink';
import { SectionIcon } from '../components/SectionGrid';
import PhotoGallery from '../components/PhotoGallery';

function ContactsSectionContent() {
  return (
    <div className="contacts-card">
      <div className="contacts-card-body">
        <h2>{CONTACTS_INFO.department}</h2>
        <a className="contacts-phone" href={CONTACTS_INFO.phoneHref}>
          {CONTACTS_INFO.phoneDisplay}
        </a>
        <a className="contacts-mail" href={`mailto:${CONTACTS_INFO.email}`}>
          {CONTACTS_INFO.email}
        </a>
      </div>
      <div className="contacts-card-soc">
        <span>Мы в соц.сетях:</span>
        <div className="contacts-soc-icons">
          <ActionLink className="soc-link" href={LINKS.max} aria-label="MAX">
            <img src={artwork.max} alt="" width="34" height="34" />
          </ActionLink>
          <ActionLink className="soc-link" href={LINKS.vk} aria-label="ВКонтакте">
            <img src={artwork.vk} alt="" width="34" height="34" />
          </ActionLink>
        </div>
      </div>
    </div>
  );
}

function CalendarSectionContent() {
  return (
    <div className="calendar-section">
      <div className="calendar-top">
        <a
          className="btn calendar-dl"
          href={documents.calendarPdf}
          download="Prilozhenie_1_KP.pdf"
        >
          Скачать календарь (PDF) <i className="ic ic-dl" />
        </a>
        <p className="calendar-doc-meta">
          <span>{CALENDAR_META.appendix}</span>
          <span>{CALENDAR_META.order}</span>
          <span>{CALENDAR_META.subject}</span>
        </p>
      </div>

      <div className="calendar-table-wrap">
        <table className="calendar-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Направления олимпиады/секции</th>
              <th>Возрастной состав участников</th>
              <th>Отборочный (интернет-тур)</th>
              <th>Заключительный тур</th>
            </tr>
          </thead>
          <tbody>
            {CALENDAR_ROWS.map((row) => (
              <tr key={row.num}>
                <td className="cal-num" data-label="№">
                  {row.num}
                </td>
                <td className="cal-dir" data-label="Направление">
                  {row.direction}
                </td>
                <td data-label="Возрастной состав">{row.participants}</td>
                <td data-label="Отборочный (интернет-тур)">
                  <div>
                    <b>Регистрация:</b> {row.registration}
                  </div>
                  {row.qualifying && (
                    <div className="cal-qual">
                      <b>Отборочный тур:</b> {row.qualifying}
                    </div>
                  )}
                </td>
                <td className="cal-final" data-label="Заключительный тур">
                  <span className="cal-lines">{row.final}</span>
                  {row.finalUrl && (
                    <div className="cal-url">
                      <a href={row.finalUrl} target="_blank" rel="noopener noreferrer">
                        {row.finalUrl}
                      </a>{' '}
                      {row.finalNote}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HistorySectionContent() {
  return (
    <div className="article-body history-body">
      <p>
        Олимпиадное движение в «Магнитогорском государственном техническом университете им. Г.И. Носова» получило активное развитие с{' '}
        <b>1990-х годов</b>, когда университет стал проводить предметные олимпиады для школьников: «Всесибирскую олимпиаду школьников» по математике, физике, химии; Инженерную многопрофильную олимпиаду «Будущее России», Южно-Уральскую олимпиаду по общеобразовательным предметам, «Международную олимпиаду по основам наук».
      </p>
      <p>
        В <b>2014</b> году университет получил право на проведение многопрофильной олимпиады школьников «Путь к успеху» (далее Олимпиады), основа которой заложена при проведении вузовской олимпиады «Умники и умницы». Организатором Олимпиады является МГТУ им. Г.И. Носова. Соорганизаторами Олимпиады могут выступать органы государственной власти Российской Федерации, субъектов Российской Федерации, учреждения высшего образования Российской Федерации, государственные (муниципальные) научные и исследовательские учреждения на основании соглашений о сотрудничестве в области проведения олимпиад.
      </p>
      <p>
        <b>Основными целями Олимпиады</b> являются выявление и развитие у обучающихся творческих способностей и интереса к научно-исследовательской деятельности, содействие их профессиональной ориентации, профессиональному росту и привлечение к обучению в вузе.
      </p>

      <h2 className="history-sub">Задачами Олимпиады являются:</h2>
      <ul className="history-list">
        <li>
          практическое развитие концепции непрерывности образования посредством расширения взаимодействия между образовательными организациями высшего образования и общеобразовательными организациями и профессиональными образовательными организациями;
        </li>
        <li>
          создание необходимых условий для поддержки творческих способностей и интереса к научной деятельности у талантливой молодежи, распространение и популяризация научных знаний среди молодежи;
        </li>
        <li>
          популяризация программ высшего образования, реализуемых в образовательных организациях высшего образования Российской Федерации.
        </li>
      </ul>

      <p>Олимпиада проводится для учащихся общеобразовательных учреждений и студентов колледжей.</p>
      <p>
        В разработке олимпиадных материалов, в проведении и оценке результатов Олимпиады участвует профессорско-преподавательский состав МГТУ им. Г.И. Носова.
      </p>
      <p>Впервые Олимпиада проводилась с января по март 2015 года (один тур).</p>
      <p>
        С 2016 года Олимпиада проводится в ином формате: отборочный (интернет-тур) и заключительный (очный) тур. Разработаны положение, регламент и календарный план проведения Олимпиады. Для информационной, организационной и методической поддержки был создан официальный сайт Олимпиады. Отборочный (интернет-тур) проходил на специализированном информационно-образовательном портале «Интернет-лицей МГТУ им. Г.И. Носова», а с 2020 года — на образовательном портале МГТУ им. Г.И. Носова.
      </p>
      <p>
        С каждым годом увеличивается спектр направлений Олимпиады. В перечне направлений не только все общеобразовательные предметы, но и творческие и технические дисциплины: 3D-моделирование, информационные технологии, робототехника, бизнес-информатика, автомобильная олимпиада, горное (маркшейдерское) дело, экономика, экология, физическая культура, рисунок, живопись, компьютерная графика, дизайн, конструирование изделий легкой промышленности, русский язык как иностранный (неродной) и др.
      </p>
      <p>Ежегодно растет количество участников Олимпиады (с 461 в 2015 до 5199 человек в 2020 году).</p>
      <p>
        Значительно расширилась география участников Олимпиады. С 2016 года количество населенных пунктов и регионов-участников выросло в 12 раз. Это учащиеся школ и студенты колледжей не только г. Магнитогорска и районов Челябинской области, но и других регионов и стран: Республик Башкортостан, Бурятия, Татарстан, Чувашия; Ставропольского, Приморского и Хабаровского краев; Белгородской, Волгоградской, Воронежской, Кемеровской, Курганской, Липецкой, Московской, Новосибирской, Свердловской, Смоленской, Оренбургской, Омской, Пензенской, Пермской, Ростовской, Томской, Тюменской, Ульяновской областей; Индии, Болгарии, Словакии, Республик Беларусь и Казахстана и др.
      </p>
      <p>
        Наблюдается стабильный ежегодный рост среднего балла ЕГЭ победителей и призеров Олимпиады, поступающих в МГТУ им. Г.И. Носова.
      </p>
      <p>
        Олимпиада приказом Минпросвещения России от 27 декабря 2019 года № 737 была включена в Перечень олимпиад и иных интеллектуальных и (или) творческих конкурсов, мероприятий, направленных на развитие интеллектуальных и творческих способностей, способностей к занятиям физической культурой и спортом, интереса к научной (научно-исследовательской), инженерно-технической, изобретательской, творческой, физкультурно-спортивной деятельности, а также на пропаганду научных знаний, творческих и спортивных достижений.
      </p>
      <p>
        Результаты победителей и призеров олимпиады учитываются при поступлении в вуз в качестве индивидуальных достижений.
      </p>
      <p>
        Награждение победителей и призёров Олимпиады традиционно проводится в торжественной обстановке с вручением дипломов I, II или III степени, а также памятных подарков. Все участники получают сертификаты участника Олимпиады, а учителя (научные руководители) – благодарственные письма.
      </p>
    </div>
  );
}

function ArchiveSectionContent() {
  return (
    <div className="archive-grid">
      {ARCHIVE_YEARS.map((year) => (
        <Link key={year} className="archive-year-card" to={`/sections/archive/${year}`}>
          <span className="archive-year-label">{year}</span>
          <i className="ic ic-arrow archive-year-arrow" aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}

function archiveMaterialCount(count) {
  const remainder100 = count % 100;
  const remainder10 = count % 10;
  if (remainder100 >= 11 && remainder100 <= 14) return `${count} материалов`;
  if (remainder10 === 1) return `${count} материал`;
  if (remainder10 >= 2 && remainder10 <= 4) return `${count} материала`;
  return `${count} материалов`;
}

function ArchiveContentBlocks({ blocks = [] }) {
  if (!blocks.length) return null;
  return (
    <div className="archive-content-blocks">
      {blocks.map((block, index) => {
        if (block.type === 'table') {
          const rows = block.rows || [];
          const firstRow = rows[0] || [];
          const hasHeader = /№|предмет|направлен|возраст|класс|школ|балл|фамили|имя|дата|этап|тур/i.test(firstRow.join(' '));
          const bodyRows = hasHeader ? rows.slice(1) : rows;
          return (
            <div className="archive-table-wrap" key={`table-${index}`}>
              <table className="archive-data-table">
                {hasHeader && (
                  <thead><tr>{firstRow.map((cell, cellIndex) => <th key={cellIndex}>{cell}</th>)}</tr></thead>
                )}
                <tbody>
                  {bodyRows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.type === 'list') {
          return (
            <ul className="archive-content-list" key={`list-${index}`}>
              {(block.items || []).map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
            </ul>
          );
        }
        if (block.type === 'heading') return <h3 className="archive-content-heading" key={`heading-${index}`}>{block.text}</h3>;
        return <p className="archive-content-paragraph" key={`paragraph-${index}`}>{block.text}</p>;
      })}
    </div>
  );
}

function startArchiveDownload(popup, url) {
  const downloadDocument = popup.document;
  downloadDocument.open();
  downloadDocument.write('<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="referrer" content="no-referrer"><title>Загрузка файла</title></head><body></body></html>');
  downloadDocument.close();
  popup.opener = null;

  const status = downloadDocument.createElement('p');
  status.textContent = 'Ссылка на скачивание подготовлена.';
  status.style.cssText = 'margin:0 0 12px;font:16px/1.5 Arial,sans-serif;color:#222';
  const link = downloadDocument.createElement('a');
  link.href = url;
  link.rel = 'noreferrer';
  link.referrerPolicy = 'no-referrer';
  link.textContent = 'Повторить скачивание';
  link.style.cssText = 'font:700 16px/1.5 Arial,sans-serif;color:#2855d9';
  downloadDocument.body.style.cssText = 'padding:28px;font:16px/1.5 Arial,sans-serif;background:#fff';
  downloadDocument.body.append(status, link);
  link.click();
  status.textContent = 'Скачивание запущено. Если файл не загрузился, нажмите ссылку выше.';
}

async function openArchiveDocument(event, path) {
  event.preventDefault();
  const popup = window.open('about:blank', '_blank');
  try {
    const url = await getYandexArchiveDownloadUrl(path);
    if (popup && !popup.closed) {
      startArchiveDownload(popup, url);
    } else {
      window.alert('Браузер заблокировал новую вкладку. Разрешите всплывающие окна для сайта и попробуйте открыть файл ещё раз.');
    }
  } catch (error) {
    if (popup && !popup.closed) {
      popup.opener = null;
      popup.location.replace(YANDEX_ARCHIVE_FOLDER_URL);
    } else {
      window.alert('Не удалось получить временную ссылку на файл. Откройте общую папку архива на Яндекс Диске и попробуйте ещё раз.');
    }
  }
}

function ArchiveDocuments({ links = [] }) {
  if (!links.length) return null;
  return (
    <ul className="archive-document-list">
      {links.map((link, index) => (
        <li key={`${link.path}-${index}`}>
          <a
            href={YANDEX_ARCHIVE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => openArchiveDocument(event, link.path)}
          >
            <span>{link.title}</span>
            <span className="archive-document-arrow" aria-hidden="true">↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function ArchiveYearContent({ year }) {
  const [content, setContent] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    setContent(null);
    setLoadError(false);
    import('../archiveData')
      .then(({ ARCHIVE_CONTENT }) => {
        if (active) setContent(ARCHIVE_CONTENT[year] || { entries: [] });
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => { active = false; };
  }, [year]);

  if (!content && loadError) {
    return (
      <div className="archive-source-note">
        <p>Не удалось загрузить материалы архива. Обновите страницу и попробуйте ещё раз.</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="archive-source-note" aria-live="polite">
        <p>Загружаем материалы архива…</p>
      </div>
    );
  }

  if (!content?.entries?.length) {
    return (
      <div className="archive-source-note">
        <p>Материалы этого учебного года будут добавлены в архив.</p>
      </div>
    );
  }

  return (
    <div className="archive-year-content">
      <div className="archive-source-note">
        <p>
          Текстовые сведения и расписания сохранены в архиве. Доступные документы открываются из общей папки Яндекс Диска.
        </p>
      </div>

      <div className="archive-entry-list">
        {content.entries.map((entry, entryIndex) => (
          <section className="archive-entry" key={`${entry.title}-${entryIndex}`}>
            <div className="archive-entry-head">
              <div>
                {entry.updated && <span className="archive-entry-date">Обновлено: {entry.updated}</span>}
                <h2>{entry.title}</h2>
              </div>
            </div>

            {entry.blocks?.length > 0 && (
              <details className="archive-entry-content-toggle">
                <summary>{/календар/i.test(entry.title) ? 'Показать календарный план' : 'Показать текстовую информацию'}</summary>
                <ArchiveContentBlocks blocks={entry.blocks} />
              </details>
            )}

            {entry.groups?.length > 0 && (
              <div className="archive-group-list">
                {entry.groups.map((group, groupIndex) => {
                  const linkCount = group.links?.length || 0;
                  const contentLabel = linkCount
                    ? archiveMaterialCount(linkCount)
                    : (group.blocks?.length ? 'Текстовый раздел' : 'Материалы');
                  return (
                    <details className="archive-group" key={`${group.title}-${groupIndex}`}>
                      <summary>
                        <span>{group.title}</span>
                        <span className="archive-group-count">
                          {contentLabel}{group.missingCount ? ` · нет: ${group.missingCount}` : ''}
                        </span>
                      </summary>
                      {group.blocks?.length > 0 && <ArchiveContentBlocks blocks={group.blocks} />}
                      <ArchiveDocuments links={group.links} />
                      {group.missingCount > 0 && (
                        <p className="archive-empty-note">
                          {group.links?.length ? 'Часть файлов из старой публикации отсутствует в общей папке Яндекс Диска.' : 'Файлы из старой публикации пока не найдены в общей папке Яндекс Диска.'}
                        </p>
                      )}
                      {!group.links?.length && !group.blocks?.length && !group.missingCount && (
                        <p className="archive-empty-note">В этом подразделе нет опубликованных материалов.</p>
                      )}
                    </details>
                  );
                })}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

export default function SectionPage() {
  const { slug, year } = useParams();

  if (year) {
    const isValidYear = ARCHIVE_YEARS.includes(year);
    return (
      <main className="sec inner section-page">
        <Link className="btn back" to="/sections/archive">
          ← Олимпиады прошлых лет
        </Link>
        {isValidYear ? (
          <>
            <div className="section-page-head" style={{ '--accent': 'var(--blue)' }}>
              <span className="section-page-ic">
                <SectionIcon name="rewind" />
              </span>
              <h1 className="d h2 section-page-title">Олимпиада {year}</h1>
            </div>
            <ArchiveYearContent year={year} />
          </>
        ) : (
          <>
            <h1 className="d h2">Учебный год не найден</h1>
            <div className="article-body">
              <p>Выберите учебный год в разделе «Олимпиады прошлых лет».</p>
            </div>
          </>
        )}
      </main>
    );
  }

  const item = OLYMPIAD_SECTIONS.find((s) => s.slug === slug);
  const backTarget = item && item.showInGrid === false ? '/#about' : '/#sections';

  return (
    <main className="sec inner section-page">
      <Link className="btn back" to={backTarget}>
        ← На главную
      </Link>
      {item ? (
        <>
          <div className="section-page-head" style={{ '--accent': item.accent }}>
            <span className="section-page-ic">
              <SectionIcon name={item.icon} />
            </span>
            <h1 className="d h2 section-page-title">{item.title}</h1>
          </div>

          {slug === 'contacts' && <ContactsSectionContent />}
          {slug === 'calendar' && <CalendarSectionContent />}
          {slug === 'history' && <HistorySectionContent />}
          {slug === 'archive' && <ArchiveSectionContent />}
          {slug === 'photos' && <PhotoGallery />}
          {slug === 'account' && (
            <div className="article-body account-redirect">
              <p>Вход и регистрация участников проходят на образовательном портале МГТУ им. Г.И. Носова.</p>
              <ActionLink className="btn" href={ACCOUNT_URL}>
                Перейти в личный кабинет <i className="ic ic-arrow" />
              </ActionLink>
            </div>
          )}
          {!['contacts', 'calendar', 'history', 'archive', 'photos', 'account'].includes(slug) && (
            <div className="article-body">
              <p>{item.placeholder}</p>
            </div>
          )}
        </>
      ) : (
        <>
          <h1 className="d h2">Раздел не найден</h1>
          <div className="article-body">
            <p>Запрошенный раздел не найден. Вернитесь на главную страницу.</p>
          </div>
        </>
      )}
    </main>
  );
}
