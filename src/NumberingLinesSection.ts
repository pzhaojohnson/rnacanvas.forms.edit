import type { App } from './App';

import * as styles from './NumberingLinesSection.module.css';

import { SectionToggle } from './SectionToggle';

import { NumberingLinesNumSelectedSection } from './NumberingLinesNumSelectedSection';

import { NumberingLinesSelectionTools } from './NumberingLinesSelectionTools';

import { NumberingLinesAddSection } from './NumberingLinesAddSection';

import { NumberingLinesRemoveButton } from './NumberingLinesRemoveButton';

import { NumberingLinesZSection } from './NumberingLinesZSection';

import { NumberingLinesStrokeField } from './NumberingLinesStrokeField';

import { NumberingLinesStrokeColorField } from './NumberingLinesStrokeColorField';

import { NumberingLinesStrokeOpacityField } from './NumberingLinesStrokeOpacityField';

import { NumberingLinesStrokeWidthField } from './NumberingLinesStrokeWidthField';

import { NumberingLinesStrokeLinecapField } from './NumberingLinesStrokeLinecapField';

import { NumberingLinesStrokeDasharrayField } from './NumberingLinesStrokeDasharrayField';

import { NumberingLinesBasePaddingField } from './NumberingLinesBasePaddingField';

import { NumberingLinesTextPaddingField } from './NumberingLinesTextPaddingField';

export class NumberingLinesSection {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #toggle = new SectionToggle('Numbering Lines', () => this.toggle());

  readonly #content = document.createElement('div');

  readonly #numSelectedSection;

  readonly #selectionTools;

  readonly #addSection;
  readonly #removeButton;

  readonly #lowerContent;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['numbering-lines-section']);

    this.domNode.append(this.#toggle.domNode);

    this.#content.classList.add(styles['content']);
    this.domNode.append(this.#content);

    this.#numSelectedSection = new NumberingLinesNumSelectedSection(targetApp);
    this.#content.append(this.#numSelectedSection.domNode);

    this.#selectionTools = new NumberingLinesSelectionTools(targetApp);
    this.#content.append(this.#selectionTools.domNode);

    this.#addSection = new NumberingLinesAddSection(targetApp);
    this.#content.append(this.#addSection.domNode);

    this.#removeButton = new NumberingLinesRemoveButton(targetApp);
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
  }

  expand(): void {
    this.domNode.classList.remove(styles['collapsed']);
  }

  refresh(): void {
    this.#refreshableComponents.forEach(component => component.refresh());
  }

  get #refreshableComponents() {
    return [
      this.#numSelectedSection,
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

  readonly #zSection;

  readonly #strokeField;
  readonly #strokeColorField;
  readonly #strokeOpacityField;
  readonly #strokeWidthField;
  readonly #strokeLinecapField;
  readonly #strokeDasharrayField;

  readonly #basePaddingField;
  readonly #textPaddingField;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['lower-content']);

    // only update when necessary
    targetApp.selectedNumberingLines.addEventListener('change', () => {
      if (document.body.contains(this.domNode)) {
        [...targetApp.selectedNumberingLines].length > 0 ? this.show() : this.hide();
      }
    });

    this.#zSection = new NumberingLinesZSection(targetApp);
    this.domNode.append(this.#zSection.domNode);

    this.#strokeField = new NumberingLinesStrokeField(targetApp);
    this.domNode.append(this.#strokeField.domNode);

    this.#strokeColorField = new NumberingLinesStrokeColorField(targetApp);
    this.domNode.append(this.#strokeColorField.domNode);

    this.#strokeOpacityField = new NumberingLinesStrokeOpacityField(targetApp);
    this.domNode.append(this.#strokeOpacityField.domNode);

    this.#strokeWidthField = new NumberingLinesStrokeWidthField(targetApp);
    this.domNode.append(this.#strokeWidthField.domNode);

    this.#strokeLinecapField = new NumberingLinesStrokeLinecapField(targetApp);
    this.domNode.append(this.#strokeLinecapField.domNode);

    this.#strokeDasharrayField = new NumberingLinesStrokeDasharrayField(targetApp);
    this.domNode.append(this.#strokeDasharrayField.domNode);

    this.#basePaddingField = new NumberingLinesBasePaddingField(targetApp);
    this.domNode.append(this.#basePaddingField.domNode);

    this.#textPaddingField = new NumberingLinesTextPaddingField(targetApp);
    this.domNode.append(this.#textPaddingField.domNode);
  }

  show(): void {
    this.domNode.style.display = 'flex';
  }

  hide(): void {
    this.domNode.style.display = 'none';
  }

  refresh(): void {
    this.#refreshableComponents.forEach(component => component.refresh());

    [...this.#targetApp.selectedNumberingLines].length > 0 ? this.show() : this.hide();
  }

  get #refreshableComponents() {
    return [
      this.#zSection,
      this.#strokeField,
      this.#strokeColorField,
      this.#strokeOpacityField,
      this.#strokeWidthField,
      this.#strokeLinecapField,
      this.#strokeDasharrayField,
      this.#basePaddingField,
      this.#textPaddingField,
    ];
  }
}
