import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from './Home';
import { useFilters } from '@/hooks/useFilters';
import { useCharactersList } from '@/hooks/queries/useCharactersList';
import { useFavoritesContext } from '@/contexts/favorites/useFavoritesContext';
import { BrowserRouter } from 'react-router';

vi.mock('@/hooks/useFilters', () => ({
  useFilters: vi.fn(),
}));

vi.mock('@/hooks/queries/useCharactersList', () => ({
  useCharactersList: vi.fn(),
}));

vi.mock('@/contexts/favorites/useFavoritesContext', () => ({
  useFavoritesContext: vi.fn(),
}));
vi.mock('@/components/shared/FavoriteButton', () => ({
  FavoriteButton: vi.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('Home', () => {
  beforeEach(() => {
    (useFilters as ReturnType<typeof vi.fn>).mockReturnValue({
      characterName: '',
      setFilters: vi.fn(),
    });

    (useFavoritesContext as ReturnType<typeof vi.fn>).mockReturnValue({
      favorites: [],
      favoritesCount: 0,
      isShowingFavorites: false,
    });
  });

  it('displays the loading message', () => {
    (useCharactersList as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {},
      isPending: true,
      isError: false,
      error: null,
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <Home />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('displays an error message when there is an error fetching characters', () => {
    (useCharactersList as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {},
      isPending: false,
      isError: true,
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <Home />
      </QueryClientProvider>,
    );

    expect(
      screen.getByText(/an error ocurred. Please try again later./i),
    ).toBeInTheDocument();
  });

  it('displays "No characters found" when the list is empty', () => {
    (useCharactersList as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { characters: [], count: 0 },
      isPending: false,
      isError: false,
      error: null,
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <Home />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/no characters found./i)).toBeInTheDocument();
  });

  it('displays a list of characters when the query is successful', () => {
    (useCharactersList as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        characters: [
          { id: 1, name: 'Goku', image: '/goku.jpg' },
          { id: 2, name: 'Vegeta', image: '/vegeta.jpg' },
        ],
        count: 2,
      },
      isPending: false,
      isError: false,
      error: null,
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText('Goku')).toBeInTheDocument();
    expect(screen.getByText('Vegeta')).toBeInTheDocument();
  });

  it('displays the "Favorites" section when showing favorites', () => {
    (useFavoritesContext as ReturnType<typeof vi.fn>).mockReturnValue({
      favorites: [{ id: 1, name: 'Goku', image: '/goku.jpg' }],
      favoritesCount: 1,
      isShowingFavorites: true,
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText(/favorites/i)).toBeInTheDocument();
    expect(screen.getByText('Goku')).toBeInTheDocument();
  });

  it('calls setFilters when searching for a character', async () => {
    const setFiltersMock = vi.fn();

    (useFilters as ReturnType<typeof vi.fn>).mockReturnValue({
      characterName: '',
      setFilters: setFiltersMock,
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </QueryClientProvider>,
    );

    const searchInput = screen.getByRole('textbox');

    await act(async () => {
      await userEvent.type(searchInput, 'Goku');
    });

    await waitFor(() => {
      expect(setFiltersMock).toHaveBeenCalledWith({ characterSearch: 'Goku' });
    });
  });
});
