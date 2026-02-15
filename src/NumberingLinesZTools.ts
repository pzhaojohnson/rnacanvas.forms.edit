import type { App } from './App';

import { ZTools } from './ZTools';

export class NumberingLinesZTools {
  readonly #targetApp;

  readonly #zTools;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedNumberingLines = targetApp.selectedNumberingLines;

    this.#zTools = new ZTools(selectedNumberingLines, targetApp);

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
    let selectedNumberingLines = [...this.#targetApp.selectedNumberingLines];

    if (selectedNumberingLines.length == 0) {
      this.#zTools.buttons['Front'].tooltip.textContent = 'No numbering lines are selected.';
    } else {
      this.#zTools.buttons['Front'].tooltip.textContent = 'Bring the selected numbering lines to the front.';
    }

    if (selectedNumberingLines.length == 0) {
      this.#zTools.buttons['Back'].tooltip.textContent = 'No numbering lines are selected.';
    } else {
      this.#zTools.buttons['Back'].tooltip.textContent = 'Send the selected numbering lines to the back.';
    }
  }
}
