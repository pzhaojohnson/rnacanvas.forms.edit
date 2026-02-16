import type { App } from './App';

import { TextInput } from './TextInput';

import { TextInputField } from './TextInputField';

import { consensusValue } from '@rnacanvas/consensize';

export class BasesTextContentField {
  readonly #targetApp;

  readonly #input = new TextInput({
    onSubmit: () => this.#submit(),
  });

  readonly #field = new TextInputField('Text Content', this.#input.domNode);

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent';

    this.domNode.style.marginTop = '23px';
    this.domNode.style.alignSelf = 'start';

    // only refresh when the Edit form is open
    this.#targetApp.selectedBases.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when the Edit form is open
    let drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // watch for the text contents of any bases being changed
    drawingObserver.observe(this.#targetApp.drawing.domNode, { characterData: true, subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    let selectedBases = [...this.#targetApp.selectedBases];

    try {
      this.#input.domNode.value = consensusValue(selectedBases.map(b => b.textContent ?? ''));
    } catch {
      this.#input.domNode.value = '';
    }
  }

  #submit(): void {
    let textContent = this.#input.domNode.value ?? '';

    // trim leading and trailing whitespace
    textContent = textContent.trim();

    // probably best not to assign bases empty text content
    if (!textContent) {
      this.refresh();

      return;
    }

    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0) {
      this.refresh();

      return;
    }

    if (selectedBases.every(b => b.textContent === textContent)) {
      this.refresh();

      return;
    }

    this.#targetApp.pushUndoStack();

    selectedBases.forEach(b => {
      // cache center point
      let centerPoint = { x: b.centerPoint.x, y: b.centerPoint.y };

      b.textContent = textContent;

      // restore center point
      b.centerPoint.x = centerPoint.x;
      b.centerPoint.y = centerPoint.y;
    });

    this.refresh();
  }
}
