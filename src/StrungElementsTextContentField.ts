import type { App } from './App';

import { TextInput } from './TextInput';

import { TextInputField } from './TextInputField';

import { consensusValue } from '@rnacanvas/consensize';

export class StrungElementsTextContentField {
  readonly #targetApp;

  readonly #input = new TextInput({ onSubmit: () => this.#submit() });

  readonly #field = new TextInputField('Text Content', this.#input.domNode);

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent';

    this.domNode.style.marginTop = '23px';
    this.domNode.style.alignSelf = 'start';

    targetApp.selectedStrungElements.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    let drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // must also observe child list (to watch for text content changes)
    drawingObserver.observe(targetApp.drawing.domNode, { childList: true, characterData: true, subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    let selectedStrungTexts = this.#targetApp.selectedStrungElements.toArray().filter(ele => ele.domNode instanceof SVGTextElement);

    try {
      this.#input.domNode.value = consensusValue(selectedStrungTexts.map(ele => ele.domNode.textContent));
    } catch {
      this.#input.domNode.value = '';
    }
  }

  #submit(): void {
    let textContent = this.#input.domNode.value.trim();

    let selectedStrungTexts = this.#targetApp.selectedStrungElements.toArray().filter(ele => ele.domNode instanceof SVGTextElement);

    if (
      !textContent
      || selectedStrungTexts.length == 0
      || selectedStrungTexts.every(ele => ele.domNode.textContent === textContent)
    ) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedStrungTexts.forEach(ele => ele.domNode.textContent = textContent);

    this.refresh();
  }
}
