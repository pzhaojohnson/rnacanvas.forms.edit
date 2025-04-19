import * as styles from './TextButton.module.css';

export class TextButton {
  readonly domNode = document.createElement('div');

  #text = document.createElement('p');

  readonly tooltip = new Tooltip();

  constructor() {
    this.domNode.classList.add(styles['text-button']);

    this.#text.classList.add(styles['text']);
    this.domNode.append(this.#text);

    this.domNode.append(this.tooltip.domNode);
  }

  disable() {
    this.domNode.classList.add(styles['disabled']);
  }

  enable() {
    this.domNode.classList.remove(styles['disabled']);
  }
}

class Tooltip {
  readonly domNode = document.createElement('div');

  #text = document.createElement('p');

  constructor() {
    this.domNode.classList.add(styles['tooltip']);

    // hidden by default (until is given text content)
    this.domNode.style.visibility = 'hidden';

    this.#text.classList.add(styles['tooltip-text']);

    let textContainer = document.createElement('div');
    textContainer.classList.add(styles['tooltip-text-container']);
    textContainer.append(this.#text);

    this.domNode.append(textContainer);
  }

  get textContent() {
    return this.#text.textContent;
  }

  set textContent(textContent) {
    this.#text.textContent = textContent;

    this.domNode.style.visibility = textContent ? 'visible' : 'hidden';
  }
}
