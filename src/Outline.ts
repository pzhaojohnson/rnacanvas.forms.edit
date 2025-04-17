import type { Nucleobase } from './Nucleobase';

export interface Outline {
  readonly domNode: SVGGraphicsElement;

  readonly owner: Nucleobase;
}
