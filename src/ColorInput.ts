import * as styles from './ColorInput.module.css';

export class ColorInput {
  readonly domNode = document.createElement('input');

  constructor() {
    this.domNode.classList.add(styles['color-input']);
  }
}
