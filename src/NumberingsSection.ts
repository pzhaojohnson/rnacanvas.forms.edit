import type { App } from './App';

import * as styles from './NumberingsSection.module.css';

import { SectionHeader } from './SectionHeader';

import { NumberingsNumSelected } from './NumberingsNumSelected';

import { NumberingsSelectionTools } from './NumberingsSelectionTools';

import { NumberingsAddSection } from './NumberingsAddSection';

import { NumberingsRemoveButton } from './NumberingsRemoveButton';

import { NumberingsZSection } from './NumberingsZSection';

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

  readonly #header = new SectionHeader('Numberings', () => this.toggle());

  readonly #content = document.createElement('div');

  readonly #numSelected;

  readonly #selectionTools;

  readonly #addSection;
  readonly #removeButton;

  readonly #lowerContent;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['numberings-section']);

    this.domNode.append(this.#header.domNode);

    this.#content.classList.add(styles['content']);
    this.domNode.append(this.#content);

    this.#numSelected = new NumberingsNumSelected(targetApp);
    this.#content.append(this.#numSelected.domNode);

    this.#selectionTools = new NumberingsSelectionTools(targetApp);
    this.#content.append(this.#selectionTools.domNode);

    this.#addSection = new NumberingsAddSection(targetApp);
    this.#content.append(this.#addSection.domNode);

    this.#removeButton = new NumberingsRemoveButton(targetApp);
    this.#content.append(this.#removeButton.domNode);

    this.#lowerContent = new LowerContent(targetApp);
    this.#content.append(this.#lowerContent.domNode);

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

    this.#header.caret.pointRight();
  }

  expand(): void {
    this.domNode.classList.remove(styles['collapsed']);

    this.#header.caret.pointDown();
  }

  refresh() {
    this.#refreshableComponents.forEach(component => component.refresh());
  }

  get #refreshableComponents() {
    return [
      this.#numSelected,
      this.#selectionTools,
      this.#addSection,
      this.#removeButton,
      this.#lowerContent,
    ];
  }
}

class LowerContent {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  #zSection;

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

    this.#zSection = new NumberingsZSection(targetApp);
    this.domNode.append(this.#zSection.domNode);

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
      this.#zSection,
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
