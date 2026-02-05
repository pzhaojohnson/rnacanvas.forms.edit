import type { App } from './App';

import { Checkbox } from './Checkbox';

import { CheckboxField } from './CheckboxField';

import { isBold } from './isBold';

import { isNotBold } from './isNotBold';

export class NumberingsBoldField {
  readonly #targetApp;

  readonly #checkbox = new Checkbox();

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#checkbox.domNode.addEventListener('change', () => this.#handleChange());

    this.#field = new CheckboxField('Bold', this.#checkbox.domNode);

    this.domNode.style.marginTop = '12px';
    this.domNode.style.alignSelf = 'start';

    // only refresh when necessary
    this.#targetApp.selectedNumberings.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when necessary
    let drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // watch for any changes to font weight
    drawingObserver.observe(this.#targetApp.drawing.domNode, { attributes: true, attributeFilter: ['font-weight'], subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    if (selectedNumberings.length == 0) {
      this.#checkbox.domNode.checked = false;
    } else {
      this.#checkbox.domNode.checked = selectedNumberings.every(isBold);
    }
  }

  #handleChange() {
    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    if (selectedNumberings.length == 0) {
      this.refresh();

      return;
    }

    if (this.#checkbox.domNode.checked && selectedNumberings.every(isBold)) {
      this.refresh();

      return;
    }

    if (!this.#checkbox.domNode.checked && selectedNumberings.every(isNotBold)) {
      this.refresh();

      return;
    }

    this.#targetApp.pushUndoStack();

    selectedNumberings.forEach(n => {
      if (this.#checkbox.domNode.checked && isNotBold(n)) {
        n.domNode.setAttribute('font-weight', '700');
      } else if (!this.#checkbox.domNode.checked && isBold(n)) {
        n.domNode.setAttribute('font-weight', '400');
      }

      // reposition the numbering (after changing font weight)
      n.displacement.magnitude += 1;
      n.displacement.magnitude -= 1;
    });

    this.refresh();

    // release focus (so that key bindings for the app can work)
    this.#checkbox.domNode.blur();
  }
}
