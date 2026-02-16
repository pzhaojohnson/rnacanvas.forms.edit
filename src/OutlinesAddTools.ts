import type { App } from './App';

import { LightSolidButton } from './LightSolidButton';

import { Checkbox } from './Checkbox';

import { CheckboxField } from './CheckboxField';

export class OutlinesAddTools {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #button = new LightSolidButton('Add', () => this.#add());

  readonly #onlyAddMissingCheckbox = new Checkbox();

  readonly #onlyAddMissingField = new CheckboxField('Only add missing outlines', this.#onlyAddMissingCheckbox.domNode);

  readonly #drawingObserver;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.style.marginTop = '29px';

    this.domNode.style.display = 'flex';
    this.domNode.style.flexDirection = 'column';

    this.domNode.append(this.#button.domNode);

    // checked by default
    this.#onlyAddMissingCheckbox.domNode.checked = true;

    this.#onlyAddMissingField.domNode.style.margin = '10px 0px 0px 10px';
    this.#onlyAddMissingField.domNode.style.alignSelf = 'start';

    this.domNode.append(this.#onlyAddMissingField.domNode);

    // only refresh when the Edit form is open
    targetApp.selectedBases.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when the Edit form is open
    this.#drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // watch for any outlines being added or removed from the drawing
    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, subtree: true });

    this.#onlyAddMissingCheckbox.domNode.addEventListener('change', () => this.refresh());

    this.refresh();
  }

  refresh(): void {
    let selectedBases = [...this.#targetApp.selectedBases];

    let allOutlines = [...this.#targetApp.drawing.outlines];

    let outlinedBases = new Set(allOutlines.map(o => o.owner));

    let notOutlinedBases = selectedBases.filter(b => !outlinedBases.has(b));

    if (selectedBases.length == 0) {
      this.#button.disable();
      this.#button.tooltip.textContent = 'No bases are selected.';
    } else if (this.#onlyAddMissingCheckbox.domNode.checked && notOutlinedBases.length == 0) {
      this.#button.disable();
      this.#button.tooltip.textContent = 'The selected bases are already outlined.';
    } else {
      this.#button.enable();
      this.#button.tooltip.textContent = 'Outline the selected bases.';
    }
  }

  #add(): void {
    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0) {
      return;
    }

    let allOutlines = [...this.#targetApp.drawing.outlines];

    let outlinedBases = new Set(allOutlines.map(o => o.owner));

    let notOutlinedBases = selectedBases.filter(b => !outlinedBases.has(b));

    let basesToBeOutlined = this.#onlyAddMissingCheckbox.domNode.checked ? notOutlinedBases : selectedBases;

    if (basesToBeOutlined.length == 0) {
      return;
    }

    this.#targetApp.pushUndoStack();

    let addedOutlines = basesToBeOutlined.map(b => this.#targetApp.drawing.outline(b));

    this.#targetApp.addToSelected(addedOutlines);

    this.refresh();
  }
}
