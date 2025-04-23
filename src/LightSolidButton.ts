import * as styles from './LightSolidButton.module.css';

import { Tooltip } from '@rnacanvas/tooltips';

export class LightSolidButton {
  readonly domNode = document.createElement('div');

  #button = document.createElement('p');

  readonly tooltip = new Tooltip('');

  constructor(textContent?: string, onClick?: () => void) {
    this.domNode.classList.add(styles.container);

    this.#button.classList.add(styles['light-solid-button']);

    textContent ? this.textContent = textContent : {};

    onClick ? this.onClick = onClick : {};

    this.domNode.append(this.#button);

    this.tooltip.owner = this.domNode;
  }

  get textContent() {
    return this.#button.textContent;
  }

  set textContent(textContent) {
    this.#button.textContent = textContent;
  }

  get onClick() {
    return this.#button.onclick;
  }

  set onClick(onClick) {
    this.#button.onclick = onClick;
  }

  click(): void {
    this.#button.click();
  }

  disable(): void {
    this.#button.classList.add(styles['disabled']);
  }

  enable(): void {
    this.#button.classList.remove(styles['disabled']);
  }

  isDisabled(): boolean {
    return this.#button.classList.contains(styles['disabled']);
  }

  isEnabled(): boolean {
    return !this.isDisabled();
  }
}
