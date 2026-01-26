import type { App } from './App';

import * as styles from './NumberingsSection.module.css';

import { SectionHeader } from './SectionHeader';

import { TextButton } from './TextButton';

import { LightSolidButton } from './LightSolidButton';

import { Checkbox } from './Checkbox';

import { CheckboxField } from './CheckboxField';

import { ZSection as _ZSection } from './ZSection';

import { TextInput } from './TextInput';

import { TextInputField } from './TextInputField';

import { consensusValue } from '@rnacanvas/consensize';

import { isFiniteNumber } from '@rnacanvas/value-check';

export class NumberingsSection {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #header = new SectionHeader('Numberings', () => this.toggle());

  readonly #content = document.createElement('div');

  readonly #numSelected;

  readonly #selectionTools;

  readonly #addSection;
  readonly #removeButton;

  readonly #lowerContent;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['numberings-section']);

    this.domNode.append(this.#header.domNode);

    this.#content.classList.add(styles['content']);
    this.domNode.append(this.#content);

    this.#numSelected = new NumSelected(targetApp);
    this.#content.append(this.#numSelected.domNode);

    this.#selectionTools = new SelectionTools(targetApp);
    this.#content.append(this.#selectionTools.domNode);

    this.#addSection = new AddSection(targetApp);
    this.#content.append(this.#addSection.domNode);

    this.#removeButton = new RemoveButton(targetApp);
    this.#content.append(this.#removeButton.domNode);

    this.#lowerContent = new LowerContent(targetApp);
    this.#content.append(this.#lowerContent.domNode);
  }

  toggle(): void {
    this.isCollapsed() ? this.expand() : this.collapse();
  }

  isCollapsed(): boolean {
    return this.domNode.classList.contains(styles['collapsed']);
  }

  collapse(): void {
    this.domNode.classList.add(styles['collapsed']);
  }

  expand(): void {
    this.domNode.classList.remove(styles['collapsed']);
  }

  refresh() {
    this.#refreshableComponents.forEach(component => component.refresh());
  }

  get #refreshableComponents() {
    return [
      this.#numSelected,
      this.#selectionTools,
      this.#addSection,
      this.#removeButton,
      this.#lowerContent,
    ];
  }
}

class NumSelected {
  readonly #targetApp;

  readonly domNode = document.createElement('p');

  readonly #num = document.createElement('span');

  readonly #trailingText = document.createElement('span');

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['num-selected']);

    this.#num.style.fontWeight = '700';

    this.domNode.append(this.#num, this.#trailingText);

    // only refresh when necessary
    this.#targetApp.selectedNumberings.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    this.refresh();
  }

  refresh(): void {
    let num = [...this.#targetApp.selectedNumberings].length;

    this.#num.textContent = `${num}`;

    this.#trailingText.textContent = num == 1 ? ' numbering is selected.' : ' numberings are selected.';
  }
}

class SelectionTools {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #label = document.createElement('p');

  readonly #buttons = {
    'All': new TextButton('All', () => this.#selectAll()),
    'Numbering': new TextButton('Numbering', () => this.#selectNumbering()),
    'None': new TextButton('None', () => this.#deselectAll()),
  }

  #drawingObserver;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['selection-tools']);

    this.#label.classList.add(styles['selection-tools-label']);
    this.#label.textContent = 'Select:';
    this.domNode.append(this.#label);

    this.#buttons['All'].domNode.style.marginLeft = '20px';
    this.#buttons['Numbering'].domNode.style.marginLeft = '17px';
    this.#buttons['None'].domNode.style.marginLeft = '17px';

    this.domNode.append(...(['All', 'Numbering', 'None'] as const).map(name => this.#buttons[name].domNode));

    // only refresh when necessary
    targetApp.selectedNumberings.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when necessary
    this.#drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh(): {};
    });

    // watch for when numberings are added or removed from the drawing
    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, subtree: true });

    this.refresh();
  }

  /**
   * Select all numberings.
   */
  #selectAll() {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.numberings]);
  }

  /**
   * Select all numberings numbering the currently selected bases.
   */
  #selectNumbering() {
    let selectedBases = new Set(this.#targetApp.selectedBases);

    this.#targetApp.addToSelected([...this.#targetApp.drawing.numberings].filter(n => selectedBases.has(n.owner)));
  }

  /**
   * Deselect all numberings.
   */
  #deselectAll() {
    this.#targetApp.removeFromSelected([...this.#targetApp.drawing.numberings]);
  }

  refresh(): void {
    let allNumberings = [...this.#targetApp.drawing.numberings];

    let selectedNumberings = new Set(this.#targetApp.selectedNumberings);

    if (allNumberings.length == 0) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = 'There are no numberings in the drawing.';
    } else if (selectedNumberings.size == allNumberings.length) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = 'All numberings are already selected.';
    } else {
      this.#buttons['All'].enable();
      this.#buttons['All'].tooltip.textContent = 'Select all numberings.';
    }

    let selectedBases = new Set(this.#targetApp.selectedBases);

    let numberingNumberings = allNumberings.filter(n => selectedBases.has(n.owner));

    if (selectedBases.size == 0) {
      this.#buttons['Numbering'].disable();
      this.#buttons['Numbering'].tooltip.textContent = 'No bases are selected.';
    } else if (numberingNumberings.length == 0) {
      this.#buttons['Numbering'].disable();
      this.#buttons['Numbering'].tooltip.textContent = 'None of the selected bases are numbered.';
    } else if (numberingNumberings.every(n => selectedNumberings.has(n))) {
      this.#buttons['Numbering'].disable();
      this.#buttons['Numbering'].tooltip.textContent = 'All numberings numbering the selected bases are already selected.';
    } else {
      this.#buttons['Numbering'].enable();
      this.#buttons['Numbering'].tooltip.textContent = 'Select numberings numbering the selected bases.';
    }

    if (selectedNumberings.size == 0) {
      this.#buttons['None'].disable();
      this.#buttons['None'].tooltip.textContent = 'No numberings are selected.';
    } else {
      this.#buttons['None'].enable();
      this.#buttons['None'].tooltip.textContent = 'Deselect all numberings.';
    }
  }
}

class AddSection {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #addButton = new LightSolidButton('Add', () => this.#add());

  readonly #onlyAddMissingCheckbox = new Checkbox();

  readonly #onlyAddMissingField = new CheckboxField('Only add missing numberings', this.#onlyAddMissingCheckbox.domNode);

  #drawingObserver;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['add-section']);

    this.domNode.append(this.#addButton.domNode);

    // checked by default
    this.#onlyAddMissingCheckbox.domNode.checked = true;

    this.#onlyAddMissingField.domNode.style.margin = '10px 0px 0px 10px';
    this.#onlyAddMissingField.domNode.style.alignSelf = 'start';

    this.domNode.append(this.#onlyAddMissingField.domNode);

    // only refresh when necessary
    targetApp.selectedBases.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when necessary
    this.#drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // watch for numberings being added and removed from the drawing
    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, subtree: true });

    this.#onlyAddMissingCheckbox.domNode.addEventListener('change', () => this.refresh());

    this.refresh();
  }

  #add(): void {
    let allBases = [...this.#targetApp.drawing.bases];

    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0) {
      return;
    }

    let allNumberings = [...this.#targetApp.drawing.numberings];

    let numbered = new Set(allNumberings.map(n => n.owner));

    let notNumbered = selectedBases.filter(b => !numbered.has(b));

    let toNumber = this.#onlyAddMissingCheckbox.domNode.checked ? notNumbered : selectedBases;

    if (toNumber.length == 0) {
      return;
    }

    this.#targetApp.pushUndoStack();

    let added = toNumber.flatMap(b => {
      // the position of the base
      let p = allBases.indexOf(b) + 1;

      return this.#targetApp.drawing.number(b, p);
    });

    this.#targetApp.addToSelected(added);

    this.refresh();
  }

  refresh(): void {
    let selectedBases = [...this.#targetApp.selectedBases];

    let allNumberings = [...this.#targetApp.drawing.numberings];

    let numbered = new Set(allNumberings.map(n => n.owner));

    let notNumbered = selectedBases.filter(b => !numbered.has(b));

    if (selectedBases.length == 0) {
      this.#addButton.disable();
      this.#addButton.tooltip.textContent = 'No bases are selected.';
    } else if (this.#onlyAddMissingCheckbox.domNode.checked && notNumbered.length == 0) {
      this.#addButton.disable();
      this.#addButton.tooltip.textContent = 'All selected bases are already numbered.';
    } else {
      this.#addButton.enable();
      this.#addButton.tooltip.textContent = 'Number the selected bases.';
    }
  }
}

class RemoveButton {
  readonly #targetApp;

  #button = new LightSolidButton('Remove', () => this.press());

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.style.marginTop = '18px';

    // only refresh when necessary
    this.#targetApp.selectedOutlines.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    this.refresh();
  }

  get domNode() {
    return this.#button.domNode;
  }

  press(): void {
    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    if (selectedNumberings.length == 0) {
      this.refresh();

      return;
    }

    this.#targetApp.pushUndoStack();

    selectedNumberings.forEach(n => n.domNode.remove());

    this.refresh();
  }

  refresh(): void {
    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    if (selectedNumberings.length == 0) {
      this.#button.disable();
      this.#button.tooltip.textContent = 'No numberings are selected.';
    } else {
      this.#button.enable();
      this.#button.tooltip.textContent = 'Remove the selected numberings from the drawing.';
    }
  }
}

class LowerContent {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  #zSection;

  #textContentField;

  #displacementSection;

  #fillField;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['lower-content']);

    // only update when necessary
    targetApp.selectedNumberings.addEventListener('change', () => {
      if (document.body.contains(this.domNode)) {
        [...targetApp.selectedNumberings].length > 0 ? this.show() : this.hide();
      }
    });

    this.#zSection = new ZSection(targetApp);
    this.domNode.append(this.#zSection.domNode);

    this.#textContentField = new TextContentField(targetApp);
    this.domNode.append(this.#textContentField.domNode);

    this.#displacementSection = new DisplacementSection(targetApp);
    this.domNode.append(this.#displacementSection.domNode);

    this.#fillField = new FillField(targetApp);
    this.domNode.append(this.#fillField.domNode);
  }

  show(): void {
    this.domNode.style.display = 'flex';
  }

  hide(): void {
    this.domNode.style.display = 'none';
  }

  refresh(): void {
    this.#refreshableComponents.forEach(component => component.refresh());

    [...this.#targetApp.selectedNumberings].length > 0 ? this.show() : this.hide();
  }

  get #refreshableComponents() {
    return [
      this.#zSection,
      this.#textContentField,
      this.#displacementSection,
      this.#fillField,
    ];
  }
}

class ZSection {
  readonly #targetApp;

  readonly #zSection;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedNumberings = targetApp.selectedNumberings;

    this.#zSection = new _ZSection(selectedNumberings, targetApp);

    this.domNode.style.marginTop = '26px';

    this.#zSection.addEventListener('refresh', () => this.#handleRefresh());

    this.refresh();
  }

  get domNode() {
    return this.#zSection.domNode;
  }

  refresh(): void {
    this.#zSection.refresh();
  }

  #handleRefresh(): void {
    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    if (selectedNumberings.length == 0) {
      this.#zSection.buttons['Front'].tooltip.textContent = 'No numberings are selected.';
    } else {
      this.#zSection.buttons['Front'].tooltip.textContent = 'Bring the selected numberings to the front.';
    }

    if (selectedNumberings.length == 0) {
      this.#zSection.buttons['Back'].tooltip.textContent = 'No numberings are selected.';
    } else {
      this.#zSection.buttons['Back'].tooltip.textContent = 'Send the selected numberings to the back.';
    }
  }
}

class TextContentField {
  readonly #targetApp;

  readonly #input = new TextInput({
    onSubmit: () => this.#submit(),
  });

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#field = new TextInputField('Text Content', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent';

    this.domNode.style.marginTop = '23px';
    this.domNode.style.alignSelf = 'start';

    // only refresh when necessary
    this.#targetApp.selectedNumberings.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when necessary
    let drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // watch for any changes in text content
    drawingObserver.observe(this.#targetApp.drawing.domNode, { characterData: true, subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  #submit(): void {
    let textContent = this.#input.domNode.value ?? '';

    // don't forget to trim leading and trailing whitespace
    textContent = textContent.trim();

    // don't assign empty text content to numberings
    if (!textContent) {
      this.refresh();

      return;
    }

    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    if (selectedNumberings.length == 0 || selectedNumberings.every(n => n.domNode.textContent === textContent)) {
      this.refresh();

      return;
    }

    this.#targetApp.pushUndoStack();

    selectedNumberings.forEach(n => {
      n.domNode.textContent = textContent;

      // do this to effectively reposition the numbering (after changing its text content)
      n.displacement.magnitude += 1;
      n.displacement.magnitude -= 1;
    });

    this.refresh();
  }

  refresh(): void {
    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    try {
      this.#input.domNode.value = consensusValue(selectedNumberings.map(n => n.domNode.textContent));
    } catch {
      this.#input.domNode.value = '';
    }
  }
}

class DisplacementSection {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #inputs = {
    'x': new TextInput({ onSubmit: () => this.#submit('x') }),
    'y': new TextInput({ onSubmit: () => this.#submit('y') }),
    'magnitude': new TextInput({ onSubmit: () => this.#submit('magnitude') }),
    'direction': new TextInput({ onSubmit: () => this.#submit('direction') }),
  };

  #fields;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['displacement-section']);

    this.#fields = {
      'x': new TextInputField('X', this.#inputs['x'].domNode),
      'y': new TextInputField('Y', this.#inputs['y'].domNode),
      'magnitude': new TextInputField('Magnitude', this.#inputs['magnitude'].domNode),
      'direction': new TextInputField('Direction', this.#inputs['direction'].domNode),
    };

    displacementParameterNames.forEach(parameterName => {
      this.#fields[parameterName].domNode.style.marginTop = '10px';
      this.#fields[parameterName].domNode.style.alignSelf = 'start';
    });

    this.#fields['magnitude'].domNode.style.marginTop = '14px';

    this.domNode.append(...displacementParameterNames.map(parameterName => this.#fields[parameterName].domNode));

    // only refresh when necessary
    this.#targetApp.selectedNumberings.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when necessary
    let drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // displacement data should be stored under `data-displacement` attribute
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

class FillField {
  readonly #targetApp;

  readonly #input;

  readonly #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input = new AttributeInput('fill', targetApp);

    this.#field = new TextInputField('Fill', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill';

    this.domNode.style.marginTop = '14px';
    this.domNode.style.alignSelf = 'start';

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    this.#input.refresh();
  }
}

class AttributeInput {
  readonly #attributeName;

  readonly #targetApp;

  readonly #input = new TextInput({
    onSubmit: () => this.#submit(),
  });

  constructor(attributeName: string, targetApp: App) {
    this.#attributeName = attributeName;

    this.#targetApp = targetApp;

    // only refresh when necessary
    this.#targetApp.selectedNumberings.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when necessary
    let drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    drawingObserver.observe(this.#targetApp.drawing.domNode, { attributes: true, subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#input.domNode;
  }

  #submit() {
    let value = this.#input.domNode.value;

    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    if (selectedNumberings.length == 0) {
      this.refresh();

      return;
    }

    if (selectedNumberings.every(n => n.domNode.getAttribute(this.#attributeName) === value)) {
      this.refresh();

      return;
    }

    this.#targetApp.pushUndoStack();

    selectedNumberings.forEach(n => {
      n.domNode.setAttribute(this.#attributeName, value);

      // effectively reposition the numbering (after changing an attribute)
      n.displacement.magnitude += 1;
      n.displacement.magnitude -= 1;
    });

    this.refresh();
  }

  refresh(): void {
    let selectedNumberings = [...this.#targetApp.selectedNumberings];

    try {
      this.#input.domNode.value = consensusValue(selectedNumberings.map(n => n.domNode.getAttribute(this.#attributeName) ?? ''));
    } catch {
      this.#input.domNode.value = '';
    }
  }
}
