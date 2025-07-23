import type { App } from './App';

import * as styles from './DrawingSection.module.css';

import { SectionHeader } from './SectionHeader';

import { AttributeInput } from './AttributeInput';

import { TextInputField } from './TextInputField';

export class DrawingSection {
  #targetApp;

  readonly domNode = document.createElement('div');

  #header = new SectionHeader('Drawing', () => this.toggle());

  #content = document.createElement('div');

  #nameField;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['drawing-section']);

    this.domNode.append(this.#header.domNode);

    this.#content.classList.add(styles['content']);
    this.domNode.append(this.#content);

    this.#nameField = new NameField(targetApp);
    this.#content.append(this.#nameField.domNode);

    this.collapse();

    this.refresh();
  }

  isCollapsed(): boolean {
    return this.domNode.classList.contains(styles['collapsed']);
  }

  collapse(): void {
    this.domNode.classList.add(styles['collapsed']);
    this.#header.caret.pointRight();
  }

  expand(): void {
    this.domNode.classList.remove(styles['collapsed']);
    this.#header.caret.pointDown();
  }

  toggle(): void {
    this.isCollapsed() ? this.expand() : this.collapse();
  }

  refresh(): void {
    this.#refreshableComponents.forEach(component => component.refresh());
  }

  get #refreshableComponents() {
    return [
      this.#nameField,
    ];
  }
}

class NameField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input = new AttributeInput('data-name', new StaticSet([targetApp.drawing]), targetApp);

    this.#field = new TextInputField('Name', this.#input.domNode);

    this.domNode.style.alignSelf = 'start';
    this.#input.domNode.style.width = '131px';

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    this.#input.refresh();
  }
}

/**
 * A set whose items never change.
 */
class StaticSet<T> {
  #items;

  constructor(items: T[]) {
    this.#items = [...items];
  }

  [Symbol.iterator]() {
    return this.#items.values();
  }

  addEventListener(name: 'change', listener: () => void) {
    // nothing to do
  }
}
