import type { App } from './App';

import * as styles from './NumberingsNumSelected.module.css';

export class NumberingsNumSelected {
  readonly #targetApp;

  readonly domNode = document.createElement('p');

  readonly #num = document.createElement('span');

  readonly #trailingText = document.createElement('span');

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['numberings-num-selected']);

    this.#num.style.fontWeight = '700';

    this.domNode.append(this.#num, this.#trailingText);

    // only refresh when necessary
    this.#targetApp.selectedNumberings.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    this.refresh();
  }

  refresh(): void {
    let num = [...this.#targetApp.selectedNumberings].length;

    this.#num.textContent = `${num}`;

    this.#trailingText.textContent = num == 1 ? ' numbering is selected.' : ' numberings are selected.';
  }
}
