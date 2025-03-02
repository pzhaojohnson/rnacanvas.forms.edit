import * as styles from './Field.module.css';

export class Field {
  readonly domNode = document.createElement('label');

  #inputElement;

  #nameAnchor;

  constructor(readonly name: string, inputElement: HTMLInputElement) {
    this.domNode.classList.add(styles['field']);

    this.#inputElement = inputElement;

    this.#nameAnchor = document.createElement('a');
    this.#nameAnchor.textContent = name;

    this.#nameAnchor.target = '_blank';
    this.#nameAnchor.rel = 'noopener noreferrer';

    this.#nameAnchor.style.marginLeft = '8px';

    this.domNode.append(inputElement, this.#nameAnchor);
  }

  /**
   * A URL with information about what the field controls.
   */
  get infoLink() {
    return this.#nameAnchor.href;
  }

  set infoLink(infoLink) {
    this.#nameAnchor.href = infoLink;

    if (infoLink) {
      this.#nameAnchor.classList.add(styles['info-link']);
    } else {
      this.#nameAnchor.classList.remove(styles['info-link']);
    }
  }
}
