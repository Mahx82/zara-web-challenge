import { useQuery } from '@tanstack/react-query';
import { fetchCharacters } from '@/services/api/characters';
import {
  CharacterResponse,
  CharactersPaginatedResponse,
} from '@/services/types';

export function useCharactersList(enabled: boolean, nameFilter?: string) {
  return useQuery({
    queryKey: ['characters', nameFilter],
    queryFn: () => fetchCharacters(nameFilter),
    enabled,
    select: (data) => {
      const isFiltered = Boolean(nameFilter);

      const characters = isFiltered
        ? (data as CharacterResponse[])
        : (data as CharactersPaginatedResponse).items;
      const count = isFiltered
        ? characters.length
        : (data as CharactersPaginatedResponse).meta.itemCount;

      return { characters, count };
    },
  });
}
