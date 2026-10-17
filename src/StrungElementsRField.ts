import type { App } from './App';

import { AttributeInput } from './AttributeInput';

import { TextInputField } from './TextInputField';

export class StrungElementsRField {
  readonly #input;

  readonly #field;

  constructor(targetApp: App) {
    let selectedStrungElements = targetApp.selectedStrungElements;

    // the `r` attribute only applies to strung circles
    let selectedStrungCircles = {
      [Symbol.iterator]: () => selectedStrungElements.toArray().filter(ele => ele.domNode.localName == 'circle')[Symbol.iterator](),

      toArray: () => selectedStrungElements.toArray().filter(ele => ele.domNode.localName == 'circle'),

      addEventListener: (name: 'change', listener: () => void) => selectedStrungElements.addEventListener(name, listener),
    };

    let parentDrawing = targetApp.drawing;

    this.#input = new AttributeInput('r', selectedStrungCircles, parentDrawing);

    this.#input.onBeforeEdit = () => targetApp.pushUndoStack();

    this.#field = new TextInputField('Radius', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/r';

    this.domNode.style.marginTop = '24px';
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
