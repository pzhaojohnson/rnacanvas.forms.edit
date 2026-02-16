import type { App } from './App';

import * as styles from './SecondaryBondsNumSelected.module.css';

export class SecondaryBondsNumSelected {
  readonly #targetApp;

  readonly domNode = document.createElement('p');

  readonly #numSpan = document.createElement('span');

  readonly #trailingText = document.createElement('span');

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['secondary-bonds-num-selected']);

    this.#numSpan.style.fontWeight = '700';

    this.domNode.append(this.#numSpan, this.#trailingText);

    // only refresh when the Edit form is open
    this.#targetApp.selectedSecondaryBonds.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    this.refresh();
  }

  refresh(): void {
    let num = [...this.#targetApp.selectedSecondaryBonds].length;

    this.#numSpan.textContent = `${num}`;

    this.#trailingText.textContent = num == 1 ? ' secondary bond is selected.' : ' secondary bonds are selected.';
  }
}
