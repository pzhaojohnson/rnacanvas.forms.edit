import type { Nucleobase } from './Nucleobase';

export interface SecondaryBond {
  readonly base1: Nucleobase;
  readonly base2: Nucleobase;
}
