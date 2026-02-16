/**
 * An unchanging collection of items.
 */
export class StaticCollection<T> {
  readonly #items;

  constructor(items: T[]) {
    this.#items = [...items];
  }

  [Symbol.iterator]() {
    return this.#items.values();
  }

  addEventListener(name: 'change', listener: () => void) {
    // nothing to do
  }
}
