import { artwork } from './assets';

export const ACCOUNT_URL = 'https://univer.magtu.ru/login/index.php';
export const VK_URL = 'https://vk.ru/nmstu_abit';
export const MAX_URL = 'https://max.ru/id7414002238_gos';

// Публичные ссылки Яндекс Диска (официальные документы, доступны для просмотра и скачивания).
export const YANDEX_PRIVACY_POLICY_URL = 'https://disk.yandex.ru/i/H2nJKL_GYbaB8A';
export const YANDEX_PERSONAL_DATA_POLICY_URL = 'https://disk.yandex.ru/i/BmJN6c-ALrIVOw';

// Публичные ссылки Яндекс Диска (только просмотр):
// 1) Таблица с новостями (Лист 1: Название | Дата | Текст новости)
export const YANDEX_NEWS_TABLE_URL = 'https://disk.yandex.ru/i/oYYkMxsZxuV09A';
// 2) Общая папка с фотографиями (автоматический рекурсивный обход всех вложенных папок)
export const YANDEX_PHOTOS_FOLDER_URL = 'https://disk.yandex.ru/d/TvmLcpEvq7NjOA';
// 3) Публичная папка с документами архива олимпиад
export const YANDEX_ARCHIVE_FOLDER_URL = 'https://disk.yandex.ru/d/4hYWcgE6Z5W3Cw';
// 4) Актуальное Положение об олимпиаде
export const YANDEX_RULES_DOCUMENT_URL = 'https://disk.yandex.ru/i/jhOzkRoMDZ1Kqg';

// Маршруты внутренних разделов и внешние ссылки олимпиады.
export const LINKS = {
  account: ACCOUNT_URL,
  registration: ACCOUNT_URL,
  rules: YANDEX_RULES_DOCUMENT_URL,
  calendar: '/sections/calendar',
  archive: '/sections/archive',
  history: '/sections/history',
  qualifying: '/sections/qualifying',
  photos: '/sections/photos',
  contacts: '/sections/contacts',
  final: '/sections/final',
  vk: VK_URL,
  max: MAX_URL,
  personalDataPolicy: '/personal-data-policy',
  privacyPolicy: '/privacy-policy',
};

// Публичный URL защищённого серверного обработчика. Не добавляйте OAuth/API-секреты в клиентский код.
// Для GitHub Pages сам backend не предоставляется; значение задаётся при сборке как VITE_CONTACT_ENDPOINT.
export const CONTACT_ENDPOINT = (import.meta.env.VITE_CONTACT_ENDPOINT || '').trim();

// Логотип подключён из src/assets/logo.png.
export const BRAND_LOGO = artwork.logo;
