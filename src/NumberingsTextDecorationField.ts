import type { App } from './App';

import { AttributeInput } from './AttributeInput';

import { TextInputField } from './TextInputField';

export class NumberingsTextDecorationField {
  readonly #targetApp;

  readonly #input;

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedNumberings = targetApp.selectedNumberings;

    let parentDrawing = targetApp.drawing;

    this.#input = new AttributeInput('text-decoration', selectedNumberings, parentDrawing);

    this.#input.onBeforeEdit = () => {
      targetApp.pushUndoStack();
    };

    this.#input.onEdit = () => {
      // reposition each numbering (after editing text decoration)
      [...selectedNumberings].forEach(n => {
        n.displacement.magnitude += 1;
        n.displacement.magnitude -= 1;
      });
    };

    this.#field = new TextInputField('Text Decoration', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/text-decoration';

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
