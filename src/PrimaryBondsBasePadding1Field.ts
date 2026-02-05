import type { App } from './App';

import { AttributeInput } from './AttributeInput';

import { TextInputField } from './TextInputField';

export class PrimaryBondsBasePadding1Field {
  readonly #targetApp;

  readonly #input;

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedPrimaryBonds = targetApp.selectedPrimaryBonds;

    let parentDrawing = targetApp.drawing;

    this.#input = new AttributeInput('data-base-padding1', selectedPrimaryBonds, parentDrawing);

    this.#input.onBeforeEdit = () => targetApp.pushUndoStack();

    this.#input.onEdit = () => {
      [...selectedPrimaryBonds].forEach(pb => {
        let basePadding1 = pb.basePadding1;

        // effectively reposition the primary bond
        // (primary bonds might not reposition themselves after direcly editing data attributes)
        pb.basePadding1 += 1;

        // reset to original value
        pb.basePadding1 = basePadding1;
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
