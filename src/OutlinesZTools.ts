import type { App } from './App';

import { ZTools } from './ZTools';

export class OutlinesZTools {
  readonly #targetApp;

  readonly #zTools;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    const selectedOutlines = targetApp.selectedOutlines;

    this.#zTools = new ZTools(selectedOutlines, targetApp);

    this.#zTools.addEventListener('refresh', () => this.#handleRefresh());

    this.#zTools.domNode.style.marginTop = '27px';

    this.refresh();
  }

  get domNode() {
    return this.#zTools.domNode;
  }

  refresh(): void {
    this.#zTools.refresh();
  }

  #handleRefresh(): void {
    const selectedOutlines = [...this.#targetApp.selectedOutlines];

    if (selectedOutlines.length == 0) {
      this.#zTools.buttons['Front'].tooltip.textContent = 'No outlines are selected.';
    } else {
      this.#zTools.buttons['Front'].tooltip.textContent = 'Bring the selected outlines to the front of the drawing.';
    }

    if (selectedOutlines.length == 0) {
      this.#zTools.buttons['Back'].tooltip.textContent = 'No outlines are selected.';
    } else {
      this.#zTools.buttons['Back'].tooltip.textContent = 'Send the selected outlines to the back of the drawing.';
    }
  }
}
