import { renderHook, waitFor } from '@testing-library/react';
import { useCharacterById } from './useCharacterById';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fetchCharactersById } from '@/services/api/characters';

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

describe('useCharacterById', () => {
  it('should fetch character by id', async () => {
    const characterResponse = {
      id: 1,
      name: 'Goku',
      image: 'goku.jpg',
      description: 'Some description',
    };
    vi.mocked(fetchCharactersById).mockResolvedValue(characterResponse);

    const { result } = renderHook(() => useCharacterById(1), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(characterResponse);
  });

  it('should not retry on 400 error', async () => {
    const errorResponse = { statusCode: 400, message: 'Bad Request' };
    vi.mocked(fetchCharactersById).mockRejectedValue(errorResponse);

    const { result } = renderHook(() => useCharacterById(1), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.failureCount).toBe(1);
  });
});
