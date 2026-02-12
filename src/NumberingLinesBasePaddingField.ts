import type { App } from './App';

import { AttributeInput } from './AttributeInput';

import { TextInputField } from './TextInputField';

export class NumberingLinesBasePaddingField {
  readonly #targetApp;

  readonly #input;

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedNumberingLines = targetApp.selectedNumberingLines;

    let parentDrawing = targetApp.drawing;

    this.#input = new AttributeInput('data-base-padding', selectedNumberingLines, parentDrawing);

    this.#input.onBeforeEdit = () => targetApp.pushUndoStack();

    this.#input.onEdit = () => {
      [...selectedNumberingLines].forEach(line => {
        let basePadding = line.basePadding;

        // reposition the numbering line
        // (numbering lines might not reposition themselves automatically after data attributes are directly edited)
        line.basePadding += 1;
        line.basePadding = basePadding;
      });
    };

    this.#field = new TextInputField('Base Padding', this.#input.domNode);

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
