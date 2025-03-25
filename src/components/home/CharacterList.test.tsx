import { render, screen } from '@testing-library/react';
import { CharacterList } from './CharacterList';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router';

vi.mock('@/components/shared/FavoriteButton', () => ({
  FavoriteButton: () => <div data-testid="mock-favorite-button"></div>,
}));

describe('CharacterList', () => {
  it('should render the CharacterList with children', () => {
    render(
      <Router>
        <CharacterList>
          <CharacterList.Card id={1} name="Character 1" image="image1.jpg" />
          <CharacterList.Card id={2} name="Character 2" image="image2.jpg" />
        </CharacterList>
      </Router>,
    );

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(screen.getByAltText('Character 1')).toBeInTheDocument();
    expect(screen.getByAltText('Character 2')).toBeInTheDocument();
    expect(screen.getByText('Character 1')).toBeInTheDocument();
    expect(screen.getByText('Character 2')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-favorite-button')).toHaveLength(2);
  });
});
