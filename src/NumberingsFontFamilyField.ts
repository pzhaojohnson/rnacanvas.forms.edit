import type { App } from './App';

import { AttributeInput } from './AttributeInput';

import { TextInputField } from './TextInputField';

export class NumberingsFontFamilyField {
  readonly #targetApp;

  readonly #input;

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedNumberings = targetApp.selectedNumberings;

    let parentDrawing = targetApp.drawing;

    this.#input = new AttributeInput('font-family', selectedNumberings, parentDrawing);

    this.#input.onBeforeEdit = () => {
      targetApp.pushUndoStack();
    }

    this.#input.onEdit = () => {
      [...selectedNumberings].forEach(n => {
        // effectively reposition each numbering (after changing font family)
        n.displacement.magnitude += 1;
        n.displacement.magnitude -= 1;
      });
    };

    this.#field = new TextInputField('Font Family', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/font-family';

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
