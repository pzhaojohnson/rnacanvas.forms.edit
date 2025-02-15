import type { App } from './App';

import * as styles from './BasesSection.module.css';

import { consensusValue } from '@rnacanvas/consensize';

/**
 * The section for editing bases.
 */
export class BasesSection {
  readonly domNode = document.createElement('div');

  #numBasesSelected;

  #textContentField;

  constructor(targetApp: App) {
    this.#numBasesSelected = new NumBasesSelected(targetApp);
    this.domNode.append(this.#numBasesSelected.domNode);

    this.#textContentField = new TextContentField(targetApp);
    this.domNode.append(this.#textContentField.domNode);
  }

  refresh(): void {
    this.#numBasesSelected.refresh();
    this.#textContentField.refresh();
  }
}

/**
 * A component that shows the number of bases currently selected.
 */
class NumBasesSelected {
  #targetApp;

  readonly domNode = document.createElement('p');

  #numSpan = document.createElement('span');

  #trailingTextSpan = document.createElement('span');

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['num-bases-selected']);

    this.#numSpan.style.fontWeight = '700';

    this.domNode.append(this.#numSpan, this.#trailingTextSpan);

    // only refresh when necessary
    this.#targetApp.selectedBases.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh() : {});

    this.refresh();
  }

  refresh(): void {
    let numBasesSelected = [...this.#targetApp.selectedBases].length;

    this.#numSpan.textContent = `${numBasesSelected}`;

    this.#trailingTextSpan.textContent = numBasesSelected == 1 ? ' base is selected.' : ' bases are selected.';
  }
}

class TextContentField {
  #targetApp;

  readonly domNode = document.createElement('label');

  #input = document.createElement('input');

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['text-input-field']);
    this.domNode.style.marginTop = '12px';

    this.#input.type = 'text';
    this.#input.classList.add(styles['text-input']);
    this.#input.style.marginRight = '8px';

    this.domNode.append(this.#input, 'Text Content');

    // only refresh when necessary
    let drawingObserver = new MutationObserver(() => document.body.contains(this.domNode) ? this.refresh() : {});
    drawingObserver.observe(this.#targetApp.drawing.domNode, { characterData: true, subtree: true });

    this.refresh();

    this.#input.addEventListener('blur', () => this.#submit());

    this.#input.addEventListener('keydown', event => {
      if (event.key.toLowerCase() == 'enter') {
        this.#submit();
      }
    });
  }

  refresh(): void {
    let selectedBases = [...this.#targetApp.selectedBases];

    try {
      this.#input.value = consensusValue(selectedBases.map(b => b.textContent ?? ''));
    } catch {
      this.#input.value = '';
    }
  }

  #submit(): void {
    let textContent = this.#input.value ?? '';

    // don't forget to trim leading and trailing whitespace
    textContent = textContent.trim();

    // don't assign bases empty text content
    if (!textContent) {
      this.refresh();
      return;
    }

    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0 || selectedBases.every(b => b.textContent === textContent)) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedBases.forEach(b => b.textContent = textContent);

    this.refresh();
  }
}
