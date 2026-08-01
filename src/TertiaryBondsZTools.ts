import type { App } from './App';

import { ZTools } from './ZTools';

export class TertiaryBondsZTools {
  readonly #targetApp;

  readonly #zTools;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedTertiaryBonds = targetApp.selectedTertiaryBonds;

    this.#zTools = new ZTools(selectedTertiaryBonds, targetApp);

    this.domNode.style.marginTop = '27px';

    this.#zTools.addEventListener('refresh', () => this.#handleRefresh());

    this.refresh();
  }

  get domNode() {
    return this.#zTools.domNode;
  }

  refresh(): void {
    this.#zTools.refresh();
  }

  #handleRefresh(): void {
    let selectedTertiaryBonds = [...this.#targetApp.selectedTertiaryBonds];

    if (selectedTertiaryBonds.length == 0) {
      this.#zTools.buttons['Front'].tooltip.textContent = 'No tertiary bonds are selected.';
    } else {
      this.#zTools.buttons['Front'].tooltip.textContent = 'Bring the selected tertiary bonds to the front of the drawing.';
    }

    if (selectedTertiaryBonds.length == 0) {
      this.#zTools.buttons['Back'].tooltip.textContent = 'No tertiary bonds are selected.';
    } else {
      this.#zTools.buttons['Back'].tooltip.textContent = 'Send the selected tertiary bonds to the back of the drawing.';
    }
  }
}
