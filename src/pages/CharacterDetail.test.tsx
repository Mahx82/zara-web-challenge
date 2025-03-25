import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useCharacterById } from '@/hooks/queries/useCharacterById';
import { CharacterDetail } from './CharacterDetail';

vi.mock('react-router', () => ({
  useParams: vi.fn(),
}));
vi.mock('@/hooks/queries/useCharacterById', () => ({
  useCharacterById: vi.fn(),
}));
vi.mock('@/components/shared/FavoriteButton', () => ({
  FavoriteButton: vi.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('CharacterDetail', () => {
  beforeEach(() => {
    (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ id: '1' });
  });

  it('displays the loading message', () => {
    (useCharacterById as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isPending: true,
      isError: false,
      error: null,
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <CharacterDetail />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('displays an error message', () => {
    (useCharacterById as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isPending: false,
      isError: true,
      error: { message: 'Error fetching character' },
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <CharacterDetail />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Error fetching character/i)).toBeInTheDocument();
  });

  it('displays the character and its transformations when the query is successful', () => {
    (useCharacterById as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        id: 1,
        name: 'Goku',
        image: '/goku.jpg',
        description: 'Saiyan Warrior',
        transformations: [
          { id: 101, image: '/ssj.jpg', name: 'Super Saiyan', ki: '9000+' },
        ],
      },
      isPending: false,
      isError: false,
      error: null,
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <CharacterDetail />
      </QueryClientProvider>,
    );

    expect(screen.getByText('Goku')).toBeInTheDocument();
    expect(screen.getByText('Saiyan Warrior')).toBeInTheDocument();
    expect(screen.getByText('Super Saiyan')).toBeInTheDocument();
  });

  it("displays the 'no transformations' message when the character has no transformations", () => {
    (useCharacterById as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        id: 1,
        name: 'Krillin',
        image: '/krillin.jpg',
        description: 'Earthling Warrior',
        transformations: [],
      },
      isPending: false,
      isError: false,
      error: null,
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <CharacterDetail />
      </QueryClientProvider>,
    );

    expect(screen.getByText('Krillin')).toBeInTheDocument();
    expect(screen.getByText('Earthling Warrior')).toBeInTheDocument();
    expect(
      screen.getByText('This character has no transformations.'),
    ).toBeInTheDocument();
  });
});
