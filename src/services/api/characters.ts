import {
  CharacterByIdResponse,
  CharactersApiResponse,
  ErrorResponse,
  QUERY_PARAMS,
} from '@/services/types';

export const API_URL = 'https://dragonball-api.com/api/characters';

export async function fetchCharacters(
  nameFilter?: string,
): Promise<CharactersApiResponse> {
  const url = new URL(`${API_URL}?limit=50`);

  if (nameFilter) {
    url.searchParams.set(QUERY_PARAMS.NAME, nameFilter);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    return Promise.reject(new Error(response.statusText));
  }

  return (await response.json()) as CharactersApiResponse;
}

export async function fetchCharactersById(
  id: number,
): Promise<CharacterByIdResponse | ErrorResponse> {
  const response = await fetch(`${API_URL}/${id.toString()}`);

  if (!response.ok) {
    const contentType = response.headers.get('Content-Type');
    if (contentType?.includes('application/json')) {
      const errorData = (await response.json()) as ErrorResponse;
      return Promise.reject(
        Object.assign(new Error(errorData.message), errorData),
      );
    }
    return Promise.reject(new Error(response.statusText));
  }

  return response.json() as Promise<CharacterByIdResponse>;
}
