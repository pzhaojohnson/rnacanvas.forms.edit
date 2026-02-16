import type { App } from './App';

import { ColorAttributeInput } from './ColorAttributeInput';

import { ColorField } from './ColorField';

export class PrimaryBondsStrokeColorField {
  readonly #targetApp;

  readonly #input;

  readonly #field;

  /**
   * Used to help decide whether to push the undo stack or not.
   */
  #previousState: unknown = {};

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedPrimaryBonds = targetApp.selectedPrimaryBonds;

    let parentDrawing = targetApp.drawing;

    this.#input = new ColorAttributeInput('stroke', selectedPrimaryBonds, parentDrawing);

    this.#input.onBeforeEdit = () => {
      if (targetApp.undoStack.isEmpty() || targetApp.undoStack.peek() !== this.#previousState) {
        targetApp.pushUndoStack();

        this.#previousState = targetApp.undoStack.peek();
      }
    };

    selectedPrimaryBonds.addEventListener('change', () => {
      this.#previousState = {};
    });

    this.#field = new ColorField('Stroke Color', this.#input.domNode);

    this.#field.domNode.style.marginTop = '12px';
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
