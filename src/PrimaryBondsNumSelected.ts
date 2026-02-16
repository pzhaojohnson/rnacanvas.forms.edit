import type { App } from './App';

import * as styles from './PrimaryBondsNumSelected.module.css';

export class PrimaryBondsNumSelected {
  readonly #targetApp;

  readonly domNode = document.createElement('p');

  readonly #numSpan = document.createElement('span');

  readonly #trailingText = document.createElement('span');

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['primary-bonds-num-selected']);

    this.#numSpan.style.fontWeight = '700';

    this.domNode.append(this.#numSpan, this.#trailingText);

    // only refresh when the Edit form is open
    this.#targetApp.selectedPrimaryBonds.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    this.refresh();
  }

  refresh(): void {
    let num = [...this.#targetApp.selectedPrimaryBonds].length;

    this.#numSpan.textContent = `${num}`;

    this.#trailingText.textContent = num == 1 ? ' primary bond is selected.' : ' primary bonds are selected.';
  }
}
