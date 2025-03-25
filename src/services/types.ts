export interface CharacterResponse {
  id: number;
  name: string;
  image: string;
  maxKi: string;
  race: string;
  gender: string;
  description: string;
  affiliation: string;
  deletedAt: Date;
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
}

export interface Character {
  id: number;
  name: string;
  image: string;
}

export interface CharactersPaginatedResponse {
  items: CharacterResponse[];
  meta: { itemCount: number };
}

export type CharactersFilteredResponse = CharacterResponse[];

export type CharactersApiResponse =
  | CharactersPaginatedResponse
  | CharactersFilteredResponse;

export interface ErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export const QUERY_PARAMS = {
  NAME: 'name',
  SHOW_FAVORITES: 'showFavorites',
} as const;

export type QueryParams = (typeof QUERY_PARAMS)[keyof typeof QUERY_PARAMS];

interface Transformation {
  id: number;
  name: string;
  image: string;
  ki: string;
}

export interface CharacterByIdResponse {
  id: number;
  name: string;
  image: string;
  description: string;
  transformations?: Transformation[];
}
