/**
 * A collection of things that may change over time.
 */
export interface LiveCollection<T> {
  [Symbol.iterator](): Iterator<T>;

  addEventListener(name: 'change', listener: () => void): void;
}
