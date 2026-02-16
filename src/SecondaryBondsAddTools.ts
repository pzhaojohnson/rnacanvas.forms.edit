import type { App } from './App';

import type { SecondaryBond } from './SecondaryBond';

import * as styles from './SecondaryBondsAddTools.module.css';

import { LightSolidButton } from './LightSolidButton';

import { Checkbox } from './Checkbox';

import { CheckboxField } from './CheckboxField';

import { antiParallelPairs, missing } from '@rnacanvas/base-pairs';

import { seqSorted } from '@rnacanvas/draw.bases';

export class SecondaryBondsAddTools {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #button = new LightSolidButton('Add', () => this.press());

  readonly #onlyAddMissingCheckbox = new Checkbox();

  readonly #onlyAddMissingField = new CheckboxField('Only add missing secondary bonds', this.#onlyAddMissingCheckbox.domNode);

  readonly #drawingObserver;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['secondary-bonds-add-tools']);

    this.domNode.append(this.#button.domNode, this.#onlyAddMissingField.domNode);

    // checked by default
    this.#onlyAddMissingCheckbox.domNode.checked = true;

    this.#onlyAddMissingField.domNode.style.marginLeft = '10px';

    // only refresh when the Edit form is open
    this.#targetApp.selectedBases.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when the Edit form is open
    this.#drawingObserver = new MutationObserver(() => document.body.contains(this.domNode) ? this.refresh() : {});

    // watch for any secondary bonds being added or removed from the drawing
    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, subtree: true });

    this.#onlyAddMissingCheckbox.domNode.addEventListener('change', () => this.refresh());
  }

  press(): void {
    let parentSeq = [...this.#targetApp.drawing.bases];

    let selectedBases = [...this.#targetApp.selectedBases];

    // don't forget to sort!
    selectedBases = seqSorted(selectedBases, parentSeq);

    let allSecondaryBonds = [...this.#targetApp.drawing.secondaryBonds];

    let existingPairs = allSecondaryBonds.map(wrap).map(sb => sb.basePair);

    let missingPairs = missing(existingPairs, antiParallelPairs(selectedBases));

    if (selectedBases.length < 2) {
      return;
    } else if (this.#onlyAddMissingCheckbox.domNode.checked && missingPairs.length == 0) {
      return;
    }

    this.#targetApp.pushUndoStack();

    if (this.#onlyAddMissingCheckbox.domNode.checked) {
      missingPairs.forEach(pair => this.#targetApp.drawing.addSecondaryBond(...pair));
    } else {
      antiParallelPairs(selectedBases).forEach(pair => this.#targetApp.drawing.addSecondaryBond(...pair));
    }
  }

  refresh(): void {
    let parentSeq = [...this.#targetApp.drawing.bases];

    let selectedBases = [...this.#targetApp.selectedBases];

    // don't forget to sort!
    selectedBases = seqSorted(selectedBases, parentSeq);

    let allSecondaryBonds = [...this.#targetApp.drawing.secondaryBonds];

    let existingPairs = allSecondaryBonds.map(wrap).map(sb => sb.basePair);

    let missingPairs = missing(existingPairs, antiParallelPairs(selectedBases));

    if (selectedBases.length == 0) {
      this.#button.disable();
      this.#button.tooltip.textContent = 'No bases are selected.';
    } else if (selectedBases.length == 1) {
      this.#button.disable();
      this.#button.tooltip.textContent = 'At least two bases must be selected.';
    } else if (this.#onlyAddMissingCheckbox.domNode.checked && missingPairs.length == 0) {
      this.#button.disable();
      this.#button.tooltip.textContent = "There aren't any missing secondary bonds.";
    } else {
      this.#button.enable();
      this.#button.tooltip.textContent = 'Add secondary bonds between the selected bases.';
    }
  }
}

function wrap(sb: SecondaryBond) {
  return {
    get basePair(): [Nucleobase, Nucleobase] {
      return [sb.base1, sb.base2];
    },

    unwrap() {
      return sb;
    }
  };
}

function unwrap(wrapped: ReturnType<typeof wrap>) {
  return wrapped.unwrap();
}

type Nucleobase = SecondaryBond['base1'] | SecondaryBond['base2'];
