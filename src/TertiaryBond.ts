import type { Nucleobase } from '@rnacanvas/draw.bases';

export interface TertiaryBond {
  readonly domNode: SVGPathElement;

  readonly base1: Nucleobase;
  readonly base2: Nucleobase;

  /**
   * Corresponding SVG attribute is `data-base-padding1`.
   */
  basePadding1: {
    magnitude: number;
    direction: number;
  }

  /**
   * Corresponding SVG attribute is `data-base-padding2`.
   */
  basePadding2: {
    magnitude: number;
    direction: number;
  }
}
