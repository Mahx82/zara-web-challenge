import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { QUERY_PARAMS } from '@/services/types';

export interface Filters {
  characterSearch?: string;
}

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const characterName = searchParams.get(QUERY_PARAMS.NAME) ?? undefined;
  const showFavorites =
    searchParams.get(QUERY_PARAMS.SHOW_FAVORITES) === 'true';

  const setFilters = useCallback(
    (filters: Filters) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        if (filters.characterSearch) {
          params.set(QUERY_PARAMS.NAME, filters.characterSearch);
        } else {
          params.delete(QUERY_PARAMS.NAME);
        }

        return params;
      });
    },
    [setSearchParams],
  );

  return {
    characterName,
    showFavorites,
    setFilters,
  };
}
