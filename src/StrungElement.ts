import type { Bond } from './Bond';

export interface StrungElement {
  readonly domNode: SVGGraphicsElement;

  readonly owner: Bond;
}
