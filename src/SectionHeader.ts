import * as styles from './SectionHeader.module.css';

export class SectionHeader {
  readonly domNode = document.createElement('div');

  readonly caret = new Caret();

  #text = document.createElement('p');

  constructor(textContent?: string, onClick?: () => void) {
    this.domNode.classList.add(styles['section-header']);

    onClick ? this.domNode.onclick = onClick : {};

    this.caret.domNode.style.marginRight = '6px';
    this.caret.domNode.style.pointerEvents = 'auto';

    this.domNode.append(this.caret.domNode);

    this.#text.classList.add(styles['text']);
    textContent ? this.textContent = textContent : {};

    this.domNode.append(this.#text);
  }

  get textContent() {
    return this.#text.textContent;
  }

  set textContent(textContent) {
    this.#text.textContent = textContent;
  }
}

/**
 * Points right by default.
 */
class Caret {
  readonly domNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  constructor() {
    this.domNode.classList.add(styles['caret']);

    this.domNode.setAttribute('viewBox', '0 0 6 10');

    this.domNode.setAttribute('width', '6');
    this.domNode.setAttribute('height', '10');

    this.domNode.innerHTML = `
      <path
        d="M 1 1 L 5 5 L 1 9"
        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        fill="none"
      ></path>
    `;
  }

  pointRight(): void {
    this.domNode.classList.remove(styles['down-caret']);
  }

  pointDown(): void {
    this.domNode.classList.add(styles['down-caret']);
  }
}
