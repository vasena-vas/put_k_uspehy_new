import { Link, useParams } from 'react-router-dom';
import {
  OLYMPIAD_SECTIONS,
  CONTACTS_INFO,
  ARCHIVE_YEARS,
  CALENDAR_META,
  CALENDAR_ROWS,
} from '../sections';
import { artwork, documents } from '../assets';
import { LINKS, ACCOUNT_URL } from '../config';
import ActionLink from '../components/ActionLink';
import { SectionIcon } from '../components/SectionGrid';

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
          <ActionLink className="soc-link" href={LINKS.telegram} aria-label="Telegram">
            <img src={artwork.tg} alt="" width="34" height="34" />
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
        С 2016 года Олимпиада проводится в ином формате: отборочный (интернет-тур) и заключительный (очный) тур. Разработано положение, регламент и календарный план проведения Олимпиады. Для осуществления информационной, организационной и методической поддержки совместно с управлением информационных технологий и автоматизированных систем управления был создан сайт{' '}
        <a href="https://molimp.magtu.ru/" target="_blank" rel="noopener noreferrer">
          http://molimp.magtu.ru/
        </a>
        . Отборочный (интернет-тур) проходил на специализированном информационно-образовательном портале «Интернет-лицей МГТУ им. Г.И. Носова»{' '}
        <a href="http://www.dpklms.magtu.ru/" target="_blank" rel="noopener noreferrer">
          www.dpklms.magtu.ru
        </a>
        , с 2020 года на портале{' '}
        <a href="https://univer.magtu.ru/" target="_blank" rel="noopener noreferrer">
          http://univer.magtu.ru
        </a>
        .
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
            <div className="article-body">
              <p>
                Материалы, задания и итоги олимпиады «Путь к успеху» за {year} учебный год.
              </p>
            </div>
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
          {slug === 'account' && (
            <div className="article-body account-redirect">
              <p>Вход и регистрация участников проходят на образовательном портале МГТУ им. Г.И. Носова.</p>
              <ActionLink className="btn" href={ACCOUNT_URL}>
                Перейти в личный кабинет <i className="ic ic-arrow" />
              </ActionLink>
            </div>
          )}
          {!['contacts', 'calendar', 'history', 'archive', 'account'].includes(slug) && (
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
