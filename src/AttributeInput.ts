import type { App } from './App';

import { TextInput } from './TextInput';

import { consensusValue } from '@rnacanvas/consensize';

export class AttributeInput {
  #attributeName;

  #targetElements;

  #parentApp;

  #input = new TextInput({ onSubmit: () => this.#submit() });

  constructor(attributeName: string, targetElements: LiveSet<DrawingElement>, parentApp: App) {
    this.#attributeName = attributeName;

    this.#targetElements = targetElements

    this.#parentApp = parentApp;

    // only refresh when necessary
    targetElements.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when necessary
    let drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    drawingObserver.observe(parentApp.drawing.domNode, { attributes: true, attributeFilter: [attributeName], subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#input.domNode;
  }

  refresh(): void {
    try {
      this.#input.domNode.value = consensusValue([...this.#targetElements].map(ele => ele.domNode.getAttribute(this.#attributeName) ?? ''));
    } catch {
      this.#input.domNode.value = '';
    }
  }

  #submit() {
    let value = this.#input.domNode.value;

    let targetElements = [...this.#targetElements];

    if (targetElements.length == 0 || targetElements.every(sb => sb.domNode.getAttribute(this.#attributeName) === value)) {
      this.refresh();
      return;
    }

    this.#parentApp.pushUndoStack();

    targetElements.forEach(ele => ele.domNode.setAttribute(this.#attributeName, value));
  }
}

interface LiveSet<T> {
  [Symbol.iterator](): Iterator<T>;

  /**
   * Listeners are called whenever the collection of items in the set changes.
   */
  addEventListener(name: 'change', listener: () => void): void;
}

interface DrawingElement {
  readonly domNode: SVGGraphicsElement;
}
