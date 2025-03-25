import { useLiveQuery } from 'dexie-react-hooks';
import { Character } from '@/services/types';
import { db } from '@/services/db/db';

export const useFavoritesDB = (characterName?: string) => {
  const favorites = useLiveQuery(() => db.favorites.toArray(), []);

  const isFavorite = (id: number) =>
    favorites?.some((char) => char.id === id) ?? false;

  const toggleFavorite = async (character: Character) => {
    const exists = await db.favorites.get(character.id);
    if (exists) {
      await db.favorites.delete(character.id);
    } else {
      await db.favorites.put(character);
    }
  };

  const filteredFavorites = characterName
    ? favorites?.filter((item) => {
        return item.name.toLowerCase().startsWith(characterName);
      })
    : favorites;

  return {
    favorites: filteredFavorites ?? [],
    favoritesCount: favorites?.length ?? 0,
    favoritesResults: filteredFavorites?.length ?? 0,
    toggleFavorite,
    isFavorite,
  };
};
