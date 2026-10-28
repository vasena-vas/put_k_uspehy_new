import { artwork } from './assets';

// Общая дата для шапки и таймера. Магнитогорск: UTC+05:00.
export const REGISTRATION_DEADLINE = new Date('2026-11-01T00:00:00+05:00');
export const REGISTRATION_DATE_LABEL = '01.11.2026';

export const ACCOUNT_URL = 'https://univer.magtu.ru/login/index.php';

// Маршруты внутренних разделов и внешние ссылки олимпиады.
export const LINKS = {
  account: ACCOUNT_URL,
  registration: ACCOUNT_URL,
  rules: '/sections/rules',
  calendar: '/sections/calendar',
  archive: '/sections/archive',
  history: '/sections/history',
  qualifying: '/sections/qualifying',
  photos: '/sections/photos',
  contacts: '/sections/contacts',
  final: '/sections/final',
  vk: '',
  telegram: '',
  personalDataPolicy: '',
  privacyPolicy: '',
};

export const CONTACT_ENDPOINT = ''; // Например '/api/contact', когда серверный обработчик готов.

// Логотип подключён из src/assets/logo.png (та же папка, что и остальные картинки).
export const BRAND_LOGO = artwork.logo;
