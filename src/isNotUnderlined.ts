import type { DrawingElement } from './DrawingElement';

import { isUnderlined } from './isUnderlined';

export function isNotUnderlined(ele: DrawingElement): boolean {
  return !isUnderlined(ele);
}
