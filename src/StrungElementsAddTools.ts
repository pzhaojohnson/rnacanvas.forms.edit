import type { App } from './App';

import * as styles from './StrungElementsAddTools.module.css';

import { LightSolidButton } from './LightSolidButton';

import { Tooltip } from '@rnacanvas/tooltips';

export class StrungElementsAddTools {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #buttons = {
    'text': new LightSolidButton('Text'),
    'circle': CircleButton(),
    'rectangle': RectangleButton(),
    'triangle': TriangleButton(),
  };

  constructor(targetApp: App) {
    this.#targetApp = new AppWrapper(targetApp);

    this.domNode.classList.add(styles['strung-elements-add-tools']);

    this.domNode.append(Label());

    this.#buttons['text'].onClick = () => this.#add('text');
    this.#buttons['circle'].domNode.addEventListener('click', () => this.#add('circle'));
    this.#buttons['rectangle'].domNode.addEventListener('click', () => this.#add('rectangle'));
    this.#buttons['triangle'].domNode.addEventListener('click', () => this.#add('triangle'));

    this.domNode.append(
      this.#buttons['text'].domNode,
      this.#buttons['circle'].domNode,
      this.#buttons['rectangle'].domNode,
      this.#buttons['triangle'].domNode,
    );

    targetApp.selectedPrimaryBonds.addEventListener('change', () => this.refresh());
    targetApp.selectedSecondaryBonds.addEventListener('change', () => this.refresh());
    targetApp.selectedTertiaryBonds.addEventListener('change', () => this.refresh());

    this.refresh();
  }

  refresh(): void {
    let selectedBonds = this.#targetApp.selectedBonds;

    selectedBonds.size == 0 ? this.domNode.classList.add(styles['disabled']) : this.domNode.classList.remove(styles['disabled']);

    selectedBonds.size == 0 ? this.#buttons['text'].disable() : this.#buttons['text'].enable();

    if (selectedBonds.size == 0) {
      Object.values(this.#buttons).forEach(button => button.tooltip.textContent = 'No bonds are selected.');
    } else {
      ([
        ['text', 'String text elements on the selected bonds.'],
        ['circle', 'String circle elements on the selected bonds.'],
        ['rectangle', 'String rectangle elements on the selected bonds.'],
        ['triangle', 'String triangle elements on the selected bonds.'],
      ] as const)
        .forEach(([name, textContent]) => this.#buttons[name].tooltip.textContent = textContent);
    }
  }

  #add(type: 'text' | 'circle' | 'rectangle' | 'triangle'): void {
    let selectedBonds = this.#targetApp.selectedBonds;

    if (selectedBonds.size == 0) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedBonds.forEach(bond => this.#targetApp.drawing.addStrungElement(type, bond));
  }
}

function Label() {
  let label = document.createElement('p');

  label.classList.add(styles['label']);

  label.textContent = 'Add:';

  return label;
}

function CircleButton() {
  let circleIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  circleIcon.setAttribute('width', '16');
  circleIcon.setAttribute('height', '16');

  circleIcon.setAttribute('viewBox', '0 0 16 16');

  circleIcon.setAttribute('aria-label', 'Circle');

  circleIcon.innerHTML = `
    <circle
      r="5.5" cx="8" cy="8"
      stroke="cyan" stroke-width="1.5" fill="none"
    />
  `;

  let domNode = document.createElement('a');

  domNode.classList.add(styles['icon-button']);

  domNode.append(circleIcon);

  let tooltip = new Tooltip();

  tooltip.owner = domNode;

  return { domNode, tooltip };
}

function RectangleButton() {
  let rectangleIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  rectangleIcon.setAttribute('width', '16');
  rectangleIcon.setAttribute('height', '16');

  rectangleIcon.setAttribute('viewBox', '0 0 16 16');

  rectangleIcon.setAttribute('aria-label', 'Rectangle');

  rectangleIcon.innerHTML = `
    <rect
      x="2.5" y="2.5" width="11" height="11"
      stroke="cyan" stroke-width="1.5" fill="none"
    />
  `;

  let domNode = document.createElement('a');

  domNode.classList.add(styles['icon-button']);

  domNode.append(rectangleIcon);

  let tooltip = new Tooltip();

  tooltip.owner = domNode;

  return { domNode, tooltip };
}

function TriangleButton() {
  let triangleIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  triangleIcon.setAttribute('width', '16');
  triangleIcon.setAttribute('height', '16');

  triangleIcon.setAttribute('viewBox', '0 0 16 16');

  triangleIcon.setAttribute('aria-label', 'Triangle');

  triangleIcon.innerHTML = `
    <polygon
      points="8,2 14,13 2,13"
      stroke="cyan" stroke-width="1.5" fill="none"
    />
  `;

  let domNode = document.createElement('a');

  domNode.classList.add(styles['icon-button']);

  domNode.append(triangleIcon);

  let tooltip = new Tooltip();

  tooltip.owner = domNode;

  return { domNode, tooltip };
}

class AppWrapper {
  readonly #targetApp;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;
  }

  get drawing() {
    return this.#targetApp.drawing;
  }

  get selectedBonds() {
    return new Set([
      ...this.#targetApp.selectedPrimaryBonds,
      ...this.#targetApp.selectedSecondaryBonds,
      ...this.#targetApp.selectedTertiaryBonds,
    ]);
  }

  get selectedPrimaryBonds() {
    return this.#targetApp.selectedPrimaryBonds;
  }

  get selectedSecondaryBonds() {
    return this.#targetApp.selectedSecondaryBonds;
  }

  get selectedTertiaryBonds() {
    return this.#targetApp.selectedTertiaryBonds;
  }

  pushUndoStack() {
    this.#targetApp.pushUndoStack();
  }
}
