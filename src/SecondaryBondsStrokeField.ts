import type { App } from './App';

import { AttributeInput } from './AttributeInput';

import { TextInputField } from './TextInputField';

export class SecondaryBondsStrokeField {
  readonly #targetApp;

  readonly #input;

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedSecondaryBonds = targetApp.selectedSecondaryBonds;

    let parentDrawing = targetApp.drawing;

    this.#input = new AttributeInput('stroke', selectedSecondaryBonds, parentDrawing);

    this.#input.onBeforeEdit = () => targetApp.pushUndoStack();

    this.#field = new TextInputField('Stroke', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke';

    this.domNode.style.marginTop = '22px';
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
