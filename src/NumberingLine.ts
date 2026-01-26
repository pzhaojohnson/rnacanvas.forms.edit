import type { Numbering } from './Numbering';

export interface NumberingLine {
  readonly domNode: SVGLineElement;

  readonly owner: Numbering;

  basePadding: number;
  textPadding: number;
}
