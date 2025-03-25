import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should debounce the value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      },
    );

    // Initial value should be 'initial'
    expect(result.current).toBe('initial');

    // Update the value
    rerender({ value: 'updated', delay: 500 });

    // Value should still be 'initial' because of the debounce delay
    expect(result.current).toBe('initial');

    // Fast-forward time by 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Value should now be 'updated'
    expect(result.current).toBe('updated');
  });

  it('should update the value after the specified delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 1000 },
      },
    );

    // Initial value should be 'initial'
    expect(result.current).toBe('initial');

    // Update the value
    rerender({ value: 'updated', delay: 1000 });

    // Value should still be 'initial' because of the debounce delay
    expect(result.current).toBe('initial');

    // Fast-forward time by 500ms (half of the delay)
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Value should still be 'initial' because the delay is 1000ms
    expect(result.current).toBe('initial');

    // Fast-forward time by another 500ms (total 1000ms)
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Value should now be 'updated'
    expect(result.current).toBe('updated');
  });
});
