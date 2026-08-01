import type { Nucleobase } from '@rnacanvas/draw.bases';

export interface TertiaryBond {
  readonly domNode: SVGPathElement;

  readonly base1: Nucleobase;
  readonly base2: Nucleobase;
}
