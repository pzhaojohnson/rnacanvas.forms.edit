import type { App } from './App';

import { AttributeInput } from './AttributeInput';

import { TextInputField } from './TextInputField';

export class SecondaryBondsBasePadding1Field {
  readonly #targetApp;

  readonly #input;

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedSecondaryBonds = targetApp.selectedSecondaryBonds;

    let parentDrawing = targetApp.drawing;

    this.#input = new AttributeInput('data-base-padding1', selectedSecondaryBonds, parentDrawing);

    this.#input.onBeforeEdit = () => targetApp.pushUndoStack();

    this.#input.onEdit = () => {
      [...selectedSecondaryBonds].forEach(sb => {
        let basePadding1 = sb.basePadding1;

        // effectively reposition the secondary bond
        // (secondary bonds might not reposition themselves after directly editing data attributes)
        sb.basePadding1 += 1;

        // reset to original value
        sb.basePadding1 = basePadding1;
      });
    };

    this.#field = new TextInputField('Base Padding 1', this.#input.domNode);

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
