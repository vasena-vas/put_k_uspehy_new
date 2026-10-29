import { directions } from '../data';
import { LINKS } from '../config';
import ActionLink from './ActionLink';
import SmoothDetails from './SmoothDetails';
import SectionGrid from './SectionGrid';

const stats = [
  ['18', 'направлений', 'var(--red)'],
  ['>1000', 'участников', 'var(--blue)'],
  ['12', 'лет проведения', 'var(--yellow)'],
  ['до 10', 'доп. баллов', 'var(--green)'],
];

export default function About() {
  return (
    <section className="black about" id="about">
      <h2 className="d h2">Об олимпиаде</h2>
      <div className="about-grid">
        <div className="about-l">
          <p>
            Олимпиада МГТУ им. Г.И. Носова «Путь к успеху» — это шанс показать свои знания в науке и технологиях, прокачать мышление и сделать шаг к будущей профессии.
          </p>
          <ActionLink className="btn btn-o wide" href={LINKS.rules}>
            Скачать положение об олимпиаде <i className="ic ic-dl" />
          </ActionLink>
          <div className="two">
            <ActionLink className="btn btn-o" href={LINKS.archive}>
              Олимпиады прошлых лет <i className="ic ic-arrow" />
            </ActionLink>
            <ActionLink className="btn btn-o" href={LINKS.history}>
              История <i className="ic ic-arrow" />
            </ActionLink>
          </div>
        </div>
        <div className="stats">
          {stats.map(([n, l, c]) => (
            <div className="stat" key={l}>
              <b style={{ color: c }}>{n}</b>
              <span>{l}</span>
            </div>
          ))}
        </div>
      </div>


      <h2 className="d h2 about-directions-title" id="directions">
        Направления олимпиады
      </h2>
      <div className="classes">
        {[7, 8, 9, 10, 11].map((c) => (
          <SmoothDetails
            className="dd"
            key={c}
            summary={
              <>
                {c} класс <i className="ic ic-chev" />
              </>
            }
          >
            <ul className="dd-list">
              {directions.map((d) => (
                <li key={d}>
                  <ActionLink href={LINKS.registration}>{d}</ActionLink>
                </li>
              ))}
            </ul>
          </SmoothDetails>
        ))}
      </div>
      <p className="hint">Выбери своё направление исходя из класса обучения</p>

      <SectionGrid />
    </section>
  );
}
