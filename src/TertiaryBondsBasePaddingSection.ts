import type { App } from './App';

import type { TertiaryBond } from './TertiaryBond';

import * as styles from './TertiaryBondsBasePaddingSection.module.css';

import { TextInput } from './TextInput';

import { TextInputField } from './TextInputField';

import { isFiniteNumber } from '@rnacanvas/value-check';

import { consensusValue } from '@rnacanvas/consensize';

import { degrees, radians } from '@rnacanvas/math';

export class TertiaryBondsBasePaddingSection {
  readonly #targetApp;

  readonly #num;

  readonly domNode = document.createElement('div');

  readonly #label = document.createElement('p');

  readonly #inputs = {
    'magnitude': new TextInput({ onSubmit: () => this.#submit('magnitude') }),
    'direction': new TextInput({ onSubmit: () => this.#submit('direction') }),
  } as const;

  readonly #fields;

  constructor(targetApp: App, num: 1 | 2) {
    this.#targetApp = targetApp;

    this.#num = num;

    this.domNode.classList.add(styles['tertiary-bonds-base-padding-section']);

    this.#label.classList.add(styles['label']);
    this.#label.textContent = `Base Padding ${num}:`;
    this.domNode.append(this.#label);

    this.#fields = {
      'magnitude': new TextInputField('Magnitude', this.#inputs['magnitude'].domNode),
      'direction': new TextInputField('Direction', this.#inputs['direction'].domNode),
    };

    parameterNames.forEach(parameterName => {
      this.#fields[parameterName].domNode.style.marginTop = '10px';
      this.#fields[parameterName].domNode.style.marginLeft = '8px';
      this.#fields[parameterName].domNode.style.alignSelf = 'start';
    });

    this.#fields['magnitude'].domNode.style.marginTop = '0px';

    this.domNode.append(...parameterNames.map(parameterName => this.#fields[parameterName].domNode));

    // only refresh when necessary
    this.#targetApp.selectedTertiaryBonds.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when necessary
    let drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // base padding values are expected to be stored in `data-base-padding1` and `data-base-padding2` attributes
    drawingObserver.observe(this.#targetApp.drawing.domNode, {
      attributes: true,
      attributeFilter: [`data-base-padding${num}`],
      subtree: true,
    });

    this.refresh();
  }

  #submit(parameterName: ParameterName) {
    let displayedValue = Number.parseFloat(this.#inputs[parameterName].domNode.value);

    // ignore inputs that are not finite numbers
    if (!isFiniteNumber(displayedValue)) {
      this.refresh();
      return;
    }

    let selectedTertiaryBonds = [...this.#targetApp.selectedTertiaryBonds];

    if (selectedTertiaryBonds.length == 0) {
      this.refresh();
      return;
    }

    // compare displayed values (since converting to radians could introduce floating point error)
    if (selectedTertiaryBonds.every(tb => (new BasePaddingParameter(parameterName, this.#num, tb)).displayedValue === displayedValue)) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    // direction is shown in degrees but stored in radians
    let value = parameterName == 'direction' ? radians(displayedValue) : displayedValue;

    selectedTertiaryBonds.forEach(tb => (new BasePaddingParameter(parameterName, this.#num, tb)).value = value);

    this.refresh();
  }

  refresh(): void {
    let selectedTertiaryBonds = [...this.#targetApp.selectedTertiaryBonds];

    parameterNames.forEach(parameterName => {
      try {
        let displayedValue = consensusValue(selectedTertiaryBonds.map(tb => (new BasePaddingParameter(parameterName, this.#num, tb)).displayedValue));

        this.#inputs[parameterName].domNode.value = parameterName == 'direction' ? `${displayedValue}°` : `${displayedValue}`;
      } catch {
        this.#inputs[parameterName].domNode.value = '';
      }
    });
  }
}

const parameterNames = ['magnitude', 'direction'] as const;

type ParameterName = typeof parameterNames[number];

class BasePaddingParameter {
  readonly #name;

  readonly #num;

  readonly #targetElement;

  constructor(name: ParameterName, num: 1 | 2, targetElement: TertiaryBond) {
    this.#name = name;

    this.#num = num;

    this.#targetElement = targetElement;
  }

  get #basePadding() {
    return this.#num == 1 ? this.#targetElement.basePadding1 : this.#targetElement.basePadding2;
  }

  get value() {
    return this.#basePadding[this.#name];
  }

  set value(value) {
    this.#basePadding[this.#name] = value;
  }

  get storedValue() {
    return this.value;
  }

  get displayedValue() {
    return this.#name == 'direction' ? degrees(this.value) : this.value;
  }
}
