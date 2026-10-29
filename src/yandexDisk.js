import { YANDEX_ARCHIVE_FOLDER_URL, YANDEX_NEWS_TABLE_URL, YANDEX_PHOTOS_FOLDER_URL } from './config';
import { news as fallbackNews } from './data';

const YANDEX_PUBLIC_API = 'https://cloud-api.yandex.net/v1/disk/public/resources';

// Человекочитаемые подписи для старых транслитерированных папок на Яндекс Диске.
// Любые новые папки (на русском или английском) отображаются со своим оригинальным именем.
const LEGACY_FOLDER_LABELS = {
  matem: 'Математика',
  dod: 'День открытых дверей',
  nagrazhdenie: 'Награждение',
  awards: 'Награждение',
  robototehnika: 'Робототехника',
  spell_well: 'Английский язык (Spell Well)',
  'olimpiada-rzh': 'Русский язык',
  jury: 'Жюри',
};

let newsCachePromise = null;
let photosCachePromise = null;

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWithRetry(url, options = {}, { timeoutMs = 8000, retries = 2 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, options, timeoutMs);
      if (res.ok) return res;
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
}

// --- Декодирование ZIP / XLSX в браузере без сторонних библиотек ---

async function inflateRaw(compressedBytes) {
  const ds = new DecompressionStream('deflate-raw');
  const writer = ds.writable.getWriter();
  writer.write(compressedBytes);
  writer.close();
  const buf = await new Response(ds.readable).arrayBuffer();
  return new Uint8Array(buf);
}

async function unzipEntries(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const view = new DataView(arrayBuffer);
  const decoder = new TextDecoder('utf-8');

  // Поиск End of Central Directory (0x06054b50) с конца файла
  let eocd = -1;
  const minPos = Math.max(0, bytes.length - 65557);
  for (let i = bytes.length - 22; i >= minPos; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) {
    throw new Error('Некорректный формат файла XLSX (не найден каталог ZIP).');
  }

  const totalEntries = view.getUint16(eocd + 10, true);
  let cdOffset = view.getUint32(eocd + 16, true);
  const files = new Map();

  for (let idx = 0; idx < totalEntries; idx++) {
    if (view.getUint32(cdOffset, true) !== 0x02014b50) break;
    const method = view.getUint16(cdOffset + 10, true);
    const compSize = view.getUint32(cdOffset + 20, true);
    const nameLen = view.getUint16(cdOffset + 28, true);
    const extraLen = view.getUint16(cdOffset + 30, true);
    const commentLen = view.getUint16(cdOffset + 32, true);
    const localHeaderOffset = view.getUint32(cdOffset + 42, true);

    const name = decoder.decode(bytes.subarray(cdOffset + 46, cdOffset + 46 + nameLen));
    cdOffset += 46 + nameLen + extraLen + commentLen;

    if (name.endsWith('/')) continue;

    const localNameLen = view.getUint16(localHeaderOffset + 26, true);
    const localExtraLen = view.getUint16(localHeaderOffset + 28, true);
    const dataStart = localHeaderOffset + 30 + localNameLen + localExtraLen;
    const rawSlice = bytes.subarray(dataStart, dataStart + compSize);

    if (method === 0) {
      files.set(name, rawSlice);
    } else if (method === 8) {
      files.set(name, await inflateRaw(rawSlice));
    }
  }

  return {
    has: (p) => files.has(p),
    readText: (p) => (files.has(p) ? decoder.decode(files.get(p)) : null),
  };
}

function parseXml(xmlText) {
  return new DOMParser().parseFromString(xmlText, 'application/xml');
}

function colLettersToIndex(cellRef) {
  const match = /^([A-Z]+)/i.exec(cellRef || '');
  if (!match) return -1;
  const letters = match[1].toUpperCase();
  let col = 0;
  for (let i = 0; i < letters.length; i++) {
    col = col * 26 + (letters.charCodeAt(i) - 64);
  }
  return col - 1;
}

function resolveFirstSheetPath(zip) {
  const wbXml = zip.readText('xl/workbook.xml');
  const relsXml = zip.readText('xl/_rels/workbook.xml.rels');
  if (wbXml && relsXml) {
    const wbDoc = parseXml(wbXml);
    const firstSheet = wbDoc.getElementsByTagNameNS('*', 'sheet')[0];
    const rId =
      firstSheet?.getAttribute('r:id') ||
      firstSheet?.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id');
    if (rId) {
      const relsDoc = parseXml(relsXml);
      const rels = Array.from(relsDoc.getElementsByTagNameNS('*', 'Relationship'));
      const found = rels.find((el) => el.getAttribute('Id') === rId);
      const target = found?.getAttribute('Target');
      if (target) {
        const clean = target.replace(/^\/+/, '');
        const full = clean.startsWith('xl/') ? clean : `xl/${clean}`;
        if (zip.has(full)) return full;
      }
    }
  }
  return 'xl/worksheets/sheet1.xml';
}

async function parseFirstSheetRows(arrayBuffer) {
  const zip = await unzipEntries(arrayBuffer);

  // Читаем таблицу общих строк sharedStrings.xml
  const sharedStrings = [];
  const sstXml = zip.readText('xl/sharedStrings.xml');
  if (sstXml) {
    const sstDoc = parseXml(sstXml);
    const siNodes = Array.from(sstDoc.getElementsByTagNameNS('*', 'si'));
    for (const si of siNodes) {
      const tNodes = Array.from(si.getElementsByTagNameNS('*', 't'));
      sharedStrings.push(tNodes.map((n) => n.textContent || '').join(''));
    }
  }

  const sheetPath = resolveFirstSheetPath(zip);
  const sheetXml = zip.readText(sheetPath);
  if (!sheetXml) {
    throw new Error('Лист 1 не найден в файле таблицы.');
  }

  const sheetDoc = parseXml(sheetXml);
  const rowNodes = Array.from(sheetDoc.getElementsByTagNameNS('*', 'row'));

  return rowNodes.map((rowEl, idx) => {
    const rowNumber = Number(rowEl.getAttribute('r')) || idx + 1;
    const cells = [];
    const cellNodes = Array.from(rowEl.getElementsByTagNameNS('*', 'c'));

    for (let cIdx = 0; cIdx < cellNodes.length; cIdx++) {
      const cellEl = cellNodes[cIdx];
      const ref = cellEl.getAttribute('r');
      const colIndex = ref ? colLettersToIndex(ref) : cIdx;
      const type = cellEl.getAttribute('t') || '';

      let value = '';
      if (type === 'inlineStr') {
        const tNodes = Array.from(cellEl.getElementsByTagNameNS('*', 't'));
        value = tNodes.map((n) => n.textContent || '').join('');
      } else {
        const vNode = cellEl.getElementsByTagNameNS('*', 'v')[0];
        const raw = vNode?.textContent ?? '';
        if (type === 's') {
          const sIndex = Number(raw);
          value = Number.isFinite(sIndex) && sharedStrings[sIndex] !== undefined ? sharedStrings[sIndex] : '';
        } else {
          value = raw;
        }
      }

      if (colIndex >= 0) {
        cells[colIndex] = String(value).trim();
      }
    }

    return { rowNumber, cells };
  });
}

// --- Проверка и разбор дат новостей ---

function pad2(n) {
  return String(n).padStart(2, '0');
}

function makeValidUtcDate(year, month, day) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
  if (year < 1990 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const ts = Date.UTC(year, month - 1, day);
  const d = new Date(ts);
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) {
    return null;
  }
  return {
    display: `${pad2(day)}.${pad2(month)}.${year}`,
    timestamp: ts,
    valid: true,
  };
}

export function parseSpreadsheetDate(raw) {
  if (raw === null || raw === undefined) return { display: '', timestamp: -Infinity, valid: false };
  const str = String(raw).trim();
  if (!str) return { display: '', timestamp: -Infinity, valid: false };

  // 1) Серийная дата Excel (например, 46125 -> 13.04.2026, 46323 -> 28.10.2026)
  if (/^\d+(\.\d+)?$/.test(str)) {
    const serial = Number(str);
    if (serial >= 30000 && serial <= 80000) {
      const utcMs = Date.UTC(1899, 11, 30) + Math.round(serial * 86400000);
      const dt = new Date(utcMs);
      return {
        display: `${pad2(dt.getUTCDate())}.${pad2(dt.getUTCMonth() + 1)}.${dt.getUTCFullYear()}`,
        timestamp: Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()),
        valid: true,
      };
    }
  }

  // 2) Формат ДД.ММ.ГГГГ или ДД/ММ/ГГГГ (а также ДД.ММ.ГГ)
  const dmy = /^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/.exec(str);
  if (dmy) {
    const day = Number(dmy[1]);
    const month = Number(dmy[2]);
    let year = Number(dmy[3]);
    if (year < 100) year += 2000;
    const parsed = makeValidUtcDate(year, month, day);
    if (parsed) return parsed;
  }

  // 3) Формат ГГГГ-ММ-ДД
  const ymd = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(str);
  if (ymd) {
    const parsed = makeValidUtcDate(Number(ymd[1]), Number(ymd[2]), Number(ymd[3]));
    if (parsed) return parsed;
  }

  return { display: str, timestamp: -Infinity, valid: false };
}

async function resolveOptionalImage(rawUrl) {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  if (trimmed.includes('disk.yandex.')) {
    try {
      const apiUrl = `${YANDEX_PUBLIC_API}?public_key=${encodeURIComponent(trimmed)}`;
      const res = await fetchWithRetry(apiUrl);
      if (res.ok) {
        const data = await res.json();
        const xl = data.sizes?.find((s) => s.name === 'XL' || s.name === 'XXL');
        return xl?.url || data.file || data.preview || '';
      }
    } catch {
      return '';
    }
  }
  return trimmed;
}

// --- Загрузка новостей с Листа 1 Яндекс Диска ---

export async function fetchYandexNews({ force = false } = {}) {
  if (!YANDEX_NEWS_TABLE_URL) return fallbackNews;
  if (newsCachePromise && !force) return newsCachePromise;

  newsCachePromise = (async () => {
    let buffer = null;
    let lastError = null;

    // До 3 попыток с получением свежей реплики Яндекс Диска при таймауте узла хранения
    for (let attempt = 0; attempt < 3; attempt++) {
      let stage = 'получение метаданных';
      try {
        const metaApi = `${YANDEX_PUBLIC_API}?public_key=${encodeURIComponent(YANDEX_NEWS_TABLE_URL)}`;
        const metaRes = await fetchWithTimeout(metaApi, {}, 8000);
        if (!metaRes.ok) {
          throw new Error(`Не удалось получить данные таблицы новостей (${metaRes.status})`);
        }
        const meta = await metaRes.json();
        const href = meta.file;
        if (!href) {
          throw new Error('Пустая ссылка скачивания таблицы Яндекс Диска');
        }
        stage = 'скачивание файла XLSX';
        const fileRes = await fetchWithTimeout(href, {}, 8000);
        if (!fileRes.ok) {
          throw new Error(`Не удалось скачать файл таблицы (${fileRes.status})`);
        }
        buffer = await fileRes.arrayBuffer();
        break;
      } catch (err) {
        const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
        lastError = new Error(`Яндекс Диск — ${stage}: ${message}`);
      }
    }

    if (!buffer) {
      throw lastError || new Error('Не удалось загрузить таблицу новостей');
    }
    let rows;
    try {
      rows = await parseFirstSheetRows(buffer);
    } catch (err) {
      const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
      throw new Error(`Не удалось разобрать XLSX с новостями: ${message}`);
    }
    if (!rows.length) return [];

    // Определяем индексы колонок по заголовкам 1-й строки (Название | Дата | Текст новости | Картинка)
    let titleCol = 0;
    let dateCol = 1;
    let bodyCol = 2;
    let imageCol = 3;
    let startIndex = 0;

    const firstRow = rows[0].cells.map((c) => (c || '').toLowerCase());
    const hasHeader = firstRow.some(
      (c) => c.includes('назван') || c.includes('заголов') || c.includes('дата') || c.includes('текст')
    );

    if (hasHeader) {
      startIndex = 1;
      firstRow.forEach((cell, idx) => {
        if (cell.includes('назван') || cell.includes('заголов') || cell === 'title') titleCol = idx;
        else if (cell.includes('дата') || cell === 'date') dateCol = idx;
        else if (cell.includes('текст') || cell.includes('описан') || cell === 'text') bodyCol = idx;
        else if (cell.includes('картинк') || cell.includes('фото') || cell.includes('image')) imageCol = idx;
      });
    }

    const parsedItems = [];
    for (let i = startIndex; i < rows.length; i++) {
      const { rowNumber, cells } = rows[i];
      const title = (cells[titleCol] || '').trim();
      const rawDate = (cells[dateCol] || '').trim();
      const body = (cells[bodyCol] || '').trim();
      const rawImage = (cells[imageCol] || '').trim();

      // Проверка строки: пропускаем пустые строки без названия
      if (!title) continue;

      const dateInfo = parseSpreadsheetDate(rawDate);
      parsedItems.push({
        id: rowNumber,
        rowNumber,
        title,
        date: dateInfo.display || rawDate,
        timestamp: dateInfo.timestamp,
        dateValid: dateInfo.valid,
        body,
        rawImage,
      });
    }

    // Проверка и сортировка по дате: сверху новость с самой ближайшей (свежей/актуальной) датой.
    // При одинаковой дате выше ставится строка, добавленная ниже в таблице.
    const now = new Date();
    const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    parsedItems.sort((a, b) => {
      if (a.dateValid !== b.dateValid) return a.dateValid ? -1 : 1;
      if (a.dateValid && b.dateValid && a.timestamp !== b.timestamp) {
        const diffA = Math.abs(todayUtc - a.timestamp);
        const diffB = Math.abs(todayUtc - b.timestamp);
        if (diffA !== diffB) return diffA - diffB;
        return b.timestamp - a.timestamp;
      }
      return b.rowNumber - a.rowNumber;
    });

    // Подгружаем ссылки на картинки только если в колонке «Картинка» что-то указано
    const withImages = await Promise.all(
      parsedItems.map(async (item) => ({
        ...item,
        image: item.rawImage ? await resolveOptionalImage(item.rawImage) : '',
      }))
    );

    return withImages;
  })().catch((err) => {
    newsCachePromise = null;
    throw err;
  });

  return newsCachePromise;
}

// --- Рекурсивная выгрузка фотографий из всех папок на Яндекс Диске ---

function formatSegmentLabel(segment) {
  const key = segment.trim().toLowerCase();
  if (LEGACY_FOLDER_LABELS[key]) return LEGACY_FOLDER_LABELS[key];
  return segment.replace(/_/g, ' ').trim();
}

function formatAlbumInfo(folderPath) {
  const segments = (folderPath || '')
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!segments.length) {
    return { title: 'Общий альбом', year: '', sortYear: 0 };
  }

  const yearSeg = segments.find((s) => /^20\d{2}(-\d{4})?$/.test(s)) || '';
  const sortYear = yearSeg ? parseInt(yearSeg.slice(0, 4), 10) : 0;
  const readable = segments.map(formatSegmentLabel);

  return {
    title: readable.join(' · '),
    year: yearSeg,
    sortYear,
  };
}

function pickImageUrls(item) {
  const sizes = item.sizes || [];
  const byName = Object.fromEntries(sizes.map((s) => [s.name, s.url]));
  const thumb = byName.L || byName.XL || byName.M || item.preview || item.file || '';
  const full = byName.XXL || byName.XXXL || byName.ORIGINAL || byName.XL || item.file || thumb;
  const original = item.file || byName.ORIGINAL || full;
  return { thumb, full, original };
}

async function listFolderAllItems(publicKey, path = '') {
  const limit = 100;
  let offset = 0;
  const all = [];

  while (true) {
    let url = `${YANDEX_PUBLIC_API}?public_key=${encodeURIComponent(publicKey)}&limit=${limit}&offset=${offset}`;
    if (path) {
      url += `&path=${encodeURIComponent(path)}`;
    }
    let res;
    try {
      res = await fetchWithRetry(url);
    } catch (err) {
      const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
      throw new Error(`Яндекс Диск — фотографии, папка «${path || '/'}»: ${message}`);
    }
    const data = await res.json();
    const emb = data._embedded || {};
    const items = emb.items || [];
    all.push(...items);

    const total = Number(emb.total) || items.length;
    offset += items.length;
    if (!items.length || offset >= total) break;
  }

  return all;
}

export async function fetchYandexPhotoAlbums({ force = false } = {}) {
  if (!YANDEX_PHOTOS_FOLDER_URL) return [];
  if (photosCachePromise && !force) return photosCachePromise;

  photosCachePromise = (async () => {
    const albums = [];

    // Рекурсивный обход дерева папок любой глубины вложенности
    async function walkFolder(path = '') {
      const items = await listFolderAllItems(YANDEX_PHOTOS_FOLDER_URL, path);
      const dirs = [];
      const images = [];

      for (const item of items) {
        if (item.type === 'dir' && item.path) {
          dirs.push(item);
        } else if (
          item.type === 'file' &&
          (item.media_type === 'image' || (item.mime_type && item.mime_type.startsWith('image/')))
        ) {
          const urls = pickImageUrls(item);
          if (urls.thumb) {
            images.push({
              id: `${path}/${item.name}`,
              name: item.name,
              ...urls,
            });
          }
        }
      }

      if (images.length > 0) {
        images.sort((a, b) => a.name.localeCompare(b.name, 'ru', { numeric: true }));
        const info = formatAlbumInfo(path);
        albums.push({
          id: path || '/',
          path: path || '/',
          title: info.title,
          year: info.year,
          sortYear: info.sortYear,
          photos: images,
        });
      }

      // Параллельно обходим все вложенные папки (включая любые новые папки, которые появятся в будущем)
      await Promise.all(dirs.map((d) => walkFolder(d.path)));
    }

    await walkFolder('');

    // Сортируем альбомы: сначала более свежие годы, затем по названию
    albums.sort((a, b) => {
      if (b.sortYear !== a.sortYear) return b.sortYear - a.sortYear;
      return a.title.localeCompare(b.title, 'ru', { numeric: true });
    });

    return albums;
  })().catch((err) => {
    photosCachePromise = null;
    throw err;
  });

  return photosCachePromise;
}

// Получает временную ссылку на скачивание файла из публичной папки Яндекс Диска.
// Ссылка запрашивается в момент клика, чтобы в проект не попадали истекающие URL.
export async function getYandexArchiveDownloadUrl(path) {
  if (typeof path !== 'string' || !path.startsWith('/')) {
    throw new Error('Не задан путь к файлу в архиве Яндекс Диска.');
  }

  const url = `${YANDEX_PUBLIC_API}/download?public_key=${encodeURIComponent(YANDEX_ARCHIVE_FOLDER_URL)}&path=${encodeURIComponent(path)}`;
  const response = await fetchWithRetry(url, {}, { timeoutMs: 12000, retries: 1 });
  const data = await response.json();
  if (!data?.href) throw new Error('Яндекс Диск не вернул ссылку на файл.');
  return data.href;
}
