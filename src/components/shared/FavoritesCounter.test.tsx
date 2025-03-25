import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FavoritesCounter } from './FavoritesCounter';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, useNavigate } from 'react-router';
import { useFavoritesContext } from '@/contexts/favorites/useFavoritesContext';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('@/contexts/favorites/useFavoritesContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(typeof actual === 'object' && actual !== null ? actual : {}),
    useFavoritesContext: vi.fn(),
  };
});

describe('FavoritesCounter', () => {
  const toggleFavorite = vi.fn();
  const isFavorite = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useFavoritesContext).mockReturnValue({
      favoritesCount: 0,
      isShowingFavorites: false,
      favorites: [],
      toggleFavorite,
      isFavorite,
    });
  });

  it('should display the correct favorites count', () => {
    render(
      <BrowserRouter>
        <FavoritesCounter />
      </BrowserRouter>,
    );

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should navigate to show favorites when clicked', async () => {
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);

    render(
      <BrowserRouter>
        <FavoritesCounter />
      </BrowserRouter>,
    );

    const counter = screen.getByText('0');

    await act(async () => {
      await userEvent.click(counter);
    });

    expect(navigate).toHaveBeenCalledWith('/?showFavorites=true');
  });

  it('should update favorites count from 0 to 1 when a favorite is added', () => {
    const { rerender } = render(
      <BrowserRouter>
        <FavoritesCounter />
      </BrowserRouter>,
    );

    expect(screen.getByText('0')).toBeInTheDocument();

    vi.mocked(useFavoritesContext).mockReturnValue({
      favoritesCount: 1,
      isShowingFavorites: false,
      favorites: [{ id: 1, name: 'Goku', image: 'image1.jpg' }],
      toggleFavorite,
      isFavorite,
    });

    rerender(
      <BrowserRouter>
        <FavoritesCounter />
      </BrowserRouter>,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
