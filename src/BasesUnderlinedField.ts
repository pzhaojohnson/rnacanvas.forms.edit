import type { App } from './App';

import { Checkbox } from './Checkbox';

import { CheckboxField } from './CheckboxField';

import { isUnderlined } from './isUnderlined';

import { isNotUnderlined } from './isNotUnderlined';

export class BasesUnderlinedField {
  readonly #targetApp;

  readonly #checkbox = new Checkbox();

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#checkbox.domNode.addEventListener('change', () => this.#handleChange());

    this.#field = new CheckboxField('Underlined', this.#checkbox.domNode);

    this.domNode.style.marginTop = '12px';
    this.domNode.style.alignSelf = 'start';

    // only refresh when the Edit form is open
    this.#targetApp.selectedBases.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when the Edit form is open
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
    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0) {
      this.#checkbox.domNode.checked = false;
    } else {
      this.#checkbox.domNode.checked = selectedBases.every(isUnderlined);
    }
  }

  #handleChange() {
    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0) {
      this.refresh();

      return;
    }

    this.#targetApp.pushUndoStack();

    selectedBases.forEach(b => {
      // cache center point
      let centerPoint = { x: b.centerPoint.x, y: b.centerPoint.y };

      if (this.#checkbox.domNode.checked && isNotUnderlined(b)) {
        b.domNode.setAttribute('text-decoration', 'underline');
      } else if (!this.#checkbox.domNode.checked && isUnderlined(b)) {
        b.domNode.setAttribute('text-decoration', '');
      }

      // restore center point
      b.centerPoint.x = centerPoint.x;
      b.centerPoint.y = centerPoint.y;
    });

    this.refresh();

    // release focus (so that key bindings for the app can work)
    this.#checkbox.domNode.blur();
  }
}
