import type { App } from './App';

import { ColorAttributeInput } from './ColorAttributeInput';

import { ColorField } from './ColorField';

export class BasesFillColorField {
  readonly #targetApp;

  readonly #input;

  readonly #field;

  /**
   * Used to help decide whether to push the undo stack or not.
   */
  #previousState: unknown = {};

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedBases = targetApp.selectedBases;

    let parentDrawing = targetApp.drawing;

    this.#input = new ColorAttributeInput('fill', selectedBases, parentDrawing);

    this.#input.onBeforeEdit = () => {
      if (targetApp.undoStack.isEmpty() || targetApp.undoStack.peek() !== this.#previousState) {
        targetApp.pushUndoStack();

        this.#previousState = targetApp.undoStack.peek();
      }
    };

    selectedBases.addEventListener('change', () => {
      this.#previousState = {};
    });

    this.#field = new ColorField('Fill Color', this.#input.domNode);

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
