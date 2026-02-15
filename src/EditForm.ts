import type { App } from './App';

import * as styles from './EditForm.module.css';

import { BasesSection } from './BasesSection';

import { OutlinesSection } from './OutlinesSection';

import { NumberingsSection } from './NumberingsSection';

import { NumberingLinesSection } from './NumberingLinesSection';

import { PrimaryBondsSection } from './PrimaryBondsSection';

import { SecondaryBondsSection } from './SecondaryBondsSection';

import { DrawingSection } from './DrawingSection';

import { CloseButton } from './CloseButton';

import { DragTranslater } from '@rnacanvas/forms';

export class EditForm {
  #targetApp;

  readonly domNode = document.createElement('div');

  #basesSection;

  #outlinesSection;

  #numberingsSection;
  #numberingLinesSection;

  #primaryBondsSection;
  #secondaryBondsSection;

  #drawingSection;

  #dragTranslater;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['edit-form']);

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

    this.#numberingsSection = new NumberingsSection(targetApp);
    contentContainer.append(this.#numberingsSection.domNode);

    this.#numberingLinesSection = new NumberingLinesSection(targetApp);
    contentContainer.append(this.#numberingLinesSection.domNode);

    this.#primaryBondsSection = new PrimaryBondsSection(targetApp);
    contentContainer.append(this.#primaryBondsSection.domNode);

    this.#secondaryBondsSection = new SecondaryBondsSection(targetApp);
    contentContainer.append(this.#secondaryBondsSection.domNode);

    this.#drawingSection = new DrawingSection(targetApp);
    contentContainer.append(this.#drawingSection.domNode);

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
      this.#numberingsSection,
      this.#numberingLinesSection,
      this.#primaryBondsSection,
      this.#secondaryBondsSection,
      this.#drawingSection,
    ];
  }

  refresh(): void {
    this.#refreshableComponents.forEach(component => component.refresh());
  }

  reposition() {
    this.#dragTranslater.untranslate();
  }
}
