import type { App } from './App';

import { AttributeInput } from './AttributeInput';

import { TextInputField } from './TextInputField';

export class NumberingsFontStyleField {
  readonly #targetApp;

  readonly #input;

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedNumberings = targetApp.selectedNumberings;

    let parentDrawing = targetApp.drawing;

    this.#input = new AttributeInput('font-style', selectedNumberings, parentDrawing);

    this.#input.onBeforeEdit = () => {
      targetApp.pushUndoStack();
    };

    this.#input.onEdit = () => {
      // reposition each numbering (after editing font style)
      [...selectedNumberings].forEach(n => {
        n.displacement.magnitude += 1;
        n.displacement.magnitude -= 1;
      });
    };

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
