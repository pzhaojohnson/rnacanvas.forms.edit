import type { App } from './App';

import * as styles from './EditingForm.module.css';

import { BasesSection } from './BasesSection';

import { CloseButton } from './CloseButton';

import { DragTranslater } from '@rnacanvas/forms';

export class EditingForm {
  #targetApp;

  readonly domNode = document.createElement('div');

  #basesSection;

  #dragTranslater;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['editing-form']);

    let header = document.createElement('p');
    header.classList.add(styles['header']);
    header.textContent = 'Edit';
    this.domNode.append(header);

    let contentContainer = document.createElement('div');
    contentContainer.classList.add(styles['content-container']);
    this.domNode.append(contentContainer);

    this.#basesSection = new BasesSection(targetApp);
    contentContainer.append(this.#basesSection.domNode);

    // add last to place on top of everything else
    let closeButton = CloseButton();
    closeButton.addEventListener('click', () => this.close());
    this.domNode.append(closeButton);

    this.#dragTranslater = new DragTranslater(this.domNode);
  }

  appendTo(container: Node): void {
    this.refresh();

    this.reposition();

    container.appendChild(this.domNode);
  }

  close() {
    this.domNode.remove();
  }

  refresh(): void {
    this.#basesSection.refresh();
  }

  reposition() {
    this.#dragTranslater.untranslate();
  }
}
