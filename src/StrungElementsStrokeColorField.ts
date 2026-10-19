import type { App } from './App';

import { ColorAttributeInput } from './ColorAttributeInput';

import { ColorField } from './ColorField';

export class StrungElementsStrokeColorField {
  readonly #input;

  readonly #field;

  #previousState: unknown = {};

  constructor(targetApp: App) {
    let selectedStrungElements = targetApp.selectedStrungElements;

    // stroke does not apply to strung text elements
    let targetElements = {
      [Symbol.iterator]: () => selectedStrungElements.toArray().filter(ele => ele.domNode.localName != 'text')[Symbol.iterator](),

      toArray: () => selectedStrungElements.toArray().filter(ele => ele.domNode.localName != 'text'),

      addEventListener: (name: 'change', listener: () => void) => selectedStrungElements.addEventListener(name, listener),
    };

    this.#input = new ColorAttributeInput('stroke', targetElements, targetApp.drawing);

    this.#input.onBeforeEdit = () => {
      if (targetApp.undoStack.isEmpty() || targetApp.undoStack.peek() !== this.#previousState) {
        targetApp.pushUndoStack();

        this.#previousState = targetApp.undoStack.peek();
      }
    };

    targetApp.selectedStrungElements.addEventListener('change', () => {
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