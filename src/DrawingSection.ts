import type { App } from './App';

import * as styles from './DrawingSection.module.css';

import { SectionToggle } from './SectionToggle';

import { DrawingNameField } from './DrawingNameField';

export class DrawingSection {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #toggle = new SectionToggle('Drawing', () => this.toggle());

  readonly #contentContainer = document.createElement('div');

  readonly #nameField;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['drawing-section']);

    this.domNode.append(this.#toggle.domNode);

    this.#contentContainer.classList.add(styles['content-container']);
    this.domNode.append(this.#contentContainer);

    this.#nameField = new DrawingNameField(targetApp);
    this.#contentContainer.append(this.#nameField.domNode);

    this.refresh();

    // collapse by default
    this.collapse();
  }

  toggle(): void {
    this.isCollapsed() ? this.expand() : this.collapse();
  }

  isCollapsed(): boolean {
    return this.domNode.classList.contains(styles['collapsed']);
  }

  collapse(): void {
    this.domNode.classList.add(styles['collapsed']);

    this.#toggle.caret.pointRight();
  }

  expand(): void {
    this.domNode.classList.remove(styles['collapsed']);

    this.#toggle.caret.pointDown();
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
