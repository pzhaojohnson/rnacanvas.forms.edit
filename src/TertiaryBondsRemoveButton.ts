import type { App } from './App';

import { LightSolidButton } from './LightSolidButton';

export class TertiaryBondsRemoveButton {
  readonly #targetApp;

  readonly #button = new LightSolidButton('Remove', () => this.press());

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.style.marginTop = '15px';

    // only refresh when the Edit form is open
    this.#targetApp.selectedTertiaryBonds.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });
  }

  get domNode() {
    return this.#button.domNode;
  }

  press(): void {
    let selectedTertiaryBonds = [...this.#targetApp.selectedTertiaryBonds];

    if (selectedTertiaryBonds.length == 0) {
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedTertiaryBonds.forEach(sb => sb.domNode.remove());
  }

  refresh(): void {
    let selectedTertiaryBonds = [...this.#targetApp.selectedTertiaryBonds];

    if (selectedTertiaryBonds.length == 0) {
      this.#button.disable();
      this.#button.tooltip.textContent = 'No tertiary bonds are selected.';
    } else {
      this.#button.enable();
      this.#button.tooltip.textContent = 'Remove the selected tertiary bonds from the drawing.';
    }
  }
}
