import type { App } from './App';

import { Checkbox } from './Checkbox';

import { CheckboxField } from './CheckboxField';

import { isUnderlined } from './isUnderlined';

import { isNotUnderlined } from './isNotUnderlined';

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
    let selectedStrungElements = this.#targetApp.selectedStrungElements.toArray();

    this.#checkbox.domNode.checked = selectedStrungElements.length > 0 && selectedStrungElements.every(isUnderlined);
  }

  #handleChange(): void {
    let selectedStrungElements = this.#targetApp.selectedStrungElements.toArray();

    if (selectedStrungElements.length == 0) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedStrungElements.forEach(ele => {
      if (this.#checkbox.domNode.checked && isNotUnderlined(ele)) {
        ele.domNode.setAttribute('text-decoration', 'underline');
      } else if (!this.#checkbox.domNode.checked && isUnderlined(ele)) {
        ele.domNode.setAttribute('text-decoration', '');
      }
    });

    this.refresh();

    // to not interfere with app key bindings
    this.#checkbox.domNode.blur();
  }
}
