import type { App } from './App';

import { Checkbox } from './Checkbox';

import { CheckboxField } from './CheckboxField';

import { isBold } from './isBold';

import { isNotBold } from './isNotBold';

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
      if (this.#checkbox.domNode.checked && isNotBold(strungElement)) {
        strungElement.domNode.setAttribute('font-weight', '700');
      } else if (!this.#checkbox.domNode.checked && isBold(strungElement)) {
        strungElement.domNode.setAttribute('font-weight', '400');
      }
    });

    this.refresh();

    // otherwise app key bindings might be interfered with
    this.#checkbox.domNode.blur();
  }
}
