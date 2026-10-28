import { useState } from 'react';
import { faq } from '../data';
import { artwork } from '../assets';
import { CONTACT_ENDPOINT, LINKS } from '../config';
import ActionLink from './ActionLink';
import SmoothDetails from './SmoothDetails';

function PolicyRef({ href, children }) {
  return href ? (
    <a className="policy-link" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <span className="policy-text">{children}</span>
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
      setStatus('Подтвердите ознакомление и согласие на обработку персональных данных.');
      return;
    }
    if (!CONTACT_ENDPOINT) {
      setStatus('Онлайн-отправка пока не подключена. Позвоните: 8 (800) 100-19-34.');
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
            Твой номер или телефон
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="Твой номер или телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            maxLength={30}
          />
          <button className="btn btn-o wide form-submit" disabled={busy} type="submit">
            {busy ? 'Отправляем…' : 'Отправить заявку'}
          </button>

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
                Я подтверждаю ознакомление с{' '}
                <PolicyRef href={LINKS.personalDataPolicy}>
                  Политикой обработки и защиты персональных данных
                </PolicyRef>{' '}
                и <PolicyRef href={LINKS.privacyPolicy}>Политикой конфиденциальности</PolicyRef>.
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
                Я согласен с{' '}
                <PolicyRef href={LINKS.personalDataPolicy}>Политикой обработки</PolicyRef> и{' '}
                <PolicyRef href={LINKS.privacyPolicy}>Политикой конфиденциальности</PolicyRef>, а также даю согласие на обработку моих персональных данных согласно ФЗ №152-ФЗ.
              </span>
            </label>
          </div>

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
