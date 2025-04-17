import { render, screen, waitFor } from '@testing-library/react';
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
      isLoading: true,
      isError: false,
      error: null,
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <CharacterDetail />
      </QueryClientProvider>,
    );

    expect(
      screen.getByLabelText(/loading character details/i),
    ).toBeInTheDocument();
  });

  it('displays an error message', () => {
    (useCharacterById as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: 'Error fetching character' },
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <CharacterDetail />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/error fetching character/i)).toBeInTheDocument();
  });

  it('displays the character and its transformations when the query is successful', async () => {
    (useCharacterById as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        id: 1,
        name: 'Goku',
        image: 'goku.jpg',
        description: 'Saiyan Warrior',
        transformations: [
          {
            id: 102,
            image: 'ssj2.jpg',
            name: 'Super Saiyan 2',
            ki: '3 trillion',
          },
          { id: 103, image: 'ssj3.jpg', name: 'Super Saiyan', ki: '9.000.000' },
          {
            id: 101,
            image: 'ssj.jpg',
            name: 'Super Saiyan 3',
            ki: '7 Septillion',
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <CharacterDetail />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Goku')).toBeInTheDocument();
      expect(screen.getByAltText('Goku')).toHaveAttribute('src', 'goku.jpg');
      expect(screen.getByText('Saiyan Warrior')).toBeInTheDocument();

      const transformations = screen.getAllByTestId('transformation');
      const sortedTransformations = [
        { id: 103, image: 'ssj3.jpg', name: 'Super Saiyan', ki: '9.000.000' },
        {
          id: 102,
          image: 'ssj2.jpg',
          name: 'Super Saiyan 2',
          ki: '3 trillion',
        },
        {
          id: 101,
          image: 'ssj.jpg',
          name: 'Super Saiyan 3',
          ki: '7 Septillion',
        },
      ];

      sortedTransformations.forEach((transformation, index) => {
        const transformationElement = transformations[index];
        expect(transformationElement).toHaveTextContent(transformation.name);
        expect(transformationElement.querySelector('img')).toHaveAttribute(
          'src',
          transformation.image,
        );
      });
    });
  });

  it("displays the 'no transformations' message when the character has no transformations", async () => {
    (useCharacterById as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        id: 1,
        name: 'Krillin',
        image: '/krillin.jpg',
        description: 'Earthling Warrior',
        transformations: [],
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <CharacterDetail />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Krillin')).toBeInTheDocument();
      expect(screen.getByText('Earthling Warrior')).toBeInTheDocument();
      expect(
        screen.getByText('This character has no transformations.'),
      ).toBeInTheDocument();
    });
  });
});
