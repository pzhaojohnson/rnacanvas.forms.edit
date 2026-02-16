import type { App } from './App';

import * as styles from './PrimaryBondsSection.module.css';

import { SectionToggle } from './SectionToggle';

import { PrimaryBondsNumSelected } from './PrimaryBondsNumSelected';

import { PrimaryBondsSelectionTools } from './PrimaryBondsSelectionTools';

import { PrimaryBondsZTools } from './PrimaryBondsZTools';

import { PrimaryBondsStrokeField } from './PrimaryBondsStrokeField';

import { PrimaryBondsStrokeColorField } from './PrimaryBondsStrokeColorField';

import { PrimaryBondsStrokeOpacityField } from './PrimaryBondsStrokeOpacityField';

import { PrimaryBondsStrokeWidthField } from './PrimaryBondsStrokeWidthField';

import { PrimaryBondsStrokeLinecapField } from './PrimaryBondsStrokeLinecapField';

import { PrimaryBondsStrokeDasharrayField } from './PrimaryBondsStrokeDasharrayField';

import { PrimaryBondsBasePadding1Field } from './PrimaryBondsBasePadding1Field';

import { PrimaryBondsBasePadding2Field } from './PrimaryBondsBasePadding2Field';

export class PrimaryBondsSection {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #toggle = new SectionToggle('Primary Bonds', () => this.toggle());

  readonly #contentContainer = document.createElement('div');

  readonly #numSelected;

  readonly #selectionTools;

  readonly #lowerContent;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['primary-bonds-section']);

    this.domNode.append(this.#toggle.domNode);

    this.#contentContainer.classList.add(styles['content-container']);
    this.domNode.append(this.#contentContainer);

    this.#numSelected = new PrimaryBondsNumSelected(targetApp);
    this.#contentContainer.append(this.#numSelected.domNode);

    this.#selectionTools = new PrimaryBondsSelectionTools(targetApp);
    this.#contentContainer.append(this.#selectionTools.domNode);

    this.#lowerContent = new PrimaryBondsSectionLowerContent(targetApp);
    this.#contentContainer.append(this.#lowerContent.domNode);

    // only refresh when the Edit form is open
    targetApp.selectedPrimaryBonds.addEventListener('change', () => {
      if (document.body.contains(this.domNode)) {
        [...targetApp.selectedPrimaryBonds].length == 0 ? this.#lowerContent.hide() : this.#lowerContent.show();
      }
    });

    this.collapse();

    this.refresh();
  }

  isCollapsed(): boolean {
    return this.domNode.classList.contains(styles['collapsed']);
  }

  collapse(): void {
    this.domNode.classList.add(styles['collapsed']);

    this.#toggle.caret.pointRight();
  }

  expand(): void {
    this.domNode.classList.remove(styles['collapsed']);

    this.#toggle.caret.pointDown();
  }

  toggle(): void {
    this.isCollapsed() ? this.expand() : this.collapse();
  }

  refresh(): void {
    this.#refreshableComponents.forEach(component => component.refresh());

    [...this.#targetApp.selectedPrimaryBonds].length == 0 ? this.#lowerContent.hide() : this.#lowerContent.show();
  }

  get #refreshableComponents() {
    return [
      this.#numSelected,
      this.#selectionTools,
      this.#lowerContent,
    ];
  }
}

class PrimaryBondsSectionLowerContent {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #zTools;

  readonly #strokeField;
  readonly #strokeColorField;
  readonly #strokeOpacityField;
  readonly #strokeWidthField;
  readonly #strokeLinecapField;
  readonly #strokeDasharrayField;

  readonly #basePadding1Field;
  readonly #basePadding2Field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['primary-bonds-section-lower-content']);

    this.#zTools = new PrimaryBondsZTools(targetApp);
    this.domNode.append(this.#zTools.domNode);

    this.#strokeField = new PrimaryBondsStrokeField(targetApp);
    this.domNode.append(this.#strokeField.domNode);

    this.#strokeColorField = new PrimaryBondsStrokeColorField(targetApp);
    this.domNode.append(this.#strokeColorField.domNode);

    this.#strokeOpacityField = new PrimaryBondsStrokeOpacityField(targetApp);
    this.domNode.append(this.#strokeOpacityField.domNode);

    this.#strokeWidthField = new PrimaryBondsStrokeWidthField(targetApp);
    this.domNode.append(this.#strokeWidthField.domNode);

    this.#strokeLinecapField = new PrimaryBondsStrokeLinecapField(targetApp);
    this.domNode.append(this.#strokeLinecapField.domNode);

    this.#strokeDasharrayField = new PrimaryBondsStrokeDasharrayField(targetApp);
    this.domNode.append(this.#strokeDasharrayField.domNode);

    this.#basePadding1Field = new PrimaryBondsBasePadding1Field(targetApp);
    this.domNode.append(this.#basePadding1Field.domNode);

    this.#basePadding2Field = new PrimaryBondsBasePadding2Field(targetApp);
    this.domNode.append(this.#basePadding2Field.domNode);
  }

  show(): void {
    this.domNode.style.display = 'flex';
  }

  hide(): void {
    this.domNode.style.display = 'none';
  }

  refresh(): void {
    this.#refreshableComponents.forEach(component => component.refresh());
  }

  get #refreshableComponents() {
    return [
      this.#zTools,
      this.#strokeField,
      this.#strokeColorField,
      this.#strokeOpacityField,
      this.#strokeWidthField,
      this.#strokeLinecapField,
      this.#strokeDasharrayField,
      this.#basePadding1Field,
      this.#basePadding2Field,
    ];
  }
}
