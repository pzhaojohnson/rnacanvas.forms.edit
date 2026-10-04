import type { App } from './App';

import type { Numbering } from './Numbering';

import * as styles from './NumberingsDisplacementSection.module.css';

import { TextInput } from './TextInput';

import { TextInputField } from './TextInputField';

import { isFiniteNumber } from '@rnacanvas/value-check';

import { consensusValue } from '@rnacanvas/consensize';

import { degrees, radians } from '@rnacanvas/math';

export class NumberingsDisplacementSection {
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

    this.domNode.classList.add(styles['numberings-displacement-section']);

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

  #submit(parameterName: ParameterName) {
    let displayedValue = Number.parseFloat(this.#inputs[parameterName].domNode.value);

    // ignore inputs that are not finite numbers
    if (!isFiniteNumber(displayedValue)) {
      this.refresh();
      return;
    }

    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    if (selectedNumberings.length == 0) {
      this.refresh();
      return;
    }

    // compare displayed values (since converting to radians could introduce floating point error)
    if (selectedNumberings.every(n => new DisplacementParameter(parameterName, n).displayedValue === displayedValue)) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    // direction is shown in degrees but stored in radians
    let value = parameterName == 'direction' ? radians(displayedValue) : displayedValue;

    selectedNumberings.forEach(n => n.displacement[parameterName] = value);

    this.refresh();
  }

  refresh(): void {
    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    parameterNames.forEach(parameterName => {
      try {
        let displayedValue = consensusValue(selectedNumberings.map(n => new DisplacementParameter(parameterName, n).displayedValue));

        this.#inputs[parameterName].domNode.value = parameterName == 'direction' ? `${displayedValue}°` : `${displayedValue}`;
      } catch {
        this.#inputs[parameterName].domNode.value = '';
      }
    });
  }
}

const parameterNames = ['magnitude', 'direction', 'x', 'y'] as const;

type ParameterName = typeof parameterNames[number];

class DisplacementParameter {
  readonly #name;

  readonly #targetElement;

  constructor(name: ParameterName, targetElement: Numbering) {
    this.#name = name;

    this.#targetElement = targetElement;
  }

  get value() {
    return this.#targetElement.displacement[this.#name];
  }

  get storedValue() {
    return this.value;
  }

  get displayedValue() {
    return this.#name == 'direction' ? degrees(this.value) : this.value;
  }
}
