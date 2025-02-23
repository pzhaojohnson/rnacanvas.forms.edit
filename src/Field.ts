import * as styles from './Field.module.css';

export class Field {
  readonly domNode = document.createElement('label');

  #inputElement;

  constructor(readonly name: string, inputElement: HTMLInputElement) {
    this.domNode.classList.add(styles['field']);

    this.#inputElement = inputElement;

    let nameSpan = document.createElement('span');
    nameSpan.textContent = name;
    nameSpan.style.marginLeft = '8px';

    this.domNode.append(inputElement, nameSpan);
  }
}
