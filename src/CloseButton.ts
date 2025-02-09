import * as styles from './CloseButton.module.css';

export function CloseButton() {
  let domNode = document.createElement('p');

  domNode.classList.add(styles['close-button']);

  domNode.textContent = 'Close';

  return domNode;
}
