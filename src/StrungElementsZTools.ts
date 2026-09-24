import type { App } from './App';

import { ZTools } from './ZTools';

export class StrungElementsZTools {
  readonly #targetApp;

  readonly #zTools;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#zTools = new ZTools(targetApp.selectedStrungElements, targetApp);

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
    let selectedStrungElements = this.#targetApp.selectedStrungElements.toArray();

    if (selectedStrungElements.length == 0) {
      this.#zTools.buttons['Front'].tooltip.textContent = 'No strung elements are selected.';
      this.#zTools.buttons['Back'].tooltip.textContent = 'No strung elements are selected.';
    } else {
      this.#zTools.buttons['Front'].tooltip.textContent = 'Bring the selected strung elements to the front of the drawing.';
      this.#zTools.buttons['Back'].tooltip.textContent = 'Send the selected strung elements to the back of the drawing.';
    }
  }
}
