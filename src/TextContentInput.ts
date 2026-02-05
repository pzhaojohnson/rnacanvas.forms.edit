import type { App } from './App';

import type { DrawingElement } from './DrawingElement';

import type { LiveCollection } from './LiveCollection';

import { TextInput } from './TextInput';

import { consensusValue } from '@rnacanvas/consensize';

export class TextContentInput {
  readonly #targetElements;

  readonly #parentDrawing;

  readonly #drawingObserver;

  /**
   * To be invoked immediately after editing the text contents of the target elements.
   */
  onEdit?: () => void;

  /**
   * To be invoked immediately before editing the text contents of the target elements.
   */
  onBeforeEdit?: () => void;

  readonly #input = new TextInput({
    onSubmit: () => this.#submit(),
  });

  constructor(targetElements: LiveCollection<DrawingElement>, parentDrawing: Drawing) {
    this.#targetElements = targetElements;

    this.#parentDrawing = parentDrawing;

    // only refresh when necessary
    targetElements.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when necessary
    this.#drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // watch for any changes to text content
    this.#drawingObserver.observe(parentDrawing.domNode, { characterData: true, subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#input.domNode;
  }

  #submit() {
    let value = this.#input.domNode.value;

    // trim leading and trailing whitespace by default
    value = value.trim();

    // don't usually want to assign invisible text content to elements
    if (!value) {
      this.refresh();

      return;
    }

    let targetElements = [...this.#targetElements];

    if (targetElements.length == 0) {
      this.refresh();

      return;
    }

    if (targetElements.every(ele => ele.domNode.textContent === value)) {
      this.refresh();

      // all target elements already have the input text content
      return;
    }

    this.onBeforeEdit ? this.onBeforeEdit() : {};

    targetElements.forEach(ele => ele.domNode.textContent = value);

    this.onEdit ? this.onEdit() : {};

    this.refresh();
  }

  refresh(): void {
    let targetElements = [...this.#targetElements];

    try {
      this.#input.domNode.value = consensusValue(targetElements.map(ele => ele.domNode.textContent));
    } catch {
      this.#input.domNode.value = '';
    }
  }
}

type Drawing = App['drawing'];
