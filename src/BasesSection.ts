import type { App } from './App';

import * as styles from './BasesSection.module.css';

import { SectionToggle } from './SectionToggle';

import { BasesNumSelected } from './BasesNumSelected';

import { BasesSelectionTools } from './BasesSelectionTools';

import { BasesZTools } from './BasesZTools';

import { BasesTextContentField } from './BasesTextContentField';

import { BasesFillField } from './BasesFillField';

import { BasesFillColorField } from './BasesFillColorField';

import { BasesFillOpacityField } from './BasesFillOpacityField';

import { BasesFontFamilyField } from './BasesFontFamilyField';

import { BasesFontSizeField } from './BasesFontSizeField';

import { BasesFontWeightField } from './BasesFontWeightField';

import { BasesBoldField } from './BasesBoldField';

import { BasesFontStyleField } from './BasesFontStyleField';

import { BasesTextDecorationField } from './BasesTextDecorationField';

import { BasesUnderlinedField } from './BasesUnderlinedField';

export class BasesSection {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #toggle = new SectionToggle('Bases', () => this.toggle());

  readonly #contentContainer = document.createElement('div');

  readonly #numSelected;

  readonly #selectionTools;

  readonly #lowerContent;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['bases-section']);

    this.domNode.append(this.#toggle.domNode);

    this.#contentContainer.classList.add(styles['content-container']);
    this.domNode.append(this.#contentContainer);

    this.#numSelected = new BasesNumSelected(targetApp);
    this.#contentContainer.append(this.#numSelected.domNode);

    this.#selectionTools = new BasesSelectionTools(targetApp);
    this.#contentContainer.append(this.#selectionTools.domNode);

    this.#lowerContent = new BasesSectionLowerContent(targetApp);
    this.#contentContainer.append(this.#lowerContent.domNode);

    // only refresh when the Edit form is open
    targetApp.selectedBases.addEventListener('change', () => {
      if (document.body.contains(this.domNode)) {
        [...targetApp.selectedBases].length > 0 ? this.#lowerContent.show() : this.#lowerContent.hide();
      }
    });

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

    [...this.#targetApp.selectedBases].length > 0 ? this.#lowerContent.show() : this.#lowerContent.hide();
  }

  get #refreshableComponents() {
    return [
      this.#numSelected,
      this.#selectionTools,
      this.#lowerContent,
    ];
  }
}

class BasesSectionLowerContent {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #zTools;

  readonly #textContentField;

  readonly #fillField;
  readonly #fillColorField;
  readonly #fillOpacityField;

  readonly #fontFamilyField;

  readonly #fontSizeField;

  readonly #fontWeightField;
  readonly #boldField;

  readonly #fontStyleField;

  readonly #textDecorationField;
  readonly #underlinedField;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['bases-section-lower-content']);

    this.#zTools = new BasesZTools(targetApp);
    this.domNode.append(this.#zTools.domNode);

    this.#textContentField = new BasesTextContentField(targetApp);
    this.domNode.append(this.#textContentField.domNode);

    this.#fillField = new BasesFillField(targetApp);
    this.domNode.append(this.#fillField.domNode);

    this.#fillColorField = new BasesFillColorField(targetApp);
    this.domNode.append(this.#fillColorField.domNode);

    this.#fillOpacityField = new BasesFillOpacityField(targetApp);
    this.domNode.append(this.#fillOpacityField.domNode);

    this.#fontFamilyField = new BasesFontFamilyField(targetApp);
    this.domNode.append(this.#fontFamilyField.domNode);

    this.#fontSizeField = new BasesFontSizeField(targetApp);
    this.domNode.append(this.#fontSizeField.domNode);

    this.#fontWeightField = new BasesFontWeightField(targetApp);
    this.domNode.append(this.#fontWeightField.domNode);

    this.#boldField = new BasesBoldField(targetApp);
    this.domNode.append(this.#boldField.domNode);

    this.#fontStyleField = new BasesFontStyleField(targetApp);
    this.domNode.append(this.#fontStyleField.domNode);

    this.#textDecorationField = new BasesTextDecorationField(targetApp);
    this.domNode.append(this.#textDecorationField.domNode);

    this.#underlinedField = new BasesUnderlinedField(targetApp);
    this.domNode.append(this.#underlinedField.domNode);
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
    ];
  }
}
