import * as styles from './Checkbox.module.css';

export class Checkbox {
  readonly domNode = document.createElement('input');

  constructor() {
    this.domNode.type = 'checkbox';

    this.domNode.classList.add(styles['checkbox']);
  }
}
