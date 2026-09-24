import type { App } from './App';

import * as styles from './StrungElementsSection.module.css';

import { SectionToggle } from './SectionToggle';

import { StrungElementsZTools } from './StrungElementsZTools';

import { StrungElementsAddTools } from './StrungElementsAddTools';

import { StrungElementsRemoveButton } from './StrungElementsRemoveButton';

import { StrungElementsNumSelected } from './StrungElementsNumSelected';

import { StrungElementsSelectionTools } from './StrungElementsSelectionTools';

import { StrungElementsStrokeField } from './StrungElementsStrokeField';

import { StrungElementsStrokeWidthField } from './StrungElementsStrokeWidthField';

import { StrungElementsFillField } from './StrungElementsFillField';

import { StrungElementsStrokeColorField } from './StrungElementsStrokeColorField';

import { StrungElementsStrokeOpacityField } from './StrungElementsStrokeOpacityField';

import { StrungElementsStrokeLinecapField } from './StrungElementsStrokeLinecapField';

import { StrungElementsStrokeDasharrayField } from './StrungElementsStrokeDasharrayField';

import { StrungElementsFillColorField } from './StrungElementsFillColorField';

import { StrungElementsFillOpacityField } from './StrungElementsFillOpacityField';

import { StrungElementsFontFamilyField } from './StrungElementsFontFamilyField';

import { StrungElementsFontSizeField } from './StrungElementsFontSizeField';

import { StrungElementsFontStyleField } from './StrungElementsFontStyleField';

import { StrungElementsFontWeightField } from './StrungElementsFontWeightField';

import { StrungElementsBoldField } from './StrungElementsBoldField';

import { StrungElementsTextDecorationField } from './StrungElementsTextDecorationField';

import { StrungElementsUnderlinedField } from './StrungElementsUnderlinedField';

import { StrungElementsTextContentField } from './StrungElementsTextContentField';

export class StrungElementsSection {
  readonly domNode = document.createElement('div');

  readonly #toggle = new SectionToggle('Strung Elements', () => this.toggle());

  readonly #contentContainer = document.createElement('div');

  readonly #numSelected;

  readonly #selectionTools;

  readonly #addTools;
  readonly #removeButton;

  readonly #lowerContent;

  constructor(targetApp: App) {
    this.domNode.classList.add(styles['strung-elements-section']);

    this.domNode.append(this.#toggle.domNode);

    this.#contentContainer.classList.add(styles['content-container']);
    this.domNode.append(this.#contentContainer);

    this.#numSelected = new StrungElementsNumSelected(targetApp);
    this.#contentContainer.append(this.#numSelected.domNode);

    this.#selectionTools = new StrungElementsSelectionTools(targetApp);
    this.#contentContainer.append(this.#selectionTools.domNode);

    this.#addTools = new StrungElementsAddTools(targetApp);
    this.#contentContainer.append(this.#addTools.domNode);

    this.#removeButton = new StrungElementsRemoveButton(targetApp);
    this.#contentContainer.append(this.#removeButton.domNode);

    this.#lowerContent = new LowerContent(targetApp);
    this.#contentContainer.append(this.#lowerContent.domNode);

    targetApp.selectedStrungElements.addEventListener('change', () => {
      if (document.body.contains(this.domNode)) {
        this.#lowerContent.refresh();
      }
    });

    // collapsed by default
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
    this.#lowerContent.refresh();
  }
}

class LowerContent {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #zTools;

  readonly #strokeFieldsContainer = document.createElement('div');

  readonly #strokeField;
  readonly #strokeColorField;
  readonly #strokeOpacityField;
  readonly #strokeWidthField;
  readonly #strokeLinecapField;
  readonly #strokeDasharrayField;

  readonly #fillField;
  readonly #fillColorField;
  readonly #fillOpacityField;

  readonly #textFieldsContainer = document.createElement('div');

  readonly #fontFamilyField;
  readonly #fontSizeField;
  readonly #fontStyleField;
  readonly #fontWeightField;
  readonly #boldField;
  readonly #textDecorationField;
  readonly #underlinedField;
  readonly #textContentField;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['lower-content']);

    targetApp.selectedStrungElements.addEventListener('change', () => {
      if (document.body.contains(this.domNode)) {
        [...targetApp.selectedStrungElements].length == 0 ? this.hide() : this.show();
      }
    });

    this.#zTools = new StrungElementsZTools(targetApp);
    this.domNode.append(this.#zTools.domNode);

    this.#strokeFieldsContainer.style.display = 'flex';
    this.#strokeFieldsContainer.style.flexDirection = 'column';

    this.domNode.append(this.#strokeFieldsContainer);

    this.#strokeField = new StrungElementsStrokeField(targetApp);
    this.#strokeFieldsContainer.append(this.#strokeField.domNode);

    this.#strokeColorField = new StrungElementsStrokeColorField(targetApp);
    this.#strokeFieldsContainer.append(this.#strokeColorField.domNode);

    this.#strokeOpacityField = new StrungElementsStrokeOpacityField(targetApp);
    this.#strokeFieldsContainer.append(this.#strokeOpacityField.domNode);

    this.#strokeWidthField = new StrungElementsStrokeWidthField(targetApp);
    this.#strokeFieldsContainer.append(this.#strokeWidthField.domNode);

    this.#strokeLinecapField = new StrungElementsStrokeLinecapField(targetApp);
    this.#strokeFieldsContainer.append(this.#strokeLinecapField.domNode);

    this.#strokeDasharrayField = new StrungElementsStrokeDasharrayField(targetApp);
    this.#strokeFieldsContainer.append(this.#strokeDasharrayField.domNode);

    this.#fillField = new StrungElementsFillField(targetApp);
    this.domNode.append(this.#fillField.domNode);

    this.#fillColorField = new StrungElementsFillColorField(targetApp);
    this.domNode.append(this.#fillColorField.domNode);

    this.#fillOpacityField = new StrungElementsFillOpacityField(targetApp);
    this.domNode.append(this.#fillOpacityField.domNode);

    this.#textFieldsContainer.style.display = 'flex';
    this.#textFieldsContainer.style.flexDirection = 'column';

    this.domNode.append(this.#textFieldsContainer);

    this.#fontFamilyField = new StrungElementsFontFamilyField(targetApp);
    this.#textFieldsContainer.append(this.#fontFamilyField.domNode);

    this.#fontSizeField = new StrungElementsFontSizeField(targetApp);
    this.#textFieldsContainer.append(this.#fontSizeField.domNode);

    this.#fontStyleField = new StrungElementsFontStyleField(targetApp);
    this.#textFieldsContainer.append(this.#fontStyleField.domNode);

    this.#fontWeightField = new StrungElementsFontWeightField(targetApp);
    this.#textFieldsContainer.append(this.#fontWeightField.domNode);

    this.#boldField = new StrungElementsBoldField(targetApp);
    this.#textFieldsContainer.append(this.#boldField.domNode);

    this.#textDecorationField = new StrungElementsTextDecorationField(targetApp);
    this.#textFieldsContainer.append(this.#textDecorationField.domNode);

    this.#underlinedField = new StrungElementsUnderlinedField(targetApp);
    this.#textFieldsContainer.append(this.#underlinedField.domNode);

    this.#textContentField = new StrungElementsTextContentField(targetApp);
    this.#textFieldsContainer.append(this.#textContentField.domNode);
  }

  show(): void {
    this.domNode.style.display = 'flex';
  }

  hide(): void {
    this.domNode.style.display = 'none';
  }

  refresh(): void {
    let selectedStrungElements = this.#targetApp.selectedStrungElements.toArray();

    selectedStrungElements.length == 0 ? this.hide() : this.show();

    let selectedStrungTextElements = selectedStrungElements.filter(ele => ele.domNode.localName == 'text');

    this.#strokeFieldsContainer.style.display = selectedStrungTextElements.length == selectedStrungElements.length ? 'none' : 'flex';

    this.#textFieldsContainer.style.display = selectedStrungTextElements.length == 0 ? 'none' : 'flex';

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
      this.#fillField,
      this.#fillColorField,
      this.#fillOpacityField,
      this.#fontFamilyField,
      this.#fontSizeField,
      this.#fontStyleField,
      this.#fontWeightField,
      this.#boldField,
      this.#textDecorationField,
      this.#underlinedField,
      this.#textContentField,
    ];
  }
}
