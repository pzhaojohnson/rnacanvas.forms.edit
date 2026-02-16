import type { App } from './App';

import * as styles from './SecondaryBondsSection.module.css';

import { SectionToggle } from './SectionToggle';

import { SecondaryBondsNumSelected } from './SecondaryBondsNumSelected';

import { SecondaryBondsSelectionTools } from './SecondaryBondsSelectionTools';

import { SecondaryBondsAddTools } from './SecondaryBondsAddTools';

import { SecondaryBondsRemoveButton } from './SecondaryBondsRemoveButton';

import { SecondaryBondsZTools } from './SecondaryBondsZTools';

import { SecondaryBondsStrokeField } from './SecondaryBondsStrokeField';

import { SecondaryBondsStrokeColorField } from './SecondaryBondsStrokeColorField';

import { SecondaryBondsStrokeOpacityField } from './SecondaryBondsStrokeOpacityField';

import { SecondaryBondsStrokeWidthField } from './SecondaryBondsStrokeWidthField';

import { SecondaryBondsStrokeLinecapField } from './SecondaryBondsStrokeLinecapField';

import { SecondaryBondsStrokeDasharrayField } from './SecondaryBondsStrokeDasharrayField';

import { SecondaryBondsBasePadding1Field } from './SecondaryBondsBasePadding1Field';

import { SecondaryBondsBasePadding2Field } from './SecondaryBondsBasePadding2Field';

export class SecondaryBondsSection {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #toggle = new SectionToggle('Secondary Bonds', () => this.toggle());

  readonly #contentContainer = document.createElement('div');

  readonly #numSelected;

  readonly #selectionTools;

  readonly #addTools;
  readonly #removeButton;

  readonly #lowerContent;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['secondary-bonds-section']);

    this.domNode.append(this.#toggle.domNode);

    this.#contentContainer.classList.add(styles['content-container']);
    this.domNode.append(this.#contentContainer);

    this.#numSelected = new SecondaryBondsNumSelected(targetApp);
    this.#contentContainer.append(this.#numSelected.domNode);

    this.#selectionTools = new SecondaryBondsSelectionTools(targetApp);
    this.#contentContainer.append(this.#selectionTools.domNode);

    this.#addTools = new SecondaryBondsAddTools(targetApp);
    this.#contentContainer.append(this.#addTools.domNode);

    this.#removeButton = new SecondaryBondsRemoveButton(targetApp);
    this.#contentContainer.append(this.#removeButton.domNode);

    this.#lowerContent = new SecondaryBondsSectionLowerContent(targetApp);
    this.#contentContainer.append(this.#lowerContent.domNode);

    // only refresh when the Edit form is open
    targetApp.selectedSecondaryBonds.addEventListener('change', () => {
      if (document.body.contains(this.domNode)) {
        [...targetApp.selectedSecondaryBonds].length == 0 ? this.#lowerContent.hide() : this.#lowerContent.show();
      }
    });

    this.refresh();

    // collapse by default
    this.collapse();
  }

  toggle(): void {
    this.isCollapsed() ? this.expand() : this.collapse();
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

  refresh(): void {
    this.#refreshableComponents.forEach(component => component.refresh());

    [...this.#targetApp.selectedSecondaryBonds].length == 0 ? this.#lowerContent.hide() : this.#lowerContent.show();
  }

  get #refreshableComponents() {
    return [
      this.#numSelected,
      this.#selectionTools,
      this.#addTools,
      this.#removeButton,
      this.#lowerContent,
    ];
  }
}

class SecondaryBondsSectionLowerContent {
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

    this.domNode.classList.add(styles['secondary-bonds-section-lower-content']);

    this.#zTools = new SecondaryBondsZTools(targetApp);
    this.domNode.append(this.#zTools.domNode);

    this.#strokeField = new SecondaryBondsStrokeField(targetApp);
    this.domNode.append(this.#strokeField.domNode);

    this.#strokeColorField = new SecondaryBondsStrokeColorField(targetApp);
    this.domNode.append(this.#strokeColorField.domNode);

    this.#strokeOpacityField = new SecondaryBondsStrokeOpacityField(targetApp);
    this.domNode.append(this.#strokeOpacityField.domNode);

    this.#strokeWidthField = new SecondaryBondsStrokeWidthField(targetApp);
    this.domNode.append(this.#strokeWidthField.domNode);

    this.#strokeLinecapField = new SecondaryBondsStrokeLinecapField(targetApp);
    this.domNode.append(this.#strokeLinecapField.domNode);

    this.#strokeDasharrayField = new SecondaryBondsStrokeDasharrayField(targetApp);
    this.domNode.append(this.#strokeDasharrayField.domNode);

    this.#basePadding1Field = new SecondaryBondsBasePadding1Field(targetApp);
    this.domNode.append(this.#basePadding1Field.domNode);

    this.#basePadding2Field = new SecondaryBondsBasePadding2Field(targetApp);
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
