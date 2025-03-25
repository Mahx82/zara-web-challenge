import { render, screen } from '@testing-library/react';
import { HeroDetail } from './HeroDetail';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/components/shared/FavoriteButton', () => ({
  FavoriteButton: () => <div data-testid="mock-favorite-button"></div>,
}));

describe('HeroDetail', () => {
  const hero = {
    id: 1,
    name: 'Goku',
    image: 'image1.jpg',
    description: 'A powerful warrior.',
  };

  it('should render the HeroDetail with correct props', () => {
    render(<HeroDetail {...hero} />);

    expect(screen.getByAltText('Goku')).toHaveAttribute('src', 'image1.jpg');
    expect(screen.getByText('Goku')).toBeInTheDocument();
    expect(screen.getByText('A powerful warrior.')).toBeInTheDocument();
    expect(screen.getByTestId('mock-favorite-button')).toBeInTheDocument();
  });
});
