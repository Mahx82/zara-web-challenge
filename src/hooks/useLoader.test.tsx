import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useLoader } from './useLoader';

describe('useLoader', () => {
  it('initializes with progress 0 and isLoaderVisible true when isVisible is true', () => {
    const { result } = renderHook(() => useLoader(true));

    expect(result.current.progress).toBe(0);
    expect(result.current.isLoaderVisible).toBe(true);
  });

  it('increments progress over time when isVisible is true', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useLoader(true));

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // it increments by 2 every 100ms, so after 500ms it should be 10
    expect(result.current.progress).toBe(10);

    vi.useRealTimers();
  });

  it('sets progress to 100 and hides loader when isVisible becomes false', async () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ isVisible }) => useLoader(isVisible),
      {
        initialProps: { isVisible: true },
      },
    );

    act(() => {
      rerender({ isVisible: false });
    });

    expect(result.current.progress).toBe(100);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.isLoaderVisible).toBe(false);
    expect(result.current.progress).toBe(0);

    vi.useRealTimers();
  });

  it('clears the interval when unmounted', () => {
    vi.useFakeTimers();
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const { unmount } = renderHook(() => useLoader(true));

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
