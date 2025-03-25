import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { API_URL, fetchCharacters, fetchCharactersById } from './characters';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import {
  CharacterByIdResponse,
  CharactersFilteredResponse,
  CharactersPaginatedResponse,
  QUERY_PARAMS,
} from '@/services/types';

const server = setupServer(
  http.get(API_URL, ({ request }) => {
    const url = new URL(request.url);
    const nameFilter = url.searchParams.get(QUERY_PARAMS.NAME);

    if (nameFilter) {
      return HttpResponse.json([
        { id: 1, name: nameFilter, image: 'image_filtered.jpg' },
      ]);
    }

    return HttpResponse.json({
      items: [
        { id: 1, name: 'Goku', image: 'image1.jpg' },
        { id: 2, name: 'Vegeta', image: 'image2.jpg' },
      ],
      meta: { itemCount: 2 },
    });
  }),

  http.get(`${API_URL}/:id`, ({ params }) => {
    const { id } = params;

    if (id === '1') {
      return HttpResponse.json({
        id: 1,
        name: 'Goku',
        image: 'image1.jpg',
        description: 'Saiyan warrior',
        transformations: [
          { id: 101, name: 'Super Saiyan', image: 'ss1.jpg', ki: '9000' },
        ],
      });
    }

    return HttpResponse.json(
      { message: 'Character ID not found' },
      { status: 400 },
    );
  }),
);

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

describe('fetchCharacters', () => {
  it('gets the list of characters', async () => {
    const data = (await fetchCharacters(
      undefined,
    )) as CharactersPaginatedResponse;
    expect(data.items[0].name).toBe('Goku');
    expect(data.meta.itemCount).toBe(2);
  });

  it('filters characters by name', async () => {
    const nameFilter = 'Piccolo';
    const data = (await fetchCharacters(
      nameFilter,
    )) as CharactersFilteredResponse;
    expect(data).toHaveLength(1);
    expect(data[0].name).toBe(nameFilter);
  });
});

describe('fetchCharactersById', () => {
  it('gets a character per ID', async () => {
    const data = (await fetchCharactersById(1)) as CharacterByIdResponse;
    expect(data.id).toBe(1);
    expect(data.name).toBe('Goku');
    expect(data.transformations).toHaveLength(1);
  });

  it('handles a character not found', async () => {
    await expect(fetchCharactersById(999)).rejects.toThrow(
      'Character ID not found',
    );
  });
});
