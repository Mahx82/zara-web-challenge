import { useQuery } from '@tanstack/react-query';
import { fetchCharactersById } from '@/services/api/characters';
import { ErrorResponse } from '@/services/types';

export function useCharacterById(id: number) {
  return useQuery({
    queryKey: ['characterById', id],
    queryFn: () => fetchCharactersById(id),
    retry: (failureCount, error: ErrorResponse) => {
      if (error.statusCode === 400) {
        return false;
      }
      return failureCount < 3;
    },
  });
}
