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
    let selectedStrungElements = this.#targetApp.selectedStrungElements.toArray();

    this.#checkbox.domNode.checked = selectedStrungElements.length > 0 && selectedStrungElements.every(isBold);
  }

  #handleChange(): void {
    let selectedStrungElements = this.#targetApp.selectedStrungElements.toArray();

    if (selectedStrungElements.length == 0) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedStrungElements.forEach(strungElement => {
      // (only strung text elements need to be recentered)
      let centerPoint = strungElement.domNode instanceof SVGTextElement ? new CenterPoint(strungElement.domNode) : undefined;

      // cache center point
      let cachedCenterPoint = centerPoint ? { x: centerPoint.x, y: centerPoint.y } : undefined;

      if (this.#checkbox.domNode.checked && isNotBold(strungElement)) {
        strungElement.domNode.setAttribute('font-weight', '700');
      } else if (!this.#checkbox.domNode.checked && isBold(strungElement)) {
        strungElement.domNode.setAttribute('font-weight', '400');
      }

      // restore center point
      if (centerPoint && cachedCenterPoint) {
        centerPoint.x = cachedCenterPoint.x;
        centerPoint.y = cachedCenterPoint.y;
      }
    });

    this.refresh();

    // otherwise app key bindings might be interfered with
    this.#checkbox.domNode.blur();
  }
}
