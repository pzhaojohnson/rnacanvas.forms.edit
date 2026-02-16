import type { App } from './App';

import * as styles from './OutlinesSection.module.css';

import { SectionToggle } from './SectionToggle';

import { OutlinesNumSelected } from './OutlinesNumSelected';

import { OutlinesSelectionTools } from './OutlinesSelectionTools';

import { OutlinesAddTools } from './OutlinesAddTools';

import { OutlinesRemoveButton } from './OutlinesRemoveButton';

import { OutlinesZTools } from './OutlinesZTools';

import { OutlinesRField } from './OutlinesRField';

import { OutlinesFillField } from './OutlinesFillField';

import { OutlinesFillColorField } from './OutlinesFillColorField';

import { OutlinesFillOpacityField } from './OutlinesFillOpacityField';

import { OutlinesStrokeField } from './OutlinesStrokeField';

import { OutlinesStrokeColorField } from './OutlinesStrokeColorField';

import { OutlinesStrokeOpacityField } from './OutlinesStrokeOpacityField';

import { OutlinesStrokeWidthField } from './OutlinesStrokeWidthField';

import { OutlinesStrokeDasharrayField } from './OutlinesStrokeDasharrayField';

export class OutlinesSection {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #toggle = new SectionToggle('Outlines', () => this.toggle());

  readonly #contentContainer = document.createElement('div');

  readonly #numSelected;

  readonly #selectionTools;

  readonly #addTools;
  readonly #removeButton;

  readonly #lowerContent;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['outlines-section']);

    this.domNode.append(this.#toggle.domNode);

    this.#contentContainer.classList.add(styles['content-container']);
    this.domNode.append(this.#contentContainer);

    this.#numSelected = new OutlinesNumSelected(targetApp);
    this.#contentContainer.append(this.#numSelected.domNode);

    this.#selectionTools = new OutlinesSelectionTools(targetApp);
    this.#contentContainer.append(this.#selectionTools.domNode);

    this.#addTools = new OutlinesAddTools(targetApp);
    this.#contentContainer.append(this.#addTools.domNode);

    this.#removeButton = new OutlinesRemoveButton(targetApp);
    this.#contentContainer.append(this.#removeButton.domNode);

    this.#lowerContent = new OutlinesSectionLowerContent(targetApp);
    this.#contentContainer.append(this.#lowerContent.domNode);

    // only refresh when the Edit form is open
    targetApp.selectedOutlines.addEventListener('change', () => {
      if (document.body.contains(this.domNode)) {
        [...targetApp.selectedOutlines].length > 0 ? this.#lowerContent.show() : this.#lowerContent.hide();
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

    [...this.#targetApp.selectedOutlines].length > 0 ? this.#lowerContent.show() : this.#lowerContent.hide();
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

class OutlinesSectionLowerContent {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #zTools;

  readonly #rField;

  readonly #fillField;
  readonly #fillColorField;
  readonly #fillOpacityField;

  readonly #strokeField;
  readonly #strokeColorField;
  readonly #strokeOpacityField;
  readonly #strokeWidthField;
  readonly #strokeDasharrayField;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['outlines-section-lower-content']);

    this.#zTools = new OutlinesZTools(targetApp);
    this.domNode.append(this.#zTools.domNode);

    this.#rField = new OutlinesRField(targetApp);
    this.domNode.append(this.#rField.domNode);

    this.#fillField = new OutlinesFillField(targetApp);
    this.domNode.append(this.#fillField.domNode);

    this.#fillColorField = new OutlinesFillColorField(targetApp);
    this.domNode.append(this.#fillColorField.domNode);

    this.#fillOpacityField = new OutlinesFillOpacityField(targetApp);
    this.domNode.append(this.#fillOpacityField.domNode);

    this.#strokeField = new OutlinesStrokeField(targetApp);
    this.domNode.append(this.#strokeField.domNode);

    this.#strokeColorField = new OutlinesStrokeColorField(targetApp);
    this.domNode.append(this.#strokeColorField.domNode);

    this.#strokeOpacityField = new OutlinesStrokeOpacityField(targetApp);
    this.domNode.append(this.#strokeOpacityField.domNode);

    this.#strokeWidthField = new OutlinesStrokeWidthField(targetApp);
    this.domNode.append(this.#strokeWidthField.domNode);

    this.#strokeDasharrayField = new OutlinesStrokeDasharrayField(targetApp);
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
      this.#rField,
      this.#fillField,
      this.#fillColorField,
      this.#fillOpacityField,
      this.#strokeField,
      this.#strokeColorField,
      this.#strokeOpacityField,
      this.#strokeWidthField,
      this.#strokeDasharrayField,
    ];
  }
}
