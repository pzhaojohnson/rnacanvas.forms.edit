import type { App } from './App';

import * as styles from './EditingForm.module.css';

import { BasesSection } from './BasesSection';

import { OutlinesSection } from './OutlinesSection';

import { CloseButton } from './CloseButton';

import { DragTranslater } from '@rnacanvas/forms';

export class EditingForm {
  #targetApp;

  readonly domNode = document.createElement('div');

  #basesSection;
  #outlinesSection;

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

    this.#outlinesSection = new OutlinesSection(targetApp);
    contentContainer.append(this.#outlinesSection.domNode);

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

  get #refreshableComponents() {
    return [
      this.#basesSection,
      this.#outlinesSection,
    ];
  }

  refresh(): void {
    this.#refreshableComponents.forEach(component => component.refresh());
  }

  reposition() {
    this.#dragTranslater.untranslate();
  }
}
