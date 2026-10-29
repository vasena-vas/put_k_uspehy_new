import { useState } from 'react';
import { Link } from 'react-router-dom';
import { faq } from '../data';
import { artwork } from '../assets';
import { CONTACT_ENDPOINT, LINKS } from '../config';
import ActionLink from './ActionLink';
import SmoothDetails from './SmoothDetails';

function PolicyRef({ href, children }) {
  if (!href) return <span className="policy-text">{children}</span>;
  if (href.startsWith('/') && !href.startsWith('//')) {
    return <Link className="policy-link" to={href}>{children}</Link>;
  }
  return (
    <a className="policy-link" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Faq() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [readPolicy, setReadPolicy] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, '').length < 10) {
      setStatus('Укажите имя и номер телефона (не менее 10 цифр).');
      return;
    }
    if (!readPolicy || !agreePolicy) {
      setStatus('Подтвердите ознакомление с документами и согласие на обработку данных.');
      return;
    }
    if (!CONTACT_ENDPOINT) {
      setStatus('Онлайн-отправка пока недоступна. Позвоните нам: 8 (800) 100-19-34.');
      return;
    }

    setBusy(true);
    setStatus('');
    try {
      const r = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          readPolicy,
          agreePolicy,
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!r.ok) throw new Error();
      setStatus('Заявка отправлена. Мы свяжемся с вами.');
      setName('');
      setPhone('');
      setReadPolicy(false);
      setAgreePolicy(false);
    } catch {
      setStatus('Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="black faq" id="faq">
      <h2 className="d h2">Часто задаваемые вопросы</h2>
      <div className="faq-grid">
        <div className="faq-list">
          {faq.map((f) => (
            <SmoothDetails className="q" key={f.q} summary={f.q}>
              <p>{f.a}</p>
            </SmoothDetails>
          ))}
        </div>
        <img className="faq-img" src={artwork.questhion} width="1035" height="1173" alt="" loading="lazy" />
      </div>

      <h2 className="d h2 ask-h">Остались вопросы?</h2>
      <div className="ask">
        <form className="form" onSubmit={submit}>
          <p>Оставь заявку и мы с тобой свяжемся:</p>
          <label className="sr-only" htmlFor="contact-name">
            Твоё имя
          </label>
          <input
            id="contact-name"
            name="name"
            autoComplete="given-name"
            placeholder="Твоё имя (Иван)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
          />
          <label className="sr-only" htmlFor="contact-phone">
            Твой номер телефона
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="Твой номер телефона"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            maxLength={30}
          />

          <div className="form-checks">
            <label className="form-check">
              <input
                type="checkbox"
                checked={readPolicy}
                onChange={(e) => setReadPolicy(e.target.checked)}
                required
              />
              <span className="check-box" aria-hidden="true" />
              <span>
                Подтверждаю, что ознакомлен(а) с{' '}
                <PolicyRef href={LINKS.privacyPolicy}>Политикой конфиденциальности</PolicyRef>{' '}
                и <PolicyRef href={LINKS.personalDataPolicy}>Политикой обработки и защиты персональных данных</PolicyRef>.
              </span>
            </label>

            <label className="form-check">
              <input
                type="checkbox"
                checked={agreePolicy}
                onChange={(e) => setAgreePolicy(e.target.checked)}
                required
              />
              <span className="check-box" aria-hidden="true" />
              <span>
                Даю согласие ФГБОУ ВО «МГТУ им. Г.И. Носова» на обработку указанных мной имени и телефона для ответа на обращение. Подробности — в{' '}
                <PolicyRef href={LINKS.personalDataPolicy}>Политике обработки и защиты персональных данных</PolicyRef>.
              </span>
            </label>
          </div>

          {!CONTACT_ENDPOINT && (
            <p className="form-connection-note" role="note">
              Онлайн-отправка будет доступна после подключения защищённого сервера записи. Пока свяжитесь с нами по телефону 8 (800) 100-19-34.
            </p>
          )}

          <button className="btn btn-o wide form-submit" disabled={busy || !readPolicy || !agreePolicy} type="submit">
            {busy ? 'Отправляем…' : 'Отправить заявку'}
          </button>

          {status && (
            <p className="form-status" role="status">
              {status}
            </p>
          )}
        </form>

        <div className="contact">
          <span>Или свяжись с нами:</span>
          <div className="contact-row">
            <ActionLink className="contact-vk" href={LINKS.vk} aria-label="ВКонтакте">
              <img src={artwork.vk} alt="" width="49" height="49" />
            </ActionLink>
            <a href="tel:88001001934">8 (800) 100-19-34</a>
          </div>
        </div>
      </div>
    </section>
  );
}
