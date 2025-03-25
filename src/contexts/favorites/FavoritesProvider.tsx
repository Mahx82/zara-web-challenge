import { ReactNode } from 'react';
import { useFavoritesDB } from '@/contexts/favorites/useFavoritesDB';
import { useSearchParams } from 'react-router';
import { QUERY_PARAMS } from '@/services/types';
import { FavoritesContext } from '@/contexts/favorites/useFavoritesContext';

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams] = useSearchParams();
  const isShowingFavorites =
    searchParams.get(QUERY_PARAMS.SHOW_FAVORITES) === 'true';
  const characterName = searchParams.get(QUERY_PARAMS.NAME) ?? undefined;

  const { favorites, favoritesCount, toggleFavorite, isFavorite } =
    useFavoritesDB(characterName);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isShowingFavorites,
        favoritesCount,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
