import type { App } from './App';

import type { DrawingElement } from './DrawingElement';

import type { LiveCollection } from './LiveCollection';

import { TextInput } from './TextInput';

import { consensusValue } from '@rnacanvas/consensize';

export class AttributeInput {
  readonly #attributeName;

  readonly #targetElements;

  readonly #parentDrawing;

  readonly #input = new TextInput({ onSubmit: () => this.#submit() });

  /**
   * Called immediately after editing the target elements.
   */
  onEdit?: () => void;

  /**
   * Called immediately before editing the target elements.
   */
  onBeforeEdit?: () => void;

  constructor(attributeName: string, targetElements: LiveCollection<DrawingElement>, parentDrawing: Drawing) {
    this.#attributeName = attributeName;

    this.#targetElements = targetElements

    this.#parentDrawing = parentDrawing;

    // only refresh when necessary
    targetElements.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when necessary
    let drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // watch for any changes to the target attribute
    drawingObserver.observe(parentDrawing.domNode, { attributes: true, attributeFilter: [attributeName], subtree: true });

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

    if (targetElements.length == 0) {
      this.refresh();

      return;
    }

    if (targetElements.every(ele => ele.domNode.getAttribute(this.#attributeName) === value)) {
      this.refresh();

      return;
    }

    this.onBeforeEdit ? this.onBeforeEdit() : {};

    targetElements.forEach(ele => ele.domNode.setAttribute(this.#attributeName, value));

    this.onEdit ? this.onEdit() : {};
  }
}

type Drawing = App['drawing'];
