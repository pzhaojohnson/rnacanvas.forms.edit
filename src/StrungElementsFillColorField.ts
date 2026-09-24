import type { App } from './App';

import { ColorAttributeInput } from './ColorAttributeInput';

import { ColorField } from './ColorField';

export class StrungElementsFillColorField {
  readonly #input;

  readonly #field;

  #previousState: unknown = {};

  constructor(targetApp: App) {
    this.#input = new ColorAttributeInput('fill', targetApp.selectedStrungElements, targetApp.drawing);

    this.#input.onBeforeEdit = () => {
      if (targetApp.undoStack.isEmpty() || targetApp.undoStack.peek() !== this.#previousState) {
        targetApp.pushUndoStack();

        this.#previousState = targetApp.undoStack.peek();
      }
    };

    targetApp.selectedStrungElements.addEventListener('change', () => {
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