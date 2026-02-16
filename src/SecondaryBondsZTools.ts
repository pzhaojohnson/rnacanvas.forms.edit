import type { App } from './App';

import { ZTools } from './ZTools';

export class SecondaryBondsZTools {
  readonly #targetApp;

  readonly #zTools;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedSecondaryBonds = targetApp.selectedSecondaryBonds;

    this.#zTools = new ZTools(selectedSecondaryBonds, targetApp);

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
    let selectedSecondaryBonds = [...this.#targetApp.selectedSecondaryBonds];

    if (selectedSecondaryBonds.length == 0) {
      this.#zTools.buttons['Front'].tooltip.textContent = 'No secondary bonds are selected.';
    } else {
      this.#zTools.buttons['Front'].tooltip.textContent = 'Bring the selected secondary bonds to the front of the drawing.';
    }

    if (selectedSecondaryBonds.length == 0) {
      this.#zTools.buttons['Back'].tooltip.textContent = 'No secondary bonds are selected.';
    } else {
      this.#zTools.buttons['Back'].tooltip.textContent = 'Send the selected secondary bonds to the back of the drawing.';
    }
  }
}
