import type { App } from './App';

import * as styles from './BasesNumSelected.module.css';

export class BasesNumSelected {
  readonly #targetApp;

  readonly domNode = document.createElement('p');

  readonly #numSpan = document.createElement('span');

  readonly #trailingText = document.createElement('span');

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['bases-num-selected']);

    this.#numSpan.style.fontWeight = '700';

    this.domNode.append(this.#numSpan, this.#trailingText);

    // only refresh when necessary
    this.#targetApp.selectedBases.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    this.refresh();
  }

  refresh(): void {
    let num = [...this.#targetApp.selectedBases].length;

    this.#numSpan.textContent = `${num}`;

    this.#trailingText.textContent = num == 1 ? ' base is selected.' : ' bases are selected.';
  }
}
