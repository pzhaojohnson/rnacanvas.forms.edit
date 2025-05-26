import type { Nucleobase } from '@rnacanvas/draw.bases';

export interface Outline {
  readonly domNode: SVGGraphicsElement;

  readonly owner: Nucleobase;
}
