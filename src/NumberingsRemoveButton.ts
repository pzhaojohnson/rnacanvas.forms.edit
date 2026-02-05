import type { App } from './App';

import { LightSolidButton } from './LightSolidButton';

export class NumberingsRemoveButton {
  readonly #targetApp;

  readonly #button = new LightSolidButton('Remove', () => this.press());

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.style.marginTop = '18px';

    // only refresh when necessary
    this.#targetApp.selectedOutlines.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    this.refresh();
  }

  get domNode() {
    return this.#button.domNode;
  }

  press(): void {
    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    if (selectedNumberings.length == 0) {
      this.refresh();

      return;
    }

    this.#targetApp.pushUndoStack();

    selectedNumberings.forEach(n => n.domNode.remove());

    this.refresh();
  }

  refresh(): void {
    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    if (selectedNumberings.length == 0) {
      this.#button.disable();
      this.#button.tooltip.textContent = 'No numberings are selected.';
    } else {
      this.#button.enable();
      this.#button.tooltip.textContent = 'Remove the selected numberings from the drawing.';
    }
  }
}
