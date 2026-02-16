import type { App } from './App';

import { BasesAttributeInput } from './BasesAttributeInput';

import { TextInputField } from './TextInputField';

export class BasesFontStyleField {
  readonly #targetApp;

  readonly #input;

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedBases = targetApp.selectedBases;

    let parentDrawing = targetApp.drawing;

    this.#input = new BasesAttributeInput('font-style', selectedBases, parentDrawing);

    this.#input.onBeforeEdit = () => targetApp.pushUndoStack();

    this.#field = new TextInputField('Font Style', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/font-style';

    this.domNode.style.marginTop = '12px';
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
