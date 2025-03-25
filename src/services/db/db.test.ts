import { describe, it, expect } from 'vitest';
import { db } from './db';

describe('FavoritesDB', () => {
  it('should create the database with the correct schema', async () => {
    expect(db.favorites).toBeDefined();

    const stores = db.tables.map((table) => table.name);
    expect(stores).toContain('favorites');

    const schema = db.tables.find(
      (table) => table.name === 'favorites',
    )?.schema;
    expect(schema?.primKey.name).toBe('id');
  });
});
