import type { App } from './App';

import { ZTools } from './ZTools';

export class PrimaryBondsZTools {
  readonly #targetApp;

  readonly #zTools;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedPrimaryBonds = targetApp.selectedPrimaryBonds;

    this.#zTools = new ZTools(selectedPrimaryBonds, targetApp);

    this.#zTools.domNode.style.marginTop = '26px';

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
    let selectedPrimaryBonds = [...this.#targetApp.selectedPrimaryBonds];

    if (selectedPrimaryBonds.length == 0) {
      this.#zTools.buttons['Front'].tooltip.textContent = 'No primary bonds are selected.';
    } else {
      this.#zTools.buttons['Front'].tooltip.textContent = 'Bring the selected primary bonds to the front of the drawing.';
    }

    if (selectedPrimaryBonds.length == 0) {
      this.#zTools.buttons['Back'].tooltip.textContent = 'No primary bonds are selected.';
    } else {
      this.#zTools.buttons['Back'].tooltip.textContent = 'Send the selected primary bonds to the back of the drawing.';
    }
  }
}
