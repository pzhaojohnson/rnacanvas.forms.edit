import type { DrawingElement } from './DrawingElement';

export function isBold(ele: DrawingElement): boolean {
  let fontWeight = ele.domNode.getAttribute('font-weight');

  if (fontWeight === null) {
    return false;
  }

  let n = Number.parseFloat(fontWeight);

  if (!Number.isNaN(n)) {
    return n >= 700;
  }

  return fontWeight.toLowerCase() === 'bold';
}
