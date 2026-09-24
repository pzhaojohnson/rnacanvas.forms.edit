import type { App } from './App';

import * as styles from './StrungElementsSelectionTools.module.css';

import { TextButton } from './TextButton';

export class StrungElementsSelectionTools {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #label = document.createElement('p');

  readonly #buttons = {
    'All': new TextButton('All', () => this.#selectAll()),
    'On': new TextButton('On', () => this.#selectOn()),
    'None': new TextButton('None', () => this.#deselectAll()),
  };

  readonly #drawingObserver;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['strung-elements-selection-tools']);

    this.#label.classList.add(styles['label']);
    this.#label.textContent = 'Select:';
    this.domNode.append(this.#label);

    this.#buttons['All'].domNode.style.marginLeft = '20px';
    this.#buttons['On'].domNode.style.marginLeft = '17px';
    this.#buttons['None'].domNode.style.marginLeft = '17px';

    this.domNode.append(...(['All', 'On', 'None'] as const).map(name => this.#buttons[name].domNode));

    targetApp.selectedStrungElements.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    targetApp.selectedPrimaryBonds.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    targetApp.selectedSecondaryBonds.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    targetApp.selectedTertiaryBonds.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    this.#drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, subtree: true });

    this.refresh();
  }

  #selectAll(): void {
    this.#targetApp.addToSelected(this.#targetApp.drawing.strungElements.toArray());
  }

  #selectOn(): void {
    let selectedBonds_ = selectedBonds(this.#targetApp);

    this.#targetApp.addToSelected(
      this.#targetApp.drawing.strungElements.toArray().filter(ele => selectedBonds_.has(ele.owner))
    );
  }

  #deselectAll(): void {
    this.#targetApp.removeFromSelected(this.#targetApp.selectedStrungElements.toArray());
  }

  refresh(): void {
    let allStrungElements = this.#targetApp.drawing.strungElements.toArray();

    let selectedStrungElements = new Set(this.#targetApp.selectedStrungElements.toArray());

    if (allStrungElements.length == 0) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = "There aren't any strung elements in the drawing.";
    } else if (allStrungElements.every(strungElement => selectedStrungElements.has(strungElement))) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = 'All strung elements are already selected.';
    } else {
      this.#buttons['All'].enable();
      this.#buttons['All'].tooltip.textContent = 'Select all strung elements.';
    }

    let selectedBonds_ = selectedBonds(this.#targetApp);

    let onStrungElements = allStrungElements.filter(ele => selectedBonds_.has(ele.owner));

    if (selectedBonds_.size == 0) {
      this.#buttons['On'].disable();
      this.#buttons['On'].tooltip.textContent = 'No bonds are selected.';
    } else if (onStrungElements.length == 0) {
      this.#buttons['On'].disable();
      this.#buttons['On'].tooltip.textContent = "The selected bonds don't have any strung elements.";
    } else if (onStrungElements.every(strungElement => selectedStrungElements.has(strungElement))) {
      this.#buttons['On'].disable();
      this.#buttons['On'].tooltip.textContent = 'All strung elements on the selected bonds are already selected.';
    } else {
      this.#buttons['On'].enable();
      this.#buttons['On'].tooltip.textContent = 'Select strung elements on the selected bonds.';
    }

    if (selectedStrungElements.size == 0) {
      this.#buttons['None'].disable();
      this.#buttons['None'].tooltip.textContent = 'No strung elements are selected.';
    } else {
      this.#buttons['None'].enable();
      this.#buttons['None'].tooltip.textContent = 'Deselect all strung elements.';
    }
  }
}

function selectedBonds(targetApp: App) {
  return new Set([
    ...targetApp.selectedPrimaryBonds,
    ...targetApp.selectedSecondaryBonds,
    ...targetApp.selectedTertiaryBonds,
  ]);
}
