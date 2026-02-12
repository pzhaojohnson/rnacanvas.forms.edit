import type { App } from './App';

import { LightSolidButton } from './LightSolidButton';

export class NumberingLinesRemoveButton {
  readonly #targetApp;

  readonly #button = new LightSolidButton('Remove', () => this.press());

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.style.marginTop = '18px';

    // only refresh when necessary
    this.#targetApp.selectedNumberingLines.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    this.refresh();
  }

  get domNode() {
    return this.#button.domNode;
  }

  press(): void {
    let selectedNumberingLines = [...this.#targetApp.selectedNumberingLines];

    if (selectedNumberingLines.length == 0) {
      this.refresh();

      return;
    }

    this.#targetApp.pushUndoStack();

    selectedNumberingLines.forEach(line => line.domNode.remove());

    this.refresh();
  }

  refresh(): void {
    let selectedNumberingLines = [...this.#targetApp.selectedNumberingLines];

    if (selectedNumberingLines.length == 0) {
      this.#button.disable();
      this.#button.tooltip.textContent = 'No numbering lines are selected.';
    } else {
      this.#button.enable();
      this.#button.tooltip.textContent = 'Remove the selected numbering lines from the drawing.';
    }
  }
}
