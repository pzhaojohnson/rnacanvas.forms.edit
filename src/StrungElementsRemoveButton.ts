import type { App } from './App';

import { LightSolidButton } from './LightSolidButton';

export class StrungElementsRemoveButton {
  readonly #targetApp;

  readonly #button = new LightSolidButton('Remove', () => this.press());

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.style.marginTop = '15px';

    targetApp.selectedStrungElements.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });
  }

  get domNode() {
    return this.#button.domNode;
  }

  press(): void {
    let selectedStrungElements = this.#targetApp.selectedStrungElements.toArray();

    if (selectedStrungElements.length == 0) {
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedStrungElements.forEach(strungElement => strungElement.domNode.remove());
  }

  refresh(): void {
    let selectedStrungElements = this.#targetApp.selectedStrungElements.toArray();

    if (selectedStrungElements.length == 0) {
      this.#button.disable();
      this.#button.tooltip.textContent = 'No strung elements are selected.';
    } else {
      this.#button.enable();
      this.#button.tooltip.textContent = 'Remove the selected strung elements from the drawing.';
    }
  }
}
