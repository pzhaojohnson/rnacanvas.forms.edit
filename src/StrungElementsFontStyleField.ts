import type { App } from './App';

import { AttributeInput } from './AttributeInput';

import { TextInputField } from './TextInputField';

export class StrungElementsFontStyleField {
  readonly #input;

  readonly #field;

  constructor(targetApp: App) {
    this.#input = new AttributeInput('font-style', targetApp.selectedStrungElements, targetApp.drawing);

    this.#input.onBeforeEdit = () => targetApp.pushUndoStack();

    this.#field = new TextInputField('Font Style', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/font-style';

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
