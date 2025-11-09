import type { Nucleobase } from '@rnacanvas/draw.bases';

export interface SecondaryBond {
  readonly domNode: SVGLineElement;

  readonly base1: Nucleobase;
  readonly base2: Nucleobase;

  basePadding1: number;
  basePadding2: number;
}
