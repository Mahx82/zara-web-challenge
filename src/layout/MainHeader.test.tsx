import { render, screen } from '@testing-library/react';
import { MainHeader } from './MainHeader';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router';

vi.mock('@/components/shared/FavoritesCounter', () => ({
  FavoritesCounter: () => <div data-testid="favorites-counter" />,
}));

describe('MainHeader', () => {
  it('renders the logo with accessible label', () => {
    render(
      <BrowserRouter>
        <MainHeader />
      </BrowserRouter>,
    );

    const logoLink = screen.getByRole('link', { name: /marvel/i });
    expect(logoLink).toBeInTheDocument();
  });

  it('renders the favorites counter', () => {
    render(
      <BrowserRouter>
        <MainHeader />
      </BrowserRouter>,
    );

    expect(screen.getByTestId('favorites-counter')).toBeInTheDocument();
  });
});
