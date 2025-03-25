import { render, screen, fireEvent } from '@testing-library/react';
import { FavoriteButton } from './FavoriteButton';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFavoritesContext } from '@/contexts/favorites/useFavoritesContext';

vi.mock('@/contexts/favorites/useFavoritesContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(typeof actual === 'object' && actual !== null ? actual : {}),
    useFavoritesContext: vi.fn(),
  };
});

describe('FavoriteButton', () => {
  const character = { id: 1, name: 'Goku', image: 'image1.jpg' };
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

  it('displays the correct icon based on favorite status', () => {
    isFavorite.mockReturnValue(true);

    render(<FavoriteButton character={character} />);

    expect(screen.getByTestId('is-favorite-icon')).toBeInTheDocument();
  });

  it('displays the not favorite icon when character is not a favorite', () => {
    isFavorite.mockReturnValue(false);

    render(<FavoriteButton character={character} />);

    expect(screen.getByTestId('is-not-favorite-icon')).toBeInTheDocument();
  });

  it('calls toggleFavorite when clicked', () => {
    isFavorite.mockReturnValue(false);

    render(<FavoriteButton character={character} />);

    fireEvent.click(screen.getByRole('button'));

    expect(toggleFavorite).toHaveBeenCalledWith(character);
  });

  it('calls onClick prop when clicked', () => {
    const onClick = vi.fn();
    isFavorite.mockReturnValue(false);

    render(<FavoriteButton character={character} onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalled();
  });
});
