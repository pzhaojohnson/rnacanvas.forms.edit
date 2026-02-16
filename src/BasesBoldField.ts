import type { App } from './App';

import { Checkbox } from './Checkbox';

import { CheckboxField } from './CheckboxField';

import { isBold } from './isBold';

import { isNotBold } from './isNotBold';

export class BasesBoldField {
  readonly #targetApp;

  readonly #checkbox = new Checkbox();

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#checkbox.domNode.addEventListener('change', () => this.#handleChange());

    this.#field = new CheckboxField('Bold', this.#checkbox.domNode);

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

    // watch for any changes to font weight
    drawingObserver.observe(this.#targetApp.drawing.domNode, { attributes: true, attributeFilter: ['font-weight'], subtree: true });

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
      this.#checkbox.domNode.checked = selectedBases.every(isBold);
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

      if (this.#checkbox.domNode.checked && isNotBold(b)) {
        b.domNode.setAttribute('font-weight', '700');
      } else if (!this.#checkbox.domNode.checked && isBold(b)) {
        b.domNode.setAttribute('font-weight', '400');
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
