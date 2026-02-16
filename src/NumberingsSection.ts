import type { App } from './App';

import * as styles from './NumberingsSection.module.css';

import { SectionToggle } from './SectionToggle';

import { NumberingsNumSelected } from './NumberingsNumSelected';

import { NumberingsSelectionTools } from './NumberingsSelectionTools';

import { NumberingsAddTools } from './NumberingsAddTools';

import { NumberingsRemoveButton } from './NumberingsRemoveButton';

import { NumberingsZTools } from './NumberingsZTools';

import { NumberingsTextContentField } from './NumberingsTextContentField';

import { NumberingsFillField } from './NumberingsFillField';

import { NumberingsFillColorField } from './NumberingsFillColorField';

import { NumberingsFillOpacityField } from './NumberingsFillOpacityField';

import { NumberingsFontFamilyField } from './NumberingsFontFamilyField';

import { NumberingsFontSizeField } from './NumberingsFontSizeField';

import { NumberingsFontWeightField } from './NumberingsFontWeightField';

import { NumberingsBoldField } from './NumberingsBoldField';

import { NumberingsFontStyleField } from './NumberingsFontStyleField';

import { NumberingsTextDecorationField } from './NumberingsTextDecorationField';

import { NumberingsUnderlinedField } from './NumberingsUnderlinedField';

import { NumberingsDisplacementSection } from './NumberingsDisplacementSection';

export class NumberingsSection {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #toggle = new SectionToggle('Numberings', () => this.toggle());

  readonly #contentContainer = document.createElement('div');

  readonly #numSelected;

  readonly #selectionTools;

  readonly #addTools;
  readonly #removeButton;

  readonly #lowerContent;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['numberings-section']);

    this.domNode.append(this.#toggle.domNode);

    this.#contentContainer.classList.add(styles['content-container']);
    this.domNode.append(this.#contentContainer);

    this.#numSelected = new NumberingsNumSelected(targetApp);
    this.#contentContainer.append(this.#numSelected.domNode);

    this.#selectionTools = new NumberingsSelectionTools(targetApp);
    this.#contentContainer.append(this.#selectionTools.domNode);

    this.#addTools = new NumberingsAddTools(targetApp);
    this.#contentContainer.append(this.#addTools.domNode);

    this.#removeButton = new NumberingsRemoveButton(targetApp);
    this.#contentContainer.append(this.#removeButton.domNode);

    this.#lowerContent = new LowerContent(targetApp);
    this.#contentContainer.append(this.#lowerContent.domNode);

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

  refresh() {
    this.#refreshableComponents.forEach(component => component.refresh());
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

  #zTools;

  #textContentField;

  #fillField;
  #fillColorField;
  #fillOpacityField;

  #fontFamilyField;
  #fontSizeField;
  #fontWeightField;
  #boldField;
  #fontStyleField;
  #textDecorationField;
  #underlinedField;

  #displacementSection;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['lower-content']);

    // only update when necessary
    targetApp.selectedNumberings.addEventListener('change', () => {
      if (document.body.contains(this.domNode)) {
        [...targetApp.selectedNumberings].length > 0 ? this.show() : this.hide();
      }
    });

    this.#zTools = new NumberingsZTools(targetApp);
    this.domNode.append(this.#zTools.domNode);

    this.#textContentField = new NumberingsTextContentField(targetApp);
    this.domNode.append(this.#textContentField.domNode);

    this.#fillField = new NumberingsFillField(targetApp);
    this.domNode.append(this.#fillField.domNode);

    this.#fillColorField = new NumberingsFillColorField(targetApp);
    this.domNode.append(this.#fillColorField.domNode);

    this.#fillOpacityField = new NumberingsFillOpacityField(targetApp);
    this.domNode.append(this.#fillOpacityField.domNode);

    this.#fontFamilyField = new NumberingsFontFamilyField(targetApp);
    this.domNode.append(this.#fontFamilyField.domNode);

    this.#fontSizeField = new NumberingsFontSizeField(targetApp);
    this.domNode.append(this.#fontSizeField.domNode);

    this.#fontWeightField = new NumberingsFontWeightField(targetApp);
    this.domNode.append(this.#fontWeightField.domNode);

    this.#boldField = new NumberingsBoldField(targetApp);
    this.domNode.append(this.#boldField.domNode);

    this.#fontStyleField = new NumberingsFontStyleField(targetApp);
    this.domNode.append(this.#fontStyleField.domNode);

    this.#textDecorationField = new NumberingsTextDecorationField(targetApp);
    this.domNode.append(this.#textDecorationField.domNode);

    this.#underlinedField = new NumberingsUnderlinedField(targetApp);
    this.domNode.append(this.#underlinedField.domNode);

    this.#displacementSection = new NumberingsDisplacementSection(targetApp);
    this.domNode.append(this.#displacementSection.domNode);
  }

  show(): void {
    this.domNode.style.display = 'flex';
  }

  hide(): void {
    this.domNode.style.display = 'none';
  }

  refresh(): void {
    this.#refreshableComponents.forEach(component => component.refresh());

    [...this.#targetApp.selectedNumberings].length > 0 ? this.show() : this.hide();
  }

  get #refreshableComponents() {
    return [
      this.#zTools,
      this.#textContentField,
      this.#fillField,
      this.#fillColorField,
      this.#fillOpacityField,
      this.#fontFamilyField,
      this.#fontSizeField,
      this.#fontWeightField,
      this.#boldField,
      this.#fontStyleField,
      this.#textDecorationField,
      this.#underlinedField,
      this.#displacementSection,
    ];
  }
}
