import { useEffect, useState } from 'react';
import {
  formatScheduleDate,
  getCountdownParts,
  getRegistrationState,
  pluralizeRu,
} from '../registrationCalendar';

const TIMER_UNITS = [
  ['день', 'дня', 'дней'],
  ['час', 'часа', 'часов'],
  ['минута', 'минуты', 'минут'],
  ['секунда', 'секунды', 'секунд'],
];

function SubjectChips({ items }) {
  return (
    <div className="registration-subjects">
      {items.map((item) => (
        <span className="registration-subject-chip" key={item.direction}>
          {item.direction}
        </span>
      ))}
    </div>
  );
}

function DateGroup({ group }) {
  return (
    <div className="registration-date-group">
      <time dateTime={group.date}>{formatScheduleDate(group.date, 'short')}</time>
      <span>{group.items.map((item) => item.direction).join(', ')}</span>
    </div>
  );
}

function getStageTitle(state) {
  if (state.closedCount === 0) {
    return state.kind === 'upcoming' ? 'Регистрация уже близко!' : 'Успей пройти отбор!';
  }
  if (state.remainingCount === 0) return 'Регистрация на все направления закрыта';
  if (state.closedCount === 1) {
    return `Регистрация по направлению «${state.closedItems[0].direction}» закрыта`;
  }
  if (state.closedCount >= Math.ceil(state.totalCount / 2)) {
    return 'Регистрация на большинство направлений закрыта';
  }
  return `Регистрация по ${state.closedCount} ${pluralizeRu(state.closedCount, 'направлению', 'направлениям', 'направлениям')} закрыта`;
}

function getStageDescription(state) {
  if (state.closedCount === 0 && state.kind === 'upcoming') {
    return `До старта регистрации по ${state.focusItems.length} направлениям`;
  }
  if (state.closedCount === 0) return 'Ближайшая контрольная дата — проверьте срок своего направления';
  if (state.openItems.length === 1) {
    return 'Срок ещё действует по одному направлению. Не пропустите ближайшую дату';
  }
  if (state.openItems.length > 1) {
    return `Сроки ещё действуют по ${state.openItems.length} направлениям. Ближайшая дата — ${formatScheduleDate(state.focusDate)}`;
  }
  return `Следующий старт — ${formatScheduleDate(state.focusDate)}. Проверьте срок своего направления`;
}

export default function RegistrationCountdown() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timer = window.setInterval(tick, 1000);
    window.addEventListener('focus', tick);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', tick);
    };
  }, []);

  const state = getRegistrationState(now);

  if (state.kind === 'closed') {
    return (
      <section className="registration-card registration-card-closed" aria-label="Регистрация на все направления закрыта" role="status">
        <div className="registration-closed-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none">
            <path d="M24 4.5 39.5 11v11.3c0 10-6.6 17.3-15.5 21.2C15.1 39.6 8.5 32.3 8.5 22.3V11L24 4.5Z" stroke="currentColor" strokeWidth="2.4" />
            <path d="m16 24 5.2 5.2L32.5 18" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="registration-closed-copy">
          <span className="registration-eyebrow">Регистрация на все направления закрыта</span>
          <h3>Ты уже сделал важный шаг.</h3>
          <p>Желаем уверенности и ярких результатов в финале — всё получится. Проверь личный кабинет и расписание заключительного тура.</p>
        </div>
      </section>
    );
  }

  const parts = getCountdownParts(now, state.targetAt);
  const isUpcoming = state.kind === 'upcoming';
  const hasEstimatedDate = state.focusItems.some((item) => item.countdownBasis === 'estimated-day-before-final');
  const stageTitle = getStageTitle(state);
  const stageDescription = getStageDescription(state);

  return (
    <section className={`registration-card registration-card-${state.kind}`} aria-label="Календарь регистрации и сроков олимпиады">
      <div className="registration-card-top">
        <div className="registration-card-copy">
          <span className="registration-eyebrow">Сезон олимпиады 2026/27</span>
          <h3>{stageTitle}</h3>
          <p>{stageDescription}</p>
        </div>
        <div className="registration-timer">
          <span className="registration-timer-label">
            {isUpcoming ? 'До открытия' : hasEstimatedDate ? 'До расчётного ориентира' : 'До ближайшей даты'}
          </span>
          <div className="registration-clock" role="timer" aria-label="Обратный отсчёт">
            {parts.map((part, index) => (
              <div className="registration-clock-unit" key={part.shortUnit}>
                <b>{String(part.value).padStart(2, '0')}</b>
                <span>{pluralizeRu(part.value, ...TIMER_UNITS[index])}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="registration-card-bottom">
        <div className="registration-focus">
          <span className="registration-meta-label">
            {isUpcoming ? 'Начало регистрации' : hasEstimatedDate ? 'Расчётный ориентир' : 'Ближайший срок'}
          </span>
          <strong>{formatScheduleDate(state.focusDate)}</strong>
          <SubjectChips items={state.focusItems} />
        </div>

        {(state.followUps.length > 0 || state.nextOpening) && (
          <div className="registration-next-dates">
            <span className="registration-meta-label">
              {isUpcoming ? 'Позже стартует' : 'Следующие сроки'}
            </span>
            {state.followUps.slice(0, 2).map((group) => (
              <DateGroup group={group} key={group.date} />
            ))}
            {state.nextOpening && (
              <div className="registration-date-group registration-date-opening">
                <time dateTime={state.nextOpening.date}>{formatScheduleDate(state.nextOpening.date, 'short')}</time>
                <span>Старт: {state.nextOpening.items.map((item) => item.direction).join(', ')}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {state.closedCount > 0 && (
        <div className="registration-closed-summary">
          <span className="registration-meta-label">Уже закрыты направления</span>
          <SubjectChips items={state.closedItems} />
        </div>
      )}

      <p className="registration-note">
        В календаре указаны даты начала регистрации и сроки туров, но не отдельные даты закрытия регистрации. Для направлений с интернет-туром таймер ориентируется на последний день отборочного тура; для «Геометрии и графики» 14 марта — расчётный ориентир за день до финала.
      </p>
    </section>
  );
}
