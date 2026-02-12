import type { App } from './App';

import { ZSection } from './ZSection';

export class NumberingLinesZSection {
  readonly #targetApp;

  readonly #zSection;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedNumberingLines = targetApp.selectedNumberingLines;

    this.#zSection = new ZSection(selectedNumberingLines, targetApp);

    this.domNode.style.marginTop = '24px';

    this.#zSection.addEventListener('refresh', () => this.#handleRefresh());

    this.refresh();
  }

  get domNode() {
    return this.#zSection.domNode;
  }

  refresh(): void {
    this.#zSection.refresh();
  }

  #handleRefresh(): void {
    let selectedNumberingLines = [...this.#targetApp.selectedNumberingLines];

    if (selectedNumberingLines.length == 0) {
      this.#zSection.buttons['Front'].tooltip.textContent = 'No numbering lines are selected.';
    } else {
      this.#zSection.buttons['Front'].tooltip.textContent = 'Bring the selected numbering lines to the front.';
    }

    if (selectedNumberingLines.length == 0) {
      this.#zSection.buttons['Back'].tooltip.textContent = 'No numbering lines are selected.';
    } else {
      this.#zSection.buttons['Back'].tooltip.textContent = 'Send the selected numbering lines to the back.';
    }
  }
}
