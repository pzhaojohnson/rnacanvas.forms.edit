import type { Nucleobase } from './Nucleobase';

export interface PrimaryBond {
  readonly domNode: SVGLineElement;

  readonly base1: Nucleobase;
  readonly base2: Nucleobase;
}
