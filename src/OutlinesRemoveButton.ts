import type { App } from './App';

import { LightSolidButton } from './LightSolidButton';

export class OutlinesRemoveButton {
  readonly #targetApp;

  readonly #button = new LightSolidButton('Remove', () => this.press());

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.style.marginTop = '18px';

    // only refresh when Edit form is open
    this.#targetApp.selectedOutlines.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    this.refresh();
  }

  get domNode() {
    return this.#button.domNode;
  }

  press(): void {
    let selectedOutlines = [...this.#targetApp.selectedOutlines];

    if (selectedOutlines.length == 0) {
      this.refresh();

      return;
    }

    this.#targetApp.pushUndoStack();

    selectedOutlines.forEach(o => o.domNode.remove());

    this.refresh();
  }

  refresh(): void {
    let selectedOutlines = [...this.#targetApp.selectedOutlines];

    if (selectedOutlines.length == 0) {
      this.#button.disable();
      this.#button.tooltip.textContent = 'No outlines are selected.';
    } else {
      this.#button.enable();
      this.#button.tooltip.textContent = 'Remove the selected outlines from the drawing.';
    }
  }
}
