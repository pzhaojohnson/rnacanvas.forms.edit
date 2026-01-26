import type { Nucleobase } from '@rnacanvas/draw.bases';

export interface Numbering {
  readonly domNode: SVGTextElement;

  readonly owner: Nucleobase;

  number: number;

  /**
   * Sub-properties can be set to control displacement.
   */
  displacement: {
    x: number;
    y: number;

    magnitude: number;
    direction: number;
  }
}
