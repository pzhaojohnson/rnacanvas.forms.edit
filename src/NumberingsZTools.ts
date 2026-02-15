import type { App } from './App';

import { ZTools } from './ZTools';

export class NumberingsZTools {
  readonly #targetApp;

  readonly #zTools;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedNumberings = targetApp.selectedNumberings;

    this.#zTools = new ZTools(selectedNumberings, targetApp);

    this.domNode.style.marginTop = '24px';

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
    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    if (selectedNumberings.length == 0) {
      this.#zTools.buttons['Front'].tooltip.textContent = 'No numberings are selected.';
    } else {
      this.#zTools.buttons['Front'].tooltip.textContent = 'Bring the selected numberings to the front.';
    }

    if (selectedNumberings.length == 0) {
      this.#zTools.buttons['Back'].tooltip.textContent = 'No numberings are selected.';
    } else {
      this.#zTools.buttons['Back'].tooltip.textContent = 'Send the selected numberings to the back.';
    }
  }
}
