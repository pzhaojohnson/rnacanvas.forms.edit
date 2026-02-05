import type { App } from './App';

import * as styles from './NumberingsDisplacementSection.module.css';

import { TextInput } from './TextInput';

import { TextInputField } from './TextInputField';

import { isFiniteNumber } from '@rnacanvas/value-check';

import { consensusValue } from '@rnacanvas/consensize';

export class NumberingsDisplacementSection {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #label = document.createElement('p');

  readonly #inputs = {
    'x': new TextInput({ onSubmit: () => this.#submit('x') }),
    'y': new TextInput({ onSubmit: () => this.#submit('y') }),
    'magnitude': new TextInput({ onSubmit: () => this.#submit('magnitude') }),
    'direction': new TextInput({ onSubmit: () => this.#submit('direction') }),
  } as const;

  readonly #fields;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['numberings-displacement-section']);

    this.#label.classList.add(styles['label']);
    this.#label.textContent = 'Displacement:';

    this.#fields = {
      'x': new TextInputField('X', this.#inputs['x'].domNode),
      'y': new TextInputField('Y', this.#inputs['y'].domNode),
      'magnitude': new TextInputField('Magnitude', this.#inputs['magnitude'].domNode),
      'direction': new TextInputField('Direction', this.#inputs['direction'].domNode),
    };

    displacementParameterNames.forEach(parameterName => {
      this.#fields[parameterName].domNode.style.marginTop = '10px';
      this.#fields[parameterName].domNode.style.marginLeft = '8px';
      this.#fields[parameterName].domNode.style.alignSelf = 'start';
    });

    this.#fields['x'].domNode.style.marginTop = '0px';

    this.domNode.append(...displacementParameterNames.map(parameterName => this.#fields[parameterName].domNode));

    // only refresh when necessary
    this.#targetApp.selectedNumberings.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when necessary
    let drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // displacement data should be stored in the `data-displacement` attribute
    drawingObserver.observe(this.#targetApp.drawing.domNode, { attributes: true, attributeFilter: ['data-displacement'], subtree: true });

    this.refresh();
  }

  #submit(parameterName: DisplacementParameterName) {
    let value = Number.parseFloat(this.#inputs[parameterName].domNode.value);

    // ignore inputs that are not finite numbers
    if (!isFiniteNumber(value)) {
      this.refresh();

      return;
    }

    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    if (selectedNumberings.length == 0) {
      this.refresh();

      return;
    }

    if (selectedNumberings.every(n => n.displacement[parameterName] === value)) {
      this.refresh();

      return;
    }

    this.#targetApp.pushUndoStack();

    selectedNumberings.forEach(n => n.displacement[parameterName] = value);

    this.refresh();
  }

  refresh(): void {
    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    displacementParameterNames.forEach(parameterName => {
      try {
        this.#inputs[parameterName].domNode.value = `${consensusValue(selectedNumberings.map(n => n.displacement[parameterName]))}`;
      } catch {
        this.#inputs[parameterName].domNode.value = '';
      }
    });
  }
}

const displacementParameterNames = ['x', 'y', 'magnitude', 'direction'] as const;

type DisplacementParameterName = typeof displacementParameterNames[number];
