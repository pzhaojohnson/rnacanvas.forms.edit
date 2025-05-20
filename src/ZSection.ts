import type { App } from './App';

import * as styles from './ZSection.module.css';

import { TextButton } from './TextButton';

import { bringToFront, sendToBack } from '@rnacanvas/draw.svg';

export class ZSection {
  #targetElements;

  #parentApp;

  readonly domNode = document.createElement('div');

  #label = document.createElement('p');

  readonly buttons = {
    'Front': new TextButton('Front', () => this.#bringToFront()),
    'Back': new TextButton('Back', () => this.#sendToBack()),
  };

  constructor(targetElements: LiveSet<DrawingElement>, parentApp: App) {
    this.#targetElements = targetElements;

    this.#parentApp = parentApp;

    this.domNode.classList.add(styles['z-section']);

    this.#label.classList.add(styles['label']);
    this.#label.textContent = 'Send to:';
    this.domNode.append(this.#label);

    this.buttons['Front'].domNode.style.marginLeft = '24px';
    this.domNode.append(this.buttons['Front'].domNode);

    this.buttons['Back'].domNode.style.marginLeft = '28px';
    this.domNode.append(this.buttons['Back'].domNode);

    // only refresh when necessary
    targetElements.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    this.refresh();
  }

  #bringToFront(): void {
    let targetElements = [...this.#targetElements];

    if (targetElements.length == 0) {
      this.refresh();
      return;
    }

    this.#parentApp.pushUndoStack();

    targetElements.forEach(ele => bringToFront(ele.domNode));

    this.refresh();
  }

  #sendToBack(): void {
    let targetElements = [...this.#targetElements];

    if (targetElements.length == 0) {
      this.refresh();
      return;
    }

    this.#parentApp.pushUndoStack();

    targetElements.forEach(ele => sendToBack(ele.domNode));

    this.refresh();
  }

  refresh(): void {
    let targetElements = [...this.#targetElements];

    targetElements.length == 0 ? this.buttons['Front'].disable() : this.buttons['Front'].enable();

    targetElements.length == 0 ? this.buttons['Back'].disable() : this.buttons['Back'].enable();

    this.#callEventListeners('refresh');
  }

  #eventListeners: EventListeners = {
    'refresh': [],
  };

  addEventListener(name: 'refresh', listener: () => void): void {
    this.#eventListeners[name].push(listener);
  }

  removeEventListener(name: 'refresh', listener: () => void): void {
    this.#eventListeners[name] = this.#eventListeners[name].filter(li => li !== listener);
  }

  #callEventListeners(name: 'refresh'): void {
    this.#eventListeners[name].forEach(listener => listener());
  }
}

interface LiveSet<T> {
  [Symbol.iterator](): Iterator<T>;

  /**
   * Listeners are called whenever the collection of items in the set changes.
   */
  addEventListener(name: 'change', listener: () => void): void;
}

interface DrawingElement {
  readonly domNode: SVGGraphicsElement;
}

type EventListeners = {
  'refresh': (() => void)[],
};
