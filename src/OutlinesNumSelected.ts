import type { App } from './App';

import * as styles from './OutlinesNumSelected.module.css';

export class OutlinesNumSelected {
  readonly #targetApp;

  readonly domNode = document.createElement('p');

  readonly #numSpan = document.createElement('span');

  readonly #trailingText = document.createElement('span');

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['outlines-num-selected']);

    this.#numSpan.style.fontWeight = '700';

    this.domNode.append(this.#numSpan, this.#trailingText);

    // only refresh when Edit form is open
    this.#targetApp.selectedOutlines.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    this.refresh();
  }

  refresh(): void {
    let num = [...this.#targetApp.selectedOutlines].length;

    this.#numSpan.textContent = `${num}`;

    this.#trailingText.textContent = num == 1 ? ' outline is selected.' : ' outlines are selected.';
  }
}
