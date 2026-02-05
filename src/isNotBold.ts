import type { DrawingElement } from './DrawingElement';

import { isBold } from './isBold';

export function isNotBold(ele: DrawingElement): boolean {
  return !isBold(ele);
}
