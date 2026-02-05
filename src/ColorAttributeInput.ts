import type { App } from './App';

import type { DrawingElement } from './DrawingElement';

import type { LiveCollection } from './LiveCollection';

import { ColorInput } from './ColorInput';

import { Color } from '@svgdotjs/svg.js';

import { consensusValue } from '@rnacanvas/consensize';

import * as _ from 'lodash';

export class ColorAttributeInput {
  /**
   * In kebab case.
   */
  readonly #attributeName;

  readonly #targetElements;

  readonly #parentDrawing;

  /**
   * Invoked immediately after editing the color attribute of the target elements.
   */
  onEdit?: () => void;

  /**
   * Invoked immediately before editing the color attribute of the target elements.
   */
  onBeforeEdit?: () => void;

  readonly #input = new ColorInput();

  /**
   * The value of the color input when last focused.
   */
  #lastFocusValue?: string;

  constructor(attributeName: string, targetElements: LiveCollection<DrawingElement>, parentDrawing: Drawing) {
    this.#attributeName = attributeName;

    this.#targetElements = targetElements;

    this.#parentDrawing = parentDrawing;

    this.#input.domNode.addEventListener('input', () => {
      this.#handleInput();
    });

    this.#input.domNode.addEventListener('focus', () => {
      this.#lastFocusValue = this.#input.domNode.value;
    });

    // only refresh when necessary
    targetElements.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when necessary
    let drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // watch for any changes to the attribute
    drawingObserver.observe(parentDrawing.domNode, { attributes: true, attributeFilter: [attributeName], subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#input.domNode;
  }

  #handleInput(): void {
    // in Firefox an input event is fired when opening a color input
    if (this.#input.domNode.value === this.#lastFocusValue) {
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

    this.onBeforeEdit ? this.onBeforeEdit() : {};

    targetElements.forEach(ele => ele.domNode.setAttribute(this.#attributeName, this.#input.domNode.value.toLowerCase()));

    this.onEdit ? this.onEdit() : {};
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
}

type Drawing = App['drawing'];
