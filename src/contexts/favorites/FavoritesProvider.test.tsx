import 'fake-indexeddb/auto';
import { render, screen, act, waitFor } from '@testing-library/react';
import { FavoritesProvider } from './FavoritesProvider';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '@/services/db/db';
import { BrowserRouter } from 'react-router';
import { useFavoritesContext } from '@/contexts/favorites/useFavoritesContext';

const TestComponent = () => {
  const {
    favorites,
    isShowingFavorites,
    favoritesCount,
    toggleFavorite,
    isFavorite,
  } = useFavoritesContext();

  return (
    <div>
      <div data-testid="favorites-count">{favoritesCount}</div>
      <div data-testid="is-showing-favorites">
        {isShowingFavorites.toString()}
      </div>
      <div data-testid="favorites">
        {favorites.map((fav) => (
          <div key={fav.id} data-testid="favorite">
            {fav.name}
          </div>
        ))}
      </div>
      <button
        data-testid="toggle-favorite"
        onClick={() => {
          act(() => {
            toggleFavorite({ id: 1, name: 'Goku', image: 'image1.jpg' });
          });
        }}
      >
        Toggle Favorite
      </button>
      <div data-testid="is-favorite">{isFavorite(1) ? 'true' : 'false'}</div>
    </div>
  );
};

describe('FavoritesContext', () => {
  beforeEach(async () => {
    await db.favorites.clear();
  });

  afterEach(async () => {
    await db.favorites.clear();
  });

  it('should provide initial context values', () => {
    render(
      <BrowserRouter>
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      </BrowserRouter>,
    );

    expect(screen.getByTestId('favorites-count').textContent).toBe('0');
    expect(screen.getByTestId('is-showing-favorites').textContent).toBe(
      'false',
    );
    expect(screen.queryAllByTestId('favorite')).toHaveLength(0);
    expect(screen.getByTestId('is-favorite').textContent).toBe('false');
  });

  it('should toggle favorite character', async () => {
    render(
      <BrowserRouter>
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      </BrowserRouter>,
    );

    const toggleButton = screen.getByTestId('toggle-favorite');

    act(() => {
      toggleButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('favorites-count').textContent).toBe('1');
      expect(screen.queryAllByTestId('favorite')).toHaveLength(1);
      expect(screen.getByTestId('is-favorite').textContent).toBe('true');
    });

    act(() => {
      toggleButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('favorites-count').textContent).toBe('0');
      expect(screen.queryAllByTestId('favorite')).toHaveLength(0);
      expect(screen.getByTestId('is-favorite').textContent).toBe('false');
    });
  });
});
