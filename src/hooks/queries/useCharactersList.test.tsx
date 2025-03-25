import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useCharactersList } from './useCharactersList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fetchCharacters } from '@/services/api/characters';
import {
  CharactersFilteredResponse,
  CharactersPaginatedResponse,
} from '@/services/types';

vi.mock('@/services/api/characters', () => ({
  fetchCharacters: vi.fn(),
  fetchCharactersById: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe.only('useCharactersList', () => {
  it('should fetch characters list', async () => {
    const charactersResponse = {
      items: [{ id: 1, name: 'Goku' }],
      meta: { itemCount: 1 },
    } as CharactersPaginatedResponse;
    vi.mocked(fetchCharacters).mockResolvedValue(charactersResponse);

    const { result } = renderHook(() => useCharactersList(true), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({
      characters: charactersResponse.items,
      count: charactersResponse.meta.itemCount,
    });
  });

  it('should fetch filtered characters list', async () => {
    const filteredCharactersResponse = [
      { id: 1, name: 'Goku' },
    ] as CharactersFilteredResponse;
    vi.mocked(fetchCharacters).mockResolvedValue(filteredCharactersResponse);

    const { result } = renderHook(() => useCharactersList(true, 'Goku'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({
      characters: filteredCharactersResponse,
      count: filteredCharactersResponse.length,
    });
  });
});
