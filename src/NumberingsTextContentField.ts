import type { App } from './App';

import { TextContentInput } from './TextContentInput';

import { TextInputField } from './TextInputField';

export class NumberingsTextContentField {
  readonly #targetApp;

  readonly #input;

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input = new TextContentInput(targetApp.selectedNumberings, targetApp.drawing);

    this.#input.onBeforeEdit = () => {
      targetApp.pushUndoStack();
    };

    this.#input.onEdit = () => {
      [...targetApp.selectedNumberings].forEach(ele => {
        // effectively reposition the numbering (after its text content has been changed)
        ele.displacement.magnitude += 1;
        ele.displacement.magnitude -= 1;
      });
    };

    this.#field = new TextInputField('Text Content', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent';

    this.domNode.style.marginTop = '20px';
    this.domNode.style.alignSelf = 'start';
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    this.#input.refresh();
  }
}
