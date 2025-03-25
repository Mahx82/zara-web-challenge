import { render, screen } from '@testing-library/react';
import { Carousel } from './Carousel';
import { describe, it, expect } from 'vitest';

describe('Carousel', () => {
  it('should render the Carousel with children', () => {
    render(
      <Carousel>
        <Carousel.Item image="image1.jpg" name="Item 1" info="Info 1" />
        <Carousel.Item image="image2.jpg" name="Item 2" info="Info 2" />
      </Carousel>,
    );

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(screen.getByAltText('Item 1')).toBeInTheDocument();
    expect(screen.getByAltText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Info 1')).toBeInTheDocument();
    expect(screen.getByText('Info 2')).toBeInTheDocument();
  });
});
