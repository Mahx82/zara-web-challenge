import { Character } from '@/services/types';
import Dexie from 'dexie';

class FavoritesDB extends Dexie {
  favorites: Dexie.Table<Character, number>;

  constructor() {
    super('FavoritesDB');
    this.version(1).stores({
      favorites: 'id',
    });
    this.favorites = this.table('favorites');
  }
}

export const db = new FavoritesDB();
