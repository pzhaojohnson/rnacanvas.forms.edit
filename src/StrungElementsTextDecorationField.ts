import type { App } from './App';

import { AttributeInput } from './AttributeInput';

import { TextInputField } from './TextInputField';

export class StrungElementsTextDecorationField {
  readonly #input;

  readonly #field;

  constructor(targetApp: App) {
    this.#input = new AttributeInput('text-decoration', targetApp.selectedStrungElements, targetApp.drawing);

    this.#input.onBeforeEdit = () => targetApp.pushUndoStack();

    this.#field = new TextInputField('Text Decoration', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/text-decoration';

    this.domNode.style.marginTop = '10px';
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
