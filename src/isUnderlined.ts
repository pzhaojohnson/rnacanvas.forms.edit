import type { DrawingElement } from './DrawingElement';

export function isUnderlined(ele: DrawingElement): boolean {
  let textDecoration = ele.domNode.getAttribute('text-decoration');

  if (textDecoration === null) {
    return false;
  }

  let items = textDecoration.split(/\s/);

  return items.map(item => item.toLowerCase()).includes('underline');
}
