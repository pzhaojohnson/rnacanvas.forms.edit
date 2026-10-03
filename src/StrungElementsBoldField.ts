import type { App } from './App';

import { Checkbox } from './Checkbox';

import { CheckboxField } from './CheckboxField';

import { isBold } from './isBold';

import { isNotBold } from './isNotBold';

import { CenterPoint } from '@rnacanvas/draw.svg.text';

export class StrungElementsBoldField {
  readonly #targetApp;

  readonly #checkbox = new Checkbox();

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#checkbox.domNode.addEventListener('change', () => this.#handleChange());

    this.#field = new CheckboxField('Bold', this.#checkbox.domNode);

    this.domNode.style.marginTop = '12px';
    this.domNode.style.alignSelf = 'start';

    targetApp.selectedStrungElements.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    let drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    drawingObserver.observe(targetApp.drawing.domNode, { attributes: true, attributeFilter: ['font-weight'], subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    let selectedStrungTexts = this.#targetApp.selectedStrungElements.toArray().filter(ele => ele.domNode instanceof SVGTextElement);

    this.#checkbox.domNode.checked = selectedStrungTexts.length > 0 && selectedStrungTexts.every(isBold);
  }

  #handleChange(): void {
    let selectedStrungTexts = this.#targetApp.selectedStrungElements.toArray().filter(ele => ele.domNode instanceof SVGTextElement);

    if (selectedStrungTexts.length == 0) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedStrungTexts.forEach(strungElement => {
      // type check just for TypeScript compiler
      let centerPoint = strungElement.domNode instanceof SVGTextElement ? new CenterPoint(strungElement.domNode) : { x: 0, y: 0 };

      // cache center point
      let { x, y } = centerPoint;

      if (this.#checkbox.domNode.checked && isNotBold(strungElement)) {
        strungElement.domNode.setAttribute('font-weight', '700');
      } else if (!this.#checkbox.domNode.checked && isBold(strungElement)) {
        strungElement.domNode.setAttribute('font-weight', '400');
      }

      // restore center point
      centerPoint.x = x;
      centerPoint.y = y;
    });

    this.refresh();

    // otherwise app key bindings might be interfered with
    this.#checkbox.domNode.blur();
  }
}
