import { Field } from './Field';

export class TextInputField {
  #field;

  constructor(readonly name: string, inputElement: HTMLInputElement) {
    this.#field = new Field(name, inputElement);

    this.domNode.style.cursor = 'text';
  }

  get domNode() {
    return this.#field.domNode;
  }

  /**
   * A URL with information about what the field controls.
   */
  get infoLink() {
    return this.#field.infoLink;
  }

  set infoLink(infoLink) {
    this.#field.infoLink = infoLink;
  }
}
