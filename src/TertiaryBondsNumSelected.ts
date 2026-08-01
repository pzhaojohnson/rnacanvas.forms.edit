import type { App } from './App';

import * as styles from './TertiaryBondsNumSelected.module.css';

export class TertiaryBondsNumSelected {
  readonly #targetApp;

  readonly domNode = document.createElement('p');

  readonly #numSpan = document.createElement('span');

  readonly #trailingText = document.createElement('span');

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['tertiary-bonds-num-selected']);

    this.#numSpan.style.fontWeight = '700';

    this.domNode.append(this.#numSpan, this.#trailingText);

    // only refresh when the Edit form is open
    this.#targetApp.selectedTertiaryBonds.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    this.refresh();
  }

  refresh(): void {
    let num = [...this.#targetApp.selectedTertiaryBonds].length;

    this.#numSpan.textContent = `${num}`;

    let s = num == 1 ? '' : 's';

    let are = num == 1 ? 'is' : 'are'

    this.#trailingText.textContent = ` tertiary bond${s} ${are} selected.`;
  }
}
