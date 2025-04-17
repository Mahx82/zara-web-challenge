import { renderHook, act } from '@testing-library/react';
import { useFilters } from './useFilters';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router';

describe('useFilters', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>{children}</BrowserRouter>
  );

  it('returns initial filters from URL search params', () => {
    window.history.pushState({}, 'Home page', '/?name=Goku&showFavorites=true');

    const { result } = renderHook(() => useFilters(), { wrapper });

    expect(result.current.characterName).toBe('Goku');
  });

  it('sets character search filter', () => {
    window.history.pushState({}, 'Home page', '/');

    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => {
      result.current.setFilters({ characterSearch: 'Vegeta' });
    });

    expect(result.current.characterName).toBe('Vegeta');
  });

  it('removes character search filter', () => {
    window.history.pushState({}, 'Home page', '/?name=Goku');

    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => {
      result.current.setFilters({ characterSearch: undefined });
    });

    expect(result.current.characterName).toBeUndefined();
  });
});
