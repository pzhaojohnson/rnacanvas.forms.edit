import type { App } from './App';

import { LightSolidButton } from './LightSolidButton';

export class SecondaryBondsRemoveButton {
  readonly #targetApp;

  readonly #button = new LightSolidButton('Remove', () => this.press());

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.style.marginTop = '15px';

    // only refresh when the Edit form is open
    this.#targetApp.selectedSecondaryBonds.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });
  }

  get domNode() {
    return this.#button.domNode;
  }

  press(): void {
    let selectedSecondaryBonds = [...this.#targetApp.selectedSecondaryBonds];

    if (selectedSecondaryBonds.length == 0) {
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedSecondaryBonds.forEach(sb => sb.domNode.remove());
  }

  refresh(): void {
    let selectedSecondaryBonds = [...this.#targetApp.selectedSecondaryBonds];

    if (selectedSecondaryBonds.length == 0) {
      this.#button.disable();
      this.#button.tooltip.textContent = 'No secondary bonds are selected.';
    } else {
      this.#button.enable();
      this.#button.tooltip.textContent = 'Remove the selected secondary bonds from the drawing.';
    }
  }
}
