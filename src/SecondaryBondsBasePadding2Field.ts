import type { App } from './App';

import { AttributeInput } from './AttributeInput';

import { TextInputField } from './TextInputField';

export class SecondaryBondsBasePadding2Field {
  readonly #targetApp;

  readonly #input;

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedSecondaryBonds = targetApp.selectedSecondaryBonds;

    let parentDrawing = targetApp.drawing;

    this.#input = new AttributeInput('data-base-padding2', selectedSecondaryBonds, parentDrawing);

    this.#input.onBeforeEdit = () => targetApp.pushUndoStack();

    this.#input.onEdit = () => {
      [...selectedSecondaryBonds].forEach(sb => {
        let basePadding2 = sb.basePadding2;

        // effectively reposition the secondary bond
        // (secondary bonds might not reposition themselves after directly editing data attributes)
        sb.basePadding2 += 1;

        // reset to original value
        sb.basePadding2 = basePadding2;
      });
    };

    this.#field = new TextInputField('Base Padding 2', this.#input.domNode);

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
