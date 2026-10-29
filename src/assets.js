// Статические импорты из src/assets работают и в dev, и после vite build.
import logo from './assets/logo.png';
import vk from './assets/vk.png';
import max from './assets/max.png';
import wincooboc from './assets/wincooboc.png';
import yellow from './assets/yellow.png';
import crutoi from './assets/crutoi.png';
import gift from './assets/gift.png';
import pasle from './assets/pasle.png';
import questhion from './assets/questhion.png';
import red from './assets/red.png';
import run from './assets/run.png';
import calendarPdf from './assets/docs/Prilozhenie_1_KP.pdf';

export const artwork = {
  logo,
  vk,
  max,
  wincooboc,
  yellow,
  crutoi,
  gift,
  pasle,
  questhion,
  red,
  run,
};

export const documents = {
  calendarPdf,
};

// Порядок карточек как в десктопном макете: диплом, знания, призы, баллы.
export const benefitArtwork = [wincooboc, pasle, gift, crutoi];
