import { Field } from './Field';

export class ColorField {
  #field;

  constructor(readonly name: string, colorInput: HTMLInputElement) {
    this.#field = new Field(name, colorInput);

    this.domNode.style.cursor = 'pointer';
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
