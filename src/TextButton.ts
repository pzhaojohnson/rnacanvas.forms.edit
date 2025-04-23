import * as styles from './TextButton.module.css';

import { Tooltip } from '@rnacanvas/tooltips';

export class TextButton {
  readonly domNode = document.createElement('div');

  #text = document.createElement('p');

  readonly tooltip = new Tooltip('');

  constructor() {
    this.domNode.classList.add(styles['text-button']);

    this.#text.classList.add(styles['text']);
    this.domNode.append(this.#text);

    this.tooltip.owner = this.domNode;
  }

  get textContent() {
    return this.#text.textContent;
  }

  set textContent(textContent) {
    this.#text.textContent = textContent;
  }

  disable() {
    this.domNode.classList.add(styles['disabled']);
  }

  enable() {
    this.domNode.classList.remove(styles['disabled']);
  }
}
