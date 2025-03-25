import { Link } from 'react-router';
import { Logo } from '@/components/shared/Logo';
import { FavoritesCounter } from '@/components/shared/FavoritesCounter';

export function MainHeader() {
  return (
    <>
      <header className="flex items-center border-b-1 border-b-[#333] bg-black p-4 text-white">
        <Link to="/">
          <Logo className="w-[130px]" aria-label="Marvel" />
        </Link>
        <div className="ml-auto">
          <FavoritesCounter />
        </div>
      </header>
    </>
  );
}
