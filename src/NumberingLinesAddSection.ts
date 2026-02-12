import type { App } from './App';

import * as styles from './NumberingLinesAddSection.module.css';

import { LightSolidButton } from './LightSolidButton';

import { Checkbox } from './Checkbox';

import { CheckboxField } from './CheckboxField';

export class NumberingLinesAddSection {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #addButton = new LightSolidButton('Add', () => this.#add());

  readonly #onlyAddMissingCheckbox = new Checkbox();

  readonly #onlyAddMissingField = new CheckboxField('Only add missing numbering lines', this.#onlyAddMissingCheckbox.domNode);

  readonly #drawingObserver;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['numbering-lines-add-section']);

    this.domNode.append(this.#addButton.domNode);

    // checked by default
    this.#onlyAddMissingCheckbox.domNode.checked = true;

    this.#onlyAddMissingField.domNode.style.margin = '10px 0px 0px 10px';
    this.#onlyAddMissingField.domNode.style.alignSelf = 'start';

    this.domNode.append(this.#onlyAddMissingField.domNode);

    // only refresh when necessary
    targetApp.selectedBases.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when necessary
    this.#drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // watch for any numbering lines being added or removed from the drawing
    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, subtree: true });

    this.#onlyAddMissingCheckbox.domNode.addEventListener('change', () => this.refresh());

    this.refresh();
  }

  #add(): void {
    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    if (selectedNumberings.length == 0) {
      return;
    }

    let allNumberingLines = [...this.#targetApp.drawing.numberingLines];

    let connectedNumberings = new Set(allNumberingLines.map(n => n.owner));

    let unconnectedNumberings = selectedNumberings.filter(n => !connectedNumberings.has(n));

    let numberingsToConnect = this.#onlyAddMissingCheckbox.domNode.checked ? unconnectedNumberings : selectedNumberings;

    if (numberingsToConnect.length == 0) {
      return;
    }

    this.#targetApp.pushUndoStack();

    let addedNumberingLines = numberingsToConnect.map(n => this.#targetApp.drawing.connect(n));

    this.#targetApp.addToSelected(addedNumberingLines);

    this.refresh();
  }

  refresh(): void {
    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    let allNumberingLines = [...this.#targetApp.drawing.numberingLines];

    let connectedNumberings = new Set(allNumberingLines.map(n => n.owner));

    let unconnectedNumberings = selectedNumberings.filter(n => !connectedNumberings.has(n));

    if (selectedNumberings.length == 0) {
      this.#addButton.disable();
      this.#addButton.tooltip.textContent = 'No numberings are selected.';
    } else if (this.#onlyAddMissingCheckbox.domNode.checked && unconnectedNumberings.length == 0) {
      this.#addButton.disable();
      this.#addButton.tooltip.textContent = 'All selected numberings are already connected by lines.';
    } else {
      this.#addButton.enable();
      this.#addButton.tooltip.textContent = 'Connect the selected numberings with lines.';
    }
  }
}
