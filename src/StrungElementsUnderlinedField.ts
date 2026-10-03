import type { App } from './App';

import { Checkbox } from './Checkbox';

import { CheckboxField } from './CheckboxField';

import { isUnderlined } from './isUnderlined';

import { isNotUnderlined } from './isNotUnderlined';

import { CenterPoint } from '@rnacanvas/draw.svg.text';

export class StrungElementsUnderlinedField {
  readonly #targetApp;

  readonly #checkbox = new Checkbox();

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#checkbox.domNode.addEventListener('change', () => this.#handleChange());

    this.#field = new CheckboxField('Underlined', this.#checkbox.domNode);

    this.domNode.style.marginTop = '12px';
    this.domNode.style.alignSelf = 'start';

    targetApp.selectedStrungElements.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    let drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    drawingObserver.observe(targetApp.drawing.domNode, { attributes: true, attributeFilter: ['text-decoration'], subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    let selectedStrungTexts = this.#targetApp.selectedStrungElements.toArray().filter(ele => ele.domNode instanceof SVGTextElement);

    this.#checkbox.domNode.checked = selectedStrungTexts.length > 0 && selectedStrungTexts.every(isUnderlined);
  }

  #handleChange(): void {
    let selectedStrungTexts = this.#targetApp.selectedStrungElements.toArray().filter(ele => ele.domNode instanceof SVGTextElement);

    if (selectedStrungTexts.length == 0) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedStrungTexts.forEach(ele => {
      // type check just for TypeScript compiler
      let centerPoint = ele.domNode instanceof SVGTextElement ? new CenterPoint(ele.domNode) : { x: 0, y: 0 };

      // cache center point
      let { x, y } = centerPoint;

      if (this.#checkbox.domNode.checked && isNotUnderlined(ele)) {
        ele.domNode.setAttribute('text-decoration', 'underline');
      } else if (!this.#checkbox.domNode.checked && isUnderlined(ele)) {
        ele.domNode.setAttribute('text-decoration', '');
      }

      // restore center point
      centerPoint.x = x;
      centerPoint.y = y;
    });

    this.refresh();

    // to not interfere with app key bindings
    this.#checkbox.domNode.blur();
  }
}
