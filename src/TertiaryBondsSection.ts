import type { App } from './App';

import * as styles from './TertiaryBondsSection.module.css';

import { SectionToggle } from './SectionToggle';

import { TertiaryBondsNumSelected } from './TertiaryBondsNumSelected';

import { TertiaryBondsSelectionTools } from './TertiaryBondsSelectionTools';

import { TertiaryBondsAddTools } from './TertiaryBondsAddTools';

import { TertiaryBondsRemoveButton } from './TertiaryBondsRemoveButton';

import { TertiaryBondsZTools } from './TertiaryBondsZTools';

import { TertiaryBondsStrokeField } from './TertiaryBondsStrokeField';

import { TertiaryBondsStrokeColorField } from './TertiaryBondsStrokeColorField';

import { TertiaryBondsStrokeOpacityField } from './TertiaryBondsStrokeOpacityField';

import { TertiaryBondsStrokeWidthField } from './TertiaryBondsStrokeWidthField';

import { TertiaryBondsStrokeLinecapField } from './TertiaryBondsStrokeLinecapField';

import { TertiaryBondsStrokeDasharrayField } from './TertiaryBondsStrokeDasharrayField';

export class TertiaryBondsSection {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #toggle = new SectionToggle('Tertiary Bonds', () => this.toggle());

  readonly #contentContainer = document.createElement('div');

  readonly #numSelected;

  readonly #selectionTools;

  readonly #addTools;
  readonly #removeButton;

  readonly #lowerContent;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['tertiary-bonds-section']);

    this.domNode.append(this.#toggle.domNode);

    this.#contentContainer.classList.add(styles['content-container']);
    this.domNode.append(this.#contentContainer);

    this.#numSelected = new TertiaryBondsNumSelected(targetApp);
    this.#contentContainer.append(this.#numSelected.domNode);

    this.#selectionTools = new TertiaryBondsSelectionTools(targetApp);
    this.#contentContainer.append(this.#selectionTools.domNode);

    this.#addTools = new TertiaryBondsAddTools(targetApp);
    this.#contentContainer.append(this.#addTools.domNode);

    this.#removeButton = new TertiaryBondsRemoveButton(targetApp);
    this.#contentContainer.append(this.#removeButton.domNode);

    this.#lowerContent = new LowerContent(targetApp);
    this.#contentContainer.append(this.#lowerContent.domNode);

    // only refresh when the Edit form is open
    targetApp.selectedTertiaryBonds.addEventListener('change', () => {
      if (document.body.contains(this.domNode)) {
        [...targetApp.selectedTertiaryBonds].length == 0 ? this.#lowerContent.hide() : this.#lowerContent.show();
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

    [...this.#targetApp.selectedTertiaryBonds].length == 0 ? this.#lowerContent.hide() : this.#lowerContent.show();
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

class LowerContent {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #zTools;

  readonly #strokeField;
  readonly #strokeColorField;
  readonly #strokeOpacityField;
  readonly #strokeWidthField;
  readonly #strokeLinecapField;
  readonly #strokeDasharrayField;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['lower-content']);

    this.#zTools = new TertiaryBondsZTools(targetApp);
    this.domNode.append(this.#zTools.domNode);

    this.#strokeField = new TertiaryBondsStrokeField(targetApp);
    this.domNode.append(this.#strokeField.domNode);

    this.#strokeColorField = new TertiaryBondsStrokeColorField(targetApp);
    this.domNode.append(this.#strokeColorField.domNode);

    this.#strokeOpacityField = new TertiaryBondsStrokeOpacityField(targetApp);
    this.domNode.append(this.#strokeOpacityField.domNode);

    this.#strokeWidthField = new TertiaryBondsStrokeWidthField(targetApp);
    this.domNode.append(this.#strokeWidthField.domNode);

    this.#strokeLinecapField = new TertiaryBondsStrokeLinecapField(targetApp);
    this.domNode.append(this.#strokeLinecapField.domNode);

    this.#strokeDasharrayField = new TertiaryBondsStrokeDasharrayField(targetApp);
    this.domNode.append(this.#strokeDasharrayField.domNode);

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
    ];
  }
}
