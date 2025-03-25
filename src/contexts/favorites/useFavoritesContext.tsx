import { createContext, useContext } from 'react';

interface Character {
  id: number;
  name: string;
  image: string;
}

interface FavoritesContextProps {
  favorites: Character[];
  isShowingFavorites: boolean;
  favoritesCount: number;
  toggleFavorite: (character: Character) => Promise<void>;
  isFavorite: (id: number) => boolean | undefined;
}

export const FavoritesContext = createContext<FavoritesContextProps | null>(
  null,
);

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error(
      'useFavoritesContext must be used within a FavoritesProvider',
    );
  }
  return context;
};
