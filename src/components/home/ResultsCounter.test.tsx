import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResultsCounter } from './ResultsCounter';

describe('ResultsCounter', () => {
  it('renders component with 0 results', () => {
    render(<ResultsCounter />);

    const text = screen.getByText('0 results');

    expect(text).toBeInTheDocument();
  });

  it('renders component with n results', () => {
    render(<ResultsCounter count={25} />);

    const text = screen.getByText('25 results');

    expect(text).toBeInTheDocument();
  });
});
