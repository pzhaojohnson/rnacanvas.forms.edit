import type { App } from './App';

import * as styles from './StrungElementsDisplacementSection.module.css';

import { TextInput } from './TextInput';

import { TextInputField } from './TextInputField';

import { isFiniteNumber } from '@rnacanvas/value-check';

import { consensusValue } from '@rnacanvas/consensize';

export class StrungElementsDisplacementSection {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #label = document.createElement('p');

  readonly #inputs = {
    'magnitude': new TextInput({ onSubmit: () => this.#submit('magnitude') }),
    'direction': new TextInput({ onSubmit: () => this.#submit('direction') }),
    'x': new TextInput({ onSubmit: () => this.#submit('x') }),
    'y': new TextInput({ onSubmit: () => this.#submit('y') }),
  } as const;

  readonly #fields;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['strung-elements-displacement-section']);

    this.#label.classList.add(styles['label']);
    this.#label.textContent = 'Displacement:';
    this.domNode.append(this.#label);

    this.#fields = {
      'magnitude': new TextInputField('Magnitude', this.#inputs['magnitude'].domNode),
      'direction': new TextInputField('Direction', this.#inputs['direction'].domNode),
      'x': new TextInputField('X', this.#inputs['x'].domNode),
      'y': new TextInputField('Y', this.#inputs['y'].domNode),
    };

    parameterNames.forEach(parameterName => {
      this.#fields[parameterName].domNode.style.marginTop = '10px';
      this.#fields[parameterName].domNode.style.marginLeft = '8px';
      this.#fields[parameterName].domNode.style.alignSelf = 'start';
    });

    this.#fields['magnitude'].domNode.style.marginTop = '0px';

    this.domNode.append(...parameterNames.map(parameterName => this.#fields[parameterName].domNode));

    // only refresh when necessary
    this.#targetApp.selectedStrungElements.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when necessary
    let drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // displacement X and Y are derived from displacement magnitude and direction
    let attributeFilter = ['data-displacement-magnitude', 'data-displacement-direction'];

    drawingObserver.observe(this.#targetApp.drawing.domNode, { attributes: true, attributeFilter, subtree: true });

    this.refresh();
  }

  #submit(parameterName: ParameterName) {
    let value = Number.parseFloat(this.#inputs[parameterName].domNode.value);

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

    if (selectedStrungElements.every(ele => ele[propertyNames[parameterName]] === value)) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedStrungElements.forEach(ele => ele[propertyNames[parameterName]] = value);

    this.refresh();
  }

  refresh(): void {
    let selectedStrungElements = this.#targetApp.selectedStrungElements.toArray();

    parameterNames.forEach(parameterName => {
      try {
        this.#inputs[parameterName].domNode.value = `${consensusValue(selectedStrungElements.map(ele => ele[propertyNames[parameterName]]))}`;
      } catch {
        this.#inputs[parameterName].domNode.value = '';
      }
    });
  }
}

const parameterNames = ['magnitude', 'direction', 'x', 'y'] as const;

type ParameterName = typeof parameterNames[number];

const propertyNames = {
  'magnitude': 'displacementMagnitude',
  'direction': 'displacementDirection',
  'x': 'displacementX',
  'y': 'displacementY',
} as const;
