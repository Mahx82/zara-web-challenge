const units = {
  million: 1000000n,
  billion: 1000000000n,
  trillion: 1000000000000n,
  quadrillion: 1000000000000000n,
  quintillion: 1000000000000000000n,
  sextillion: 1000000000000000000000n,
  septillion: 1000000000000000000000000n,
};

export function parseKiValue(ki: string): bigint {
  if (/^\d{1,3}(?:\.\d{3})*(?:,\d+)?$/.test(ki)) {
    return BigInt(ki.replace(/\./g, ''));
  }

  const match = ki.match(
    /^([\d,.]+)\s*(million|billion|trillion|quadrillion|quintillion|sextillion|septillion)$/i,
  );
  if (match) {
    const numberPart = parseFloat(
      match[1].replace(/\./g, '').replace(',', '.'),
    );
    const multiplier = units[match[2].toLowerCase() as keyof typeof units];
    return BigInt(numberPart * Number(multiplier));
  }

  return 0n;
}

export function sortByKi<T extends { ki: string }>(arr: T[]): T[] {
  return [...arr].sort((a, b) =>
    parseKiValue(a.ki) > parseKiValue(b.ki) ? 1 : -1,
  );
}
