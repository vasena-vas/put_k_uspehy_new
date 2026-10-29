import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LINKS, BRAND_LOGO } from '../config';
import ActionLink from './ActionLink';

function RegistrationNotice() {
  return (
    <Link
      className="registration-guidance"
      to={LINKS.calendar}
      aria-label="Старт регистрации 1 ноября 2026 года; открыть календарь по направлениям"
    >
      <strong>Старт регистрации — 1 ноября 2026</strong>
      <span>«Геометрия и графика» — с 1 февраля 2027 · смотреть календарь</span>
    </Link>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function jump(id) {
    setOpen(false);
    if (pathname !== '/') navigate('/#' + id);
    else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', '/#' + id);
    }
  }

  return (
    <>
      <header className="header">
        <Link className="logo" to="/" aria-label="Путь к успеху — главная">
          <img className="brand-logo" src={BRAND_LOGO} alt="" width="98" height="108" />
          <span>
            <small>Олимпиада школьников МГТУ им. Г.И. Носова</small>
            <b>ПУТЬ К УСПЕХУ</b>
          </span>
        </Link>
        <div className="header-r">
          <RegistrationNotice />
          <ActionLink className="btn" href={LINKS.account}>
            Личный кабинет <i className="ic ic-arrow" />
          </ActionLink>
        </div>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen(!open)}
        >
          <span /><span /><span />
        </button>
      </header>
      <nav id="main-nav" className={`nav${open ? ' is-open' : ''}`} aria-label="Основная навигация">
        <div className="nav-inner">
          <button className="btn" onClick={() => jump('directions')}>Направления олимпиады</button>
          <button className="btn" onClick={() => jump('faq')}>Часто задаваемые вопросы</button>
          <NavLink className="btn" to="/news" onClick={() => setOpen(false)}>Новости</NavLink>
          <div className="mobile-account">
            <RegistrationNotice />
            <ActionLink className="btn" href={LINKS.account}>
              Личный кабинет <i className="ic ic-arrow" />
            </ActionLink>
          </div>
        </div>
      </nav>
    </>
  );
}
