import type { App } from './App';

import * as styles from './OutlinesSelectionTools.module.css';

import { TextButton } from './TextButton';

export class OutlinesSelectionTools {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #label = document.createElement('p');

  readonly #buttons = {
    'All': new TextButton('All', () => this.#selectAll()),
    'Outlining': new TextButton('Outlining', () => this.#selectOutlining()),
    'None': new TextButton('None', () => this.#deselectAll()),
  };

  readonly #drawingObserver;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['outlines-selection-tools']);

    this.#label.classList.add(styles['label']);
    this.#label.textContent = 'Select:';
    this.domNode.append(this.#label);

    this.#buttons['All'].domNode.style.marginLeft = '20px';
    this.#buttons['Outlining'].domNode.style.marginLeft = '17px';
    this.#buttons['None'].domNode.style.marginLeft = '17px';

    this.domNode.append(...(['All', 'Outlining', 'None'] as const).map(name => this.#buttons[name].domNode));

    // only refresh when the Edit form is open
    targetApp.selectedOutlines.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when the Edit form is open
    this.#drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh(): {};
    });

    // watch for when any outlines are added or removed from the drawing
    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, subtree: true });

    this.refresh();
  }

  #selectAll() {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.outlines]);
  }

  #selectOutlining() {
    let selectedBases = new Set(this.#targetApp.selectedBases);

    this.#targetApp.addToSelected([...this.#targetApp.drawing.outlines].filter(o => selectedBases.has(o.owner)));
  }

  #deselectAll() {
    this.#targetApp.removeFromSelected([...this.#targetApp.drawing.outlines]);
  }

  refresh(): void {
    let allOutlines = [...this.#targetApp.drawing.outlines];

    let selectedOutlines = new Set(this.#targetApp.selectedOutlines);

    if (allOutlines.length == 0) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = "There aren't any outlines in the drawing.";
    } else if (selectedOutlines.size == allOutlines.length) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = 'All outlines are already selected.';
    } else {
      this.#buttons['All'].enable();
      this.#buttons['All'].tooltip.textContent = 'Select all outlines.';
    }

    let selectedBases = new Set(this.#targetApp.selectedBases);

    let outliningOutlines = allOutlines.filter(o => selectedBases.has(o.owner));

    if (selectedBases.size == 0) {
      this.#buttons['Outlining'].disable();
      this.#buttons['Outlining'].tooltip.textContent = 'No bases are selected.';
    } else if (outliningOutlines.length == 0) {
      this.#buttons['Outlining'].disable();
      this.#buttons['Outlining'].tooltip.textContent = 'None of the selected bases are outlined.';
    } else if (outliningOutlines.every(o => selectedOutlines.has(o))) {
      this.#buttons['Outlining'].disable();
      this.#buttons['Outlining'].tooltip.textContent = 'All outlines outlining the selected bases are already selected.';
    } else {
      this.#buttons['Outlining'].enable();
      this.#buttons['Outlining'].tooltip.textContent = 'Select outlines outlining the selected bases.';
    }

    if (selectedOutlines.size == 0) {
      this.#buttons['None'].disable();
      this.#buttons['None'].tooltip.textContent = 'No outlines are selected.';
    } else {
      this.#buttons['None'].enable();
      this.#buttons['None'].tooltip.textContent = 'Deselect all outlines.';
    }
  }
}
