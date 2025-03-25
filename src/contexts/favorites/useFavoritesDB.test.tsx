import 'fake-indexeddb/auto';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFavoritesDB } from './useFavoritesDB';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Character } from '@/services/types';
import { db } from '@/services/db/db';

describe('useFavoritesDB', () => {
  beforeEach(async () => {
    await db.favorites.clear();
  });

  afterEach(async () => {
    await db.favorites.clear();
  });

  it('should return an empty list of favorites initially', () => {
    const { result } = renderHook(() => useFavoritesDB());

    expect(result.current.favorites).toEqual([]);
    expect(result.current.favoritesCount).toBe(0);
    expect(result.current.favoritesResults).toBe(0);
  });

  it('should add a character to favorites', async () => {
    const character: Character = {
      id: 1,
      name: 'Goku',
      image: 'image1.jpg',
    };

    const { result } = renderHook(() => useFavoritesDB());

    await act(async () => {
      await result.current.toggleFavorite(character);
    });

    await waitFor(() => {
      expect(result.current.favorites).toEqual([character]);
      expect(result.current.favoritesCount).toBe(1);
      expect(result.current.isFavorite(character.id)).toBe(true);
    });
  });

  it('should remove a character from favorites', async () => {
    const character: Character = {
      id: 1,
      name: 'Goku',
      image: 'image1.jpg',
    };

    await act(async () => {
      await db.favorites.add(character);
    });

    const { result } = renderHook(() => useFavoritesDB());

    await act(async () => {
      await result.current.toggleFavorite(character);
    });

    await waitFor(() => {
      expect(result.current.favorites).toEqual([]);
      expect(result.current.favoritesCount).toBe(0);
      expect(result.current.isFavorite(character.id)).toBe(false);
    });
  });

  it('should filter favorites by character name', async () => {
    const characters: Character[] = [
      { id: 1, name: 'Goku', image: 'image1.jpg' },
      { id: 2, name: 'Vegeta', image: 'image2.jpg' },
    ];

    await act(async () => {
      await db.favorites.bulkAdd(characters);
    });

    const { result } = renderHook(() => useFavoritesDB('goku'));

    await waitFor(() => {
      expect(result.current.favorites).toEqual([characters[0]]);
      expect(result.current.favoritesResults).toBe(1);
    });
  });
});
