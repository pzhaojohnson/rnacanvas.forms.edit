import type { App } from './App';

import { ZSection } from './ZSection';

export class NumberingsZSection {
  readonly #targetApp;

  readonly #zSection;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedNumberings = targetApp.selectedNumberings;

    this.#zSection = new ZSection(selectedNumberings, targetApp);

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
    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    if (selectedNumberings.length == 0) {
      this.#zSection.buttons['Front'].tooltip.textContent = 'No numberings are selected.';
    } else {
      this.#zSection.buttons['Front'].tooltip.textContent = 'Bring the selected numberings to the front.';
    }

    if (selectedNumberings.length == 0) {
      this.#zSection.buttons['Back'].tooltip.textContent = 'No numberings are selected.';
    } else {
      this.#zSection.buttons['Back'].tooltip.textContent = 'Send the selected numberings to the back.';
    }
  }
}
