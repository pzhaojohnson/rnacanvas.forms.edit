import type { Nucleobase } from './Nucleobase';

import type { Outline } from './Outline';

/**
 * The app interface used by the Editing form.
 */
export interface App {
  /**
   * The drawing of the app.
   */
  readonly drawing: {
    readonly domNode: SVGSVGElement;

    readonly outlines: Iterable<Outline>;

    outline(b: Nucleobase): Outline;
  }

  pushUndoStack(): void;

  readonly undoStack: {
    isEmpty(): boolean;

    /**
     * Returns the previous state at the top of the undo stack.
     *
     * Throws if the undo stack is empty.
     */
    peek(): PreviousState | never;
  }

  addToSelected(eles: (Nucleobase | Outline)[]): void;

  readonly selectedBases: {
    [Symbol.iterator](): Iterator<Nucleobase>;

    /**
     * Calls the specified listener whenever the set of currently selected bases changes.
     *
     * Notably, the listener is only called when the set of currently selected bases changes,
     * not when the bases themselves change.
     */
    addEventListener(name: 'change', listener: () => void): void;
  };

  readonly selectedOutlines: {
    [Symbol.iterator](): Iterator<Outline>;

    /**
     * Calls the specified listener whenever the set of currently selected outlines changes.
     *
     * Note that the listener is not called when outlines themselves change,
     * just when the set of currently selected outlines changes.
     */
    addEventListener(name: 'change', listener: () => void): void;
  }
}

/**
 * A previous state of the app.
 */
type PreviousState = unknown;
