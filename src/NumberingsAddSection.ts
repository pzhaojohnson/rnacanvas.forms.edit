import type { App } from './App';

import * as styles from './NumberingsAddSection.module.css';

import { LightSolidButton } from './LightSolidButton';

import { Checkbox } from './Checkbox';

import { CheckboxField } from './CheckboxField';

export class NumberingsAddSection {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #addButton = new LightSolidButton('Add', () => this.#add());

  readonly #onlyAddMissingCheckbox = new Checkbox();

  readonly #onlyAddMissingField = new CheckboxField('Only add missing numberings', this.#onlyAddMissingCheckbox.domNode);

  readonly #drawingObserver;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['numberings-add-section']);

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

    // watch for any numberings being added and removed from the drawing
    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, subtree: true });

    this.#onlyAddMissingCheckbox.domNode.addEventListener('change', () => this.refresh());

    this.refresh();
  }

  #add(): void {
    let allBases = [...this.#targetApp.drawing.bases];

    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0) {
      return;
    }

    let allNumberings = [...this.#targetApp.drawing.numberings];

    let numbered = new Set(allNumberings.map(n => n.owner));

    let notNumbered = selectedBases.filter(b => !numbered.has(b));

    let toNumber = this.#onlyAddMissingCheckbox.domNode.checked ? notNumbered : selectedBases;

    if (toNumber.length == 0) {
      return;
    }

    this.#targetApp.pushUndoStack();

    let added = toNumber.flatMap(b => {
      // the position of the base
      let p = allBases.indexOf(b) + 1;

      return this.#targetApp.drawing.number(b, p);
    });

    this.#targetApp.addToSelected(added);

    this.refresh();
  }

  refresh(): void {
    let selectedBases = [...this.#targetApp.selectedBases];

    let allNumberings = [...this.#targetApp.drawing.numberings];

    let numbered = new Set(allNumberings.map(n => n.owner));

    let notNumbered = selectedBases.filter(b => !numbered.has(b));

    if (selectedBases.length == 0) {
      this.#addButton.disable();
      this.#addButton.tooltip.textContent = 'No bases are selected.';
    } else if (this.#onlyAddMissingCheckbox.domNode.checked && notNumbered.length == 0) {
      this.#addButton.disable();
      this.#addButton.tooltip.textContent = 'All selected bases are already numbered.';
    } else {
      this.#addButton.enable();
      this.#addButton.tooltip.textContent = 'Number the selected bases.';
    }
  }
}
