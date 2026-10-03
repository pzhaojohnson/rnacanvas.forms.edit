import type { Bond } from './Bond';

export interface StrungText {
  readonly domNode: SVGTextElement;

  readonly owner: Bond;

  lineX: number;

  displacementMagnitude: number;
  displacementDirection: number;

  displacementX: number;
  displacementY: number;
}

export interface StrungCircle {
  readonly domNode: SVGCircleElement;

  readonly owner: Bond;

  lineX: number;

  displacementMagnitude: number;
  displacementDirection: number;

  displacementX: number;
  displacementY: number;
}

export interface StrungRectangle {
  readonly domNode: SVGPathElement;

  readonly owner: Bond;

  width: number;
  height: number;

  cornerRadius: number;

  rotation: number;

  lineX: number;

  displacementMagnitude: number;
  displacementDirection: number;

  displacementX: number;
  displacementY: number;
}

export interface StrungTriangle {
  readonly domNode: SVGPathElement;

  readonly owner: Bond;

  width: number;
  height: number;

  tailsHeight: number;

  rotation: number;

  lineX: number;

  displacementMagnitude: number;
  displacementDirection: number;

  displacementX: number;
  displacementY: number;
}

export type StrungElement = (
  StrungText
  | StrungCircle
  | StrungRectangle
  | StrungTriangle
);
