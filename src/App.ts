import type { Nucleobase } from '@rnacanvas/draw.bases';

import type { Outline } from './Outline';

import type { PrimaryBond } from './PrimaryBond';

import type { SecondaryBond } from './SecondaryBond';

/**
 * The app interface used by the Editing form.
 */
export interface App {
  /**
   * The drawing of the app.
   */
  readonly drawing: {
    readonly domNode: SVGSVGElement;

    /**
     * All bases in the drawing.
     */
    readonly bases: Iterable<Nucleobase>;

    readonly outlines: Iterable<Outline>;

    outline(b: Nucleobase): Outline;

    /**
     * All primary bonds in the drawing.
     */
    readonly primaryBonds: Iterable<PrimaryBond>;

    /**
     * All secondary bonds in the drawing.
     */
    readonly secondaryBonds: Iterable<SecondaryBond>;

    /**
     * Adds a secondary bond between the two bases to the drawing
     * and returns the added secondary bond.
     */
    addSecondaryBond(base1: Nucleobase, base2: Nucleobase): SecondaryBond;
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

  addToSelected(eles: DrawingElement[]): void;

  removeFromSelected(eles: DrawingElement[]): void;

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

  readonly selectedPrimaryBonds: {
    [Symbol.iterator](): Iterator<PrimaryBond>;

    /**
     * Listeners are called whenever the current primary bonds selection changes.
     */
    addEventListener(name: 'change', listener: () => void): void;
  }

  readonly selectedSecondaryBonds: {
    [Symbol.iterator](): Iterator<SecondaryBond>;

    /**
     * Listeners are called whenever the current secondary bonds selection changes.
     */
    addEventListener(name: 'change', listener: () => void): void;
  }
}

/**
 * A previous state of the app.
 */
type PreviousState = unknown;

type DrawingElement = (
  Nucleobase
  | Outline
  | PrimaryBond
  | SecondaryBond
);
