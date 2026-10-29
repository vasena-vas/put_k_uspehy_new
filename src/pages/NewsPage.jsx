import { Link } from 'react-router-dom';
import NewsList from '../components/NewsList';

export default function NewsPage() {
  return (
    <main className="sec inner">
      <Link className="btn back" to="/#news">
        ← На главную
      </Link>
      <h1 className="d h2">Новости олимпиады</h1>
      <NewsList />
    </main>
  );
}
