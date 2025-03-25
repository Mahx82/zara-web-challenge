import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './SearchInput';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDebounce } from '@/hooks/useDebounce';

vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: vi.fn(),
}));

describe('SearchInput', () => {
  const onSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial value', () => {
    vi.mocked(useDebounce).mockReturnValue('Goku');

    render(<SearchInput onSearch={onSearch} initialValue="Goku" />);

    expect(screen.getByDisplayValue('Goku')).toBeInTheDocument();
  });

  it('calls onSearch with debounced value', () => {
    vi.mocked(useDebounce).mockReturnValue('Goku');

    render(<SearchInput onSearch={onSearch} initialValue="Goku" />);

    expect(onSearch).toHaveBeenCalledWith('Goku');
  });

  it('updates input value on change', async () => {
    vi.mocked(useDebounce).mockReturnValue('');

    render(<SearchInput onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('Search a character...');

    await userEvent.type(input, 'Vegeta');

    expect(input).toHaveValue('Vegeta');
  });

  it('calls onSearch when input value changes', async () => {
    vi.mocked(useDebounce).mockReturnValue('Vegeta');

    render(<SearchInput onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('Search a character...');

    await act(async () => {
      await userEvent.type(input, 'Vegeta');
    });

    expect(onSearch).toHaveBeenCalledWith('Vegeta');
  });
});
