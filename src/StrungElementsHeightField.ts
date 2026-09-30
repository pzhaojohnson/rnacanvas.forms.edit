import type { App } from './App';

import { TextInput } from './TextInput';

import { TextInputField } from './TextInputField';

import { isFiniteNumber } from '@rnacanvas/value-check';

import { consensusValue } from '@rnacanvas/consensize';

export class StrungElementsHeightField {
  readonly #targetApp;

  readonly #input = new TextInput({ onSubmit: () => this.#submit() });

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#field = new TextInputField('Height', this.#input.domNode);

    this.domNode.style.marginTop = '10px';
    this.domNode.style.alignSelf = 'start';

    // only refresh when necessary
    targetApp.selectedStrungElements.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when necessary
    let drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // the height of a strung rectangle or triangle should be stored in the `data-height` attribute of its DOM node
    drawingObserver.observe(targetApp.drawing.domNode, { attributes: true, attributeFilter: ['data-height'], subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  /**
   * The currently selected strung elements that have a height property
   * (i.e., strung rectangles and strung triangles).
   */
  get #targetElements() {
    return this.#targetApp.selectedStrungElements.toArray().filter(ele => 'height' in ele);
  }

  #submit() {
    let value = Number.parseFloat(this.#input.domNode.value);

    // ignore inputs that are not finite numbers
    if (!isFiniteNumber(value)) {
      this.refresh();
      return;
    }

    let targetElements = this.#targetElements;

    if (targetElements.length == 0) {
      this.refresh();
      return;
    }

    if (targetElements.every(ele => ele.height === value)) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    targetElements.forEach(ele => ele.height = value);

    this.refresh();
  }

  refresh(): void {
    try {
      this.#input.domNode.value = `${consensusValue(this.#targetElements.map(ele => ele.height))}`;
    } catch {
      this.#input.domNode.value = '';
    }
  }
}
