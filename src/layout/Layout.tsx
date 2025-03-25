import { Outlet } from 'react-router';
import { MainHeader } from '@/layout/MainHeader';
import { FavoritesProvider } from '@/contexts/favorites/FavoritesProvider';

export function Layout() {
  return (
    <FavoritesProvider>
      <MainHeader />
      <main className="mx-auto w-full">
        <Outlet />
      </main>
    </FavoritesProvider>
  );
}
