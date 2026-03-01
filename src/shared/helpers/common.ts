export function generateRandomInteger(min: number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[]): T[] {
  const startPosition = generateRandomInteger(0, items.length - 1);
  const endPosition = startPosition + generateRandomInteger(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomInteger(0, items.length - 1)];
}

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export const includes = <T>(array: readonly T[], value: unknown): boolean =>
  (array as readonly unknown[]).includes(value);
