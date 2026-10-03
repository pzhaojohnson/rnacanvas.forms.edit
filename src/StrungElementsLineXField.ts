import type { App } from './App';

import { TextInput } from './TextInput';

import { TextInputField } from './TextInputField';

import { isFiniteNumber } from '@rnacanvas/value-check';

import { consensusValue } from '@rnacanvas/consensize';

export class StrungElementsLineXField {
  readonly #targetApp;

  readonly #input = new TextInput({ onSubmit: () => this.#submit() });

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#field = new TextInputField('Line X', this.#input.domNode);

    this.domNode.style.marginTop = '24px';
    this.domNode.style.alignSelf = 'start';

    // only refresh when necessary
    targetApp.selectedStrungElements.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when necessary
    let drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // the line X coordinate of a strung element should be stored in the `data-line-x` attribute of its DOM node
    drawingObserver.observe(targetApp.drawing.domNode, { attributes: true, attributeFilter: ['data-line-x'], subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  #submit() {
    let value = Number.parseFloat(this.#input.domNode.value);

    // ignore inputs that are not finite numbers
    if (!isFiniteNumber(value)) {
      this.refresh();
      return;
    }

    let selectedStrungElements = this.#targetApp.selectedStrungElements.toArray();

    if (selectedStrungElements.length == 0) {
      this.refresh();
      return;
    }

    if (selectedStrungElements.every(ele => ele.lineX === value)) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedStrungElements.forEach(ele => ele.lineX = value);

    this.refresh();
  }

  refresh(): void {
    let selectedStrungElements = this.#targetApp.selectedStrungElements.toArray();

    try {
      this.#input.domNode.value = `${consensusValue(selectedStrungElements.map(ele => ele.lineX))}`;
    } catch {
      this.#input.domNode.value = '';
    }
  }
}
