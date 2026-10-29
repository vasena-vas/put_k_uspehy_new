import { Link } from 'react-router-dom';
import { artwork } from '../assets';
import { LINKS } from '../config';
import ActionLink from './ActionLink';

export default function Footer() {
  return (
    <footer className="footer">
      <span>
        ФГБОУ ВО «МГТУ им. Г.И. Носова», NMSTU
        <br />
        Россия, 455000, г. Магнитогорск, пр. Ленина, 38
      </span>
      <div className="footer-legal" aria-label="Правовая информация">
        <Link to={LINKS.privacyPolicy}>Политика конфиденциальности</Link>
        <Link to={LINKS.personalDataPolicy}>Обработка персональных данных</Link>
      </div>
      <div className="soc">
        Мы в соц.сетях:
        <span>
          <ActionLink className="soc-link" href={LINKS.max} aria-label="MAX">
            <img src={artwork.max} alt="" width="29" height="29" />
          </ActionLink>
          <ActionLink className="soc-link" href={LINKS.vk} aria-label="ВКонтакте">
            <img src={artwork.vk} alt="" width="29" height="29" />
          </ActionLink>
        </span>
      </div>
      <a href="tel:88001001934">8 (800) 100-19-34</a>
    </footer>
  );
}
