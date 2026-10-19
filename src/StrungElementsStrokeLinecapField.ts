import type { App } from './App';

import { AttributeInput } from './AttributeInput';

import { TextInputField } from './TextInputField';

export class StrungElementsStrokeLinecapField {
  readonly #input;

  readonly #field;

  constructor(targetApp: App) {
    let selectedStrungElements = targetApp.selectedStrungElements;

    // stroke does not apply to strung text elements
    let targetElements = {
      [Symbol.iterator]: () => selectedStrungElements.toArray().filter(ele => ele.domNode.localName != 'text')[Symbol.iterator](),

      toArray: () => selectedStrungElements.toArray().filter(ele => ele.domNode.localName != 'text'),

      addEventListener: (name: 'change', listener: () => void) => selectedStrungElements.addEventListener(name, listener),
    };

    this.#input = new AttributeInput('stroke-linecap', targetElements, targetApp.drawing);

    this.#input.onBeforeEdit = () => targetApp.pushUndoStack();

    this.#field = new TextInputField('Stroke Line-Cap', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke-linecap';

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
