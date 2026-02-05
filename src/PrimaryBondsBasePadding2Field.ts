import type { App } from './App';

import { AttributeInput } from './AttributeInput';

import { TextInputField } from './TextInputField';

export class PrimaryBondsBasePadding2Field {
  readonly #targetApp;

  readonly #input;

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedPrimaryBonds = targetApp.selectedPrimaryBonds;

    let parentDrawing = targetApp.drawing;

    this.#input = new AttributeInput('data-base-padding2', selectedPrimaryBonds, parentDrawing);

    this.#input.onBeforeEdit = () => targetApp.pushUndoStack();

    this.#input.onEdit = () => {
      [...selectedPrimaryBonds].forEach(pb => {
        let basePadding2 = pb.basePadding2;

        // effectively reposition the primary bond
        // (primary bonds might not reposition themselves after directly editing data attributes)
        pb.basePadding2 += 1;

        // reset to original value
        pb.basePadding2 = basePadding2;
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
