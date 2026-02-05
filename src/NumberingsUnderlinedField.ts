import type { App } from './App';

import { Checkbox } from './Checkbox';

import { CheckboxField } from './CheckboxField';

import { isUnderlined } from './isUnderlined';

import { isNotUnderlined } from './isNotUnderlined';

export class NumberingsUnderlinedField {
  readonly #targetApp;

  readonly #checkbox = new Checkbox();

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#checkbox.domNode.addEventListener('change', () => this.#handleChange());

    this.#field = new CheckboxField('Underlined', this.#checkbox.domNode);

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

    // watch for any changes to text decoration
    drawingObserver.observe(this.#targetApp.drawing.domNode, { attributes: true, attributeFilter: ['text-decoration'], subtree: true });

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
      this.#checkbox.domNode.checked = selectedNumberings.every(isUnderlined);
    }
  }

  #handleChange() {
    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    if (selectedNumberings.length == 0) {
      this.refresh();

      return;
    }

    if (this.#checkbox.domNode.checked && selectedNumberings.every(isUnderlined)) {
      this.refresh();

      return;
    }

    if (!this.#checkbox.domNode.checked && selectedNumberings.every(isNotUnderlined)) {
      this.refresh();

      return;
    }

    this.#targetApp.pushUndoStack();

    selectedNumberings.forEach(n => {
      if (this.#checkbox.domNode.checked && isNotUnderlined(n)) {
        n.domNode.setAttribute('text-decoration', 'underline');
      } else if (!this.#checkbox.domNode.checked && isUnderlined(n)) {
        n.domNode.setAttribute('text-decoration', '');
      }

      // reposition the numbering (after changing text decoration)
      n.displacement.magnitude += 1;
      n.displacement.magnitude -= 1;
    });

    this.refresh();

    // release focus (so that key bindings for the app can work)
    this.#checkbox.domNode.blur();
  }
}
