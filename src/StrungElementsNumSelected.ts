import type { App } from './App';

import * as styles from './StrungElementsNumSelected.module.css';

export class StrungElementsNumSelected {
  readonly #targetApp;

  readonly domNode = document.createElement('p');

  readonly #numSpan = document.createElement('span');

  readonly #trailingText = document.createElement('span');

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['strung-elements-num-selected']);

    this.#numSpan.style.fontWeight = '700';

    this.domNode.append(this.#numSpan, this.#trailingText);

    targetApp.selectedStrungElements.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    this.refresh();
  }

  refresh(): void {
    let num = this.#targetApp.selectedStrungElements.toArray().length;

    this.#numSpan.textContent = `${num}`;

    let s = num == 1 ? '' : 's';

    let are = num == 1 ? 'is' : 'are';

    this.#trailingText.textContent = ` strung element${s} ${are} selected.`;
  }
}
