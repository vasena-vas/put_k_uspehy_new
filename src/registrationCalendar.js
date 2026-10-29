import { CALENDAR_ROWS } from './sections';

const MOSCOW_TIMEZONE = 'Asia/Yekaterinburg';
const LOCAL_OFFSET = '+05:00';

function atLocalTime(date, time) {
  return new Date(`${date}T${time}${LOCAL_OFFSET}`);
}

function groupByDate(rows, dateKey, timeKey) {
  const groups = new Map();
  for (const row of rows) {
    const date = row[dateKey];
    if (!groups.has(date)) {
      groups.set(date, {
        date,
        at: atLocalTime(date, timeKey),
        items: [],
      });
    }
    groups.get(date).items.push(row);
  }
  return [...groups.values()].sort((a, b) => a.at - b.at);
}

export function getRegistrationState(now = Date.now()) {
  const nowDate = now instanceof Date ? now : new Date(now);
  const nowMs = nowDate.getTime();
  const rows = CALENDAR_ROWS.map((row) => ({
    ...row,
    startsAt: atLocalTime(row.registrationStartDate, '00:00:00.000'),
    targetAt: atLocalTime(row.countdownTargetDate, '23:59:59.999'),
  }));

  const openRows = rows.filter((row) => row.startsAt.getTime() <= nowMs && row.targetAt.getTime() >= nowMs);
  const notStartedRows = rows.filter((row) => row.startsAt.getTime() > nowMs);
  const closedRows = rows.filter((row) => row.targetAt.getTime() < nowMs);
  const sharedStatus = {
    closedItems: closedRows,
    closedCount: closedRows.length,
    totalCount: rows.length,
    remainingCount: rows.length - closedRows.length,
  };

  if (openRows.length) {
    const deadlines = groupByDate(openRows, 'countdownTargetDate', '23:59:59.999');
    const nextOpenings = groupByDate(notStartedRows, 'registrationStartDate', '00:00:00.000');
    const nextDeadline = deadlines[0];
    return {
      ...sharedStatus,
      kind: 'open',
      openItems: openRows,
      focusDate: nextDeadline.date,
      focusItems: nextDeadline.items,
      targetAt: nextDeadline.at.getTime(),
      followUps: deadlines.slice(1, 4),
      nextOpening: nextOpenings[0] || null,
    };
  }

  if (notStartedRows.length) {
    const openings = groupByDate(notStartedRows, 'registrationStartDate', '00:00:00.000');
    return {
      ...sharedStatus,
      kind: 'upcoming',
      openItems: [],
      focusDate: openings[0].date,
      focusItems: openings[0].items,
      targetAt: openings[0].at.getTime(),
      followUps: openings.slice(1, 3),
      nextOpening: null,
    };
  }

  return { ...sharedStatus, kind: 'closed', openItems: [] };
}

export function getCountdownParts(now, targetAt) {
  const seconds = Math.max(0, Math.floor((targetAt - now) / 1000));
  return [
    { value: Math.floor(seconds / 86400), unit: 'день', shortUnit: 'дн.' },
    { value: Math.floor((seconds % 86400) / 3600), unit: 'час', shortUnit: 'час.' },
    { value: Math.floor((seconds % 3600) / 60), unit: 'минута', shortUnit: 'мин.' },
    { value: seconds % 60, unit: 'секунда', shortUnit: 'сек.' },
  ];
}

export function pluralizeRu(value, one, few, many) {
  const abs = Math.abs(value) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (last > 1 && last < 5) return few;
  if (last === 1) return one;
  return many;
}

export function formatScheduleDate(date, style = 'long') {
  const parsed = atLocalTime(date, '12:00:00.000');
  if (style === 'short') {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: MOSCOW_TIMEZONE,
    }).format(parsed);
  }
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: MOSCOW_TIMEZONE,
  }).format(parsed);
}
