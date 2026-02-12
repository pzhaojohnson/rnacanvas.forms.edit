import type { App } from './App';

import * as styles from './NumberingLinesSelectionTools.module.css';

import { TextButton } from './TextButton';

export class NumberingLinesSelectionTools {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #label = document.createElement('p');

  readonly #buttons = {
    'All': new TextButton('All', () => this.#selectAll()),
    'Connecting': new TextButton('Connecting', () => this.#selectConnecting()),
    'None': new TextButton('None', () => this.#deselectAll()),
  };

  readonly #drawingObserver;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['numbering-lines-selection-tools']);

    this.#label.classList.add(styles['label']);
    this.#label.textContent = 'Select:';
    this.domNode.append(this.#label);

    this.#buttons['All'].domNode.style.marginLeft = '20px';
    this.#buttons['Connecting'].domNode.style.marginLeft = '17px';
    this.#buttons['None'].domNode.style.marginLeft = '17px';

    this.domNode.append(...(['All', 'Connecting', 'None'] as const).map(name => this.#buttons[name].domNode));

    // only refresh when necessary
    targetApp.selectedNumberings.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when necessary
    this.#drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // watch for any numbering lines being added or removed from the drawing
    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, subtree: true });

    this.refresh();
  }

  /**
   * Select all numbering lines.
   */
  #selectAll() {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.numberingLines]);
  }

  /**
   * Select all numbering lines connecting the currently selected numberings to their owner bases.
   */
  #selectConnecting() {
    let selectedNumberings = new Set(this.#targetApp.selectedNumberings);

    this.#targetApp.addToSelected([...this.#targetApp.drawing.numberingLines].filter(line => selectedNumberings.has(line.owner)));
  }

  /**
   * Deselect all numbering lines.
   */
  #deselectAll() {
    this.#targetApp.removeFromSelected([...this.#targetApp.drawing.numberingLines]);
  }

  refresh(): void {
    let allNumberingLines = [...this.#targetApp.drawing.numberingLines];

    let selectedNumberingLines = new Set(this.#targetApp.selectedNumberingLines);

    if (allNumberingLines.length == 0) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = 'There are no numbering lines in the drawing.';
    } else if (selectedNumberingLines.size == allNumberingLines.length) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = 'All numbering lines are already selected.';
    } else {
      this.#buttons['All'].enable();
      this.#buttons['All'].tooltip.textContent = 'Select all numbering lines.';
    }

    let selectedNumberings = new Set(this.#targetApp.selectedNumberings);

    let connectingNumberingLines = allNumberingLines.filter(line => selectedNumberings.has(line.owner));

    if (selectedNumberings.size == 0) {
      this.#buttons['Connecting'].disable();
      this.#buttons['Connecting'].tooltip.textContent = 'No numberings are selected.';
    } else if (connectingNumberingLines.length == 0) {
      this.#buttons['Connecting'].disable();
      this.#buttons['Connecting'].tooltip.textContent = 'There are no numbering lines connecting the selected numberings.';
    } else if (connectingNumberingLines.every(line => selectedNumberingLines.has(line))) {
      this.#buttons['Connecting'].disable();
      this.#buttons['Connecting'].tooltip.textContent = 'All numbering lines connecting the selected numberings are already selected.';
    } else {
      this.#buttons['Connecting'].enable();
      this.#buttons['Connecting'].tooltip.textContent = 'Select numbering lines connecting the selected numberings.';
    }

    if (selectedNumberingLines.size == 0) {
      this.#buttons['None'].disable();
      this.#buttons['None'].tooltip.textContent = 'No numbering lines are selected.';
    } else {
      this.#buttons['None'].enable();
      this.#buttons['None'].tooltip.textContent = 'Deselect all numbering lines.';
    }
  }
}
