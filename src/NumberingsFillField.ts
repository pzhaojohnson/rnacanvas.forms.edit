import type { App } from './App';

import { AttributeInput } from './AttributeInput';

import { TextInputField } from './TextInputField';

export class NumberingsFillField {
  readonly #targetApp;

  readonly #input;

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedNumberings = targetApp.selectedNumberings;

    let parentDrawing = targetApp.drawing;

    this.#input = new AttributeInput('fill', selectedNumberings, parentDrawing);

    this.#input.onBeforeEdit = () => targetApp.pushUndoStack();

    this.#field = new TextInputField('Fill', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill';

    this.domNode.style.marginTop = '14px';
    this.domNode.style.alignSelf = 'start';

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    this.#input.refresh();
  }
}
