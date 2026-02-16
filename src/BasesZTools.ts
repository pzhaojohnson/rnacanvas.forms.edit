import type { App } from './App';

import { ZTools } from './ZTools';

export class BasesZTools {
  readonly #targetApp;

  readonly #zTools;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedBases = targetApp.selectedBases;

    this.#zTools = new ZTools(selectedBases, targetApp);

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
    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0) {
      this.#zTools.buttons['Front'].tooltip.textContent = 'No bases are selected.';
    } else {
      this.#zTools.buttons['Front'].tooltip.textContent = 'Bring the selected bases to the front of the drawing.';
    }

    if (selectedBases.length == 0) {
      this.#zTools.buttons['Back'].tooltip.textContent = 'No bases are selected.';
    } else {
      this.#zTools.buttons['Back'].tooltip.textContent = 'Send the selected bases to the back of the drawing.';
    }
  }
}
