import type { App } from './App';

import * as styles from './NumberingsSelectionTools.module.css';

import { TextButton } from './TextButton';

export class NumberingsSelectionTools {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #label = document.createElement('p');

  readonly #buttons = {
    'All': new TextButton('All', () => this.#selectAll()),
    'Numbering': new TextButton('Numbering', () => this.#selectNumbering()),
    'None': new TextButton('None', () => this.#deselectAll()),
  }

  readonly #drawingObserver;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['numberings-selection-tools']);

    this.#label.classList.add(styles['label']);
    this.#label.textContent = 'Select:';
    this.domNode.append(this.#label);

    this.#buttons['All'].domNode.style.marginLeft = '20px';
    this.#buttons['Numbering'].domNode.style.marginLeft = '17px';
    this.#buttons['None'].domNode.style.marginLeft = '17px';

    this.domNode.append(...(['All', 'Numbering', 'None'] as const).map(name => this.#buttons[name].domNode));

    // only refresh when necessary
    targetApp.selectedNumberings.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when necessary
    this.#drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh(): {};
    });

    // watch for any numberings being added or removed from the drawing
    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, subtree: true });

    this.refresh();
  }

  /**
   * Select all numberings.
   */
  #selectAll() {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.numberings]);
  }

  /**
   * Select all numberings numbering the currently selected bases.
   */
  #selectNumbering() {
    let selectedBases = new Set(this.#targetApp.selectedBases);

    this.#targetApp.addToSelected([...this.#targetApp.drawing.numberings].filter(n => selectedBases.has(n.owner)));
  }

  /**
   * Deselect all numberings.
   */
  #deselectAll() {
    this.#targetApp.removeFromSelected([...this.#targetApp.drawing.numberings]);
  }

  refresh(): void {
    let allNumberings = [...this.#targetApp.drawing.numberings];

    let selectedNumberings = new Set(this.#targetApp.selectedNumberings);

    if (allNumberings.length == 0) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = 'There are no numberings in the drawing.';
    } else if (selectedNumberings.size == allNumberings.length) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = 'All numberings are already selected.';
    } else {
      this.#buttons['All'].enable();
      this.#buttons['All'].tooltip.textContent = 'Select all numberings.';
    }

    let selectedBases = new Set(this.#targetApp.selectedBases);

    let numberingNumberings = allNumberings.filter(n => selectedBases.has(n.owner));

    if (selectedBases.size == 0) {
      this.#buttons['Numbering'].disable();
      this.#buttons['Numbering'].tooltip.textContent = 'No bases are selected.';
    } else if (numberingNumberings.length == 0) {
      this.#buttons['Numbering'].disable();
      this.#buttons['Numbering'].tooltip.textContent = 'None of the selected bases are numbered.';
    } else if (numberingNumberings.every(n => selectedNumberings.has(n))) {
      this.#buttons['Numbering'].disable();
      this.#buttons['Numbering'].tooltip.textContent = 'All numberings numbering the selected bases are already selected.';
    } else {
      this.#buttons['Numbering'].enable();
      this.#buttons['Numbering'].tooltip.textContent = 'Select numberings numbering the selected bases.';
    }

    if (selectedNumberings.size == 0) {
      this.#buttons['None'].disable();
      this.#buttons['None'].tooltip.textContent = 'No numberings are selected.';
    } else {
      this.#buttons['None'].enable();
      this.#buttons['None'].tooltip.textContent = 'Deselect all numberings.';
    }
  }
}
