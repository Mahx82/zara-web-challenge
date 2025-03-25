import { sortByKi } from '@/utils/sortByKi';
import { describe, it, expect } from 'vitest';

describe('sortByKi', () => {
  it('sorts the array with only number types', () => {
    const unsorted = [
      { ki: '2.000' },
      { ki: '1.000' },
      { ki: '456.000.000.000.000' },
      { ki: '34.000.000' },
    ];
    const sorted = [
      { ki: '1.000' },
      { ki: '2.000' },
      { ki: '34.000.000' },
      { ki: '456.000.000.000.000' },
    ];

    expect(sortByKi(unsorted)).toStrictEqual(sorted);
  });

  it('sorts the array with suffix types', () => {
    const unsorted = [
      { ki: '3 trillion' },
      { ki: '2 Billion' },
      { ki: '4 Quadrillion' },
      { ki: '7 Septillion' },
      { ki: '1 Million' },
      { ki: '5 Quintillion' },
      { ki: '6 sextillion' },
    ];
    const sorted = [
      { ki: '1 Million' },
      { ki: '2 Billion' },
      { ki: '3 trillion' },
      { ki: '4 Quadrillion' },
      { ki: '5 Quintillion' },
      { ki: '6 sextillion' },
      { ki: '7 Septillion' },
    ];

    expect(sortByKi(unsorted)).toStrictEqual(sorted);
  });

  it('sorts the array with mixed types', () => {
    const unsorted = [
      { ki: '245.000.000.000' },
      { ki: '1.25 Billion' },
      { ki: '18.000.000' },
      { ki: '2 Million' },
      { ki: '3.2 Million' },
    ];
    const sorted = [
      { ki: '2 Million' },
      { ki: '18.000.000' },
      { ki: '3.2 Million' },
      { ki: '1.25 Billion' },
      { ki: '245.000.000.000' },
    ];

    expect(sortByKi(unsorted)).toStrictEqual(sorted);
  });
});
