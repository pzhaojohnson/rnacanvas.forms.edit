import type { App } from './App';

import { ColorInput } from './ColorInput';

import { Color } from '@svgdotjs/svg.js';

import { consensusValue } from '@rnacanvas/consensize';

import * as _ from 'lodash';

export class ColorAttributeInput {
  /**
   * In kebab case.
   */
  #attributeName;

  #targetElements;

  #parentApp;

  #input = new ColorInput();

  /**
   * Used to determine whether to push the undo stack or not.
   */
  #previousState: unknown;

  /**
   * The value of the color input when last focused.
   */
  #lastFocusValue?: string;

  constructor(attributeName: string, targetElements: LiveSet<DrawingElement>, parentApp: App) {
    this.#attributeName = attributeName;

    this.#targetElements = targetElements;

    this.#parentApp = parentApp;

    this.#input.domNode.addEventListener('input', () => this.#handleInput());

    targetElements.addEventListener('change', () => this.#previousState = undefined);

    this.#input.domNode.addEventListener('focus', () => this.#lastFocusValue = this.#input.domNode.value);

    // only refresh if necessary
    targetElements.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh if necessary
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
    let targetElements = [...this.#targetElements];

    if (targetElements.length == 0) {
      this.#input.domNode.value = '#000000';
      return;
    }

    try {
      // convert to camel case
      let attributeName = _.camelCase(this.#attributeName);

      // this line of code assumes that `window.getComputedStyle()` returns a color value in RGB format
      let attributeValues = targetElements.map(ele => window.getComputedStyle(ele.domNode)[attributeName as any]);

      // note that the `Color` class cannot handle keyword colors (e.g., "red", "magenta", "azure")
      let colors = attributeValues.map(value => new Color(value));

      this.#input.domNode.value = consensusValue(colors.map(c => c.toHex().toLowerCase()));
    } catch {
      this.#input.domNode.value = '#000000';
    }
  }

  #handleInput(): void {
    if (this.#input.domNode.value === this.#lastFocusValue) {
      // in Firefox an input event is fired when opening a color input
      return;
    }

    let targetElements = [...this.#targetElements];

    if (targetElements.length == 0) {
      this.refresh();
      return;
    }

    if (targetElements.every(ele => ele.domNode.getAttribute(this.#attributeName)?.toLowerCase() === this.#input.domNode.value.toLowerCase())) {
      this.refresh();
      return;
    }

    if (this.#parentApp.undoStack.isEmpty() || this.#parentApp.undoStack.peek() !== this.#previousState) {
      this.#parentApp.pushUndoStack();

      this.#previousState = this.#parentApp.undoStack.peek();
    }

    targetElements.forEach(ele => ele.domNode.setAttribute(this.#attributeName, this.#input.domNode.value.toLowerCase()));
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
