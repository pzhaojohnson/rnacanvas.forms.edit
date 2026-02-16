import type { App } from './App';

import { AttributeInput } from './AttributeInput';

import { TextInputField } from './TextInputField';

import { StaticCollection } from './StaticCollection';

export class DrawingNameField {
  readonly #targetApp;

  readonly #input;

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input = new AttributeInput('data-name', new StaticCollection([targetApp.drawing]), targetApp.drawing);

    this.#input.domNode.style.width = '132px';

    this.#field = new TextInputField('Name', this.#input.domNode);

    this.#field.domNode.style.alignSelf = 'start';

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    this.#input.refresh();
  }
}
