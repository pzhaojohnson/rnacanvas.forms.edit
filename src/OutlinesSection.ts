import type { App } from './App';

import * as styles from './OutlinesSection.module.css';

import * as $ from 'jquery';

import { SectionHeader } from './SectionHeader';

import { TextButton } from './TextButton';

import { LightSolidButton } from './LightSolidButton';

import { Checkbox } from './Checkbox';

import { CheckboxField } from './CheckboxField';

import { TextInput } from './TextInput';

import { TextInputField } from './TextInputField';

import { ColorInput } from './ColorInput';

import { ColorField } from './ColorField';

import { Color } from '@svgdotjs/svg.js';

import { consensusValue } from '@rnacanvas/consensize';

import { bringToFront, sendToBack } from '@rnacanvas/draw.svg';

export class OutlinesSection {
  #targetApp;

  readonly domNode = document.createElement('div');

  #header = new SectionHeader();

  #content = document.createElement('div');

  #numSelected;

  #bottomContent = document.createElement('div');

  #selectSection;
  #addSection;
  #removeButton;
  #zSection;
  #rField;
  #fillField;
  #fillColorField;
  #fillOpacityField;
  #strokeField;
  #strokeColorField;
  #strokeOpacityField;
  #strokeWidthField;
  #strokeDasharrayField;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['outlines-section']);

    this.#header.textContent = 'Outlines';
    this.#header.domNode.addEventListener('click', () => this.toggle());
    this.domNode.append(this.#header.domNode);

    this.#content.classList.add(styles['content']);
    this.domNode.append(this.#content);

    this.#numSelected = new NumSelected(targetApp);
    this.#content.append(this.#numSelected.domNode);

    this.#selectSection = new SelectSection(targetApp);
    this.#content.append(this.#selectSection.domNode);

    this.#addSection = new AddSection(targetApp);
    this.#content.append(this.#addSection.domNode);

    this.#removeButton = new RemoveButton(targetApp);
    this.#content.append(this.#removeButton.domNode);

    this.#bottomContent.classList.add(styles['bottom-content']);
    this.#content.append(this.#bottomContent);

    // only refresh when necessary
    targetApp.selectedOutlines.addEventListener('change', () => {
      if (document.body.contains(this.domNode)) {
        [...targetApp.selectedOutlines].length > 0 ? this.#showBottomContent() : this.#hideBottomContent();
      }
    });

    this.#zSection = new ZSection(targetApp);
    this.#bottomContent.append(this.#zSection.domNode);

    this.#rField = new RField(targetApp);
    this.#bottomContent.append(this.#rField.domNode);

    this.#fillField = new FillField(targetApp);
    this.#bottomContent.append(this.#fillField.domNode);

    this.#fillColorField = new FillColorField(targetApp);
    this.#bottomContent.append(this.#fillColorField.domNode);

    this.#fillOpacityField = new FillOpacityField(targetApp);
    this.#bottomContent.append(this.#fillOpacityField.domNode);

    this.#strokeField = new StrokeField(targetApp);
    this.#bottomContent.append(this.#strokeField.domNode);

    this.#strokeColorField = new StrokeColorField(targetApp);
    this.#bottomContent.append(this.#strokeColorField.domNode);

    this.#strokeOpacityField = new StrokeOpacityField(targetApp);
    this.#bottomContent.append(this.#strokeOpacityField.domNode);

    this.#strokeWidthField = new StrokeWidthField(targetApp);
    this.#bottomContent.append(this.#strokeWidthField.domNode);

    this.#strokeDasharrayField = new StrokeDasharrayField(targetApp);
    this.#bottomContent.append(this.#strokeDasharrayField.domNode);
  }

  isOpen(): boolean {
    return this.domNode.classList.contains(styles['open']);
  }

  toggle(): void {
    if (this.isOpen()) {
      this.domNode.classList.remove(styles['open']);
      this.#header.caret.pointRight();
    } else {
      this.domNode.classList.add(styles['open']);
      this.#header.caret.pointDown();
    }
  }

  get #refreshableComponents() {
    return [
      this.#numSelected,
      this.#selectSection,
      this.#addSection,
      this.#removeButton,
      this.#zSection,
      this.#rField,
      this.#fillField,
      this.#fillColorField,
      this.#fillOpacityField,
      this.#strokeField,
      this.#strokeColorField,
      this.#strokeOpacityField,
      this.#strokeWidthField,
      this.#strokeDasharrayField,
    ];
  }

  refresh(): void {
    this.#refreshableComponents.forEach(component => component.refresh());

    [...this.#targetApp.selectedOutlines].length > 0 ? this.#showBottomContent() : this.#hideBottomContent();
  }

  #showBottomContent() {
    this.#bottomContent.style.display = 'flex';
  }

  #hideBottomContent() {
    this.#bottomContent.style.display = 'none';
  }
}

class NumSelected {
  #targetApp;

  readonly domNode = document.createElement('p');

  #num = document.createElement('span');

  #trailingText = document.createElement('span');

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['num-selected']);

    this.#num.style.fontWeight = '700';

    this.domNode.append(this.#num, this.#trailingText);

    // only refresh when necessary
    this.#targetApp.selectedOutlines.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh() : {});

    this.refresh();
  }

  refresh(): void {
    let num = [...this.#targetApp.selectedOutlines].length;

    this.#num.textContent = `${num}`;

    this.#trailingText.textContent = num == 1 ? ' outline is selected.' : ' outlines are selected.';
  }
}

class SelectSection {
  #targetApp;

  readonly domNode = document.createElement('div');

  #label = document.createElement('p');

  #allButton = new TextButton();

  #outliningButton = new TextButton();

  #noneButton = new TextButton();

  #drawingObserver;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['select-section']);

    this.#label.classList.add(styles['select-section-label']);
    this.#label.textContent = 'Select:';
    this.domNode.append(this.#label);

    this.#allButton.domNode.addEventListener('click', () => this.#selectAll());
    this.#allButton.textContent = 'All';
    this.#allButton.domNode.style.marginLeft = '20px';
    this.domNode.append(this.#allButton.domNode);

    this.#outliningButton.domNode.addEventListener('click', () => this.#selectOutlining());
    this.#outliningButton.textContent = 'Outlining';
    this.#outliningButton.domNode.style.marginLeft = '17px';
    this.domNode.append(this.#outliningButton.domNode);

    this.#noneButton.domNode.addEventListener('click', () => this.#deselectAll());
    this.#noneButton.textContent = 'None';
    this.#noneButton.domNode.style.marginLeft = '17px';
    this.domNode.append(this.#noneButton.domNode);

    // only refresh when necessary
    targetApp.selectedOutlines.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh() : {});

    // watch for when outlines are added or removed from the drawing
    this.#drawingObserver = new MutationObserver(() => document.body.contains(this.domNode) ? this.refresh(): {});
    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, subtree: true });

    this.refresh();
  }

  /**
   * Add all outlines to selected.
   */
  #selectAll() {
    let allOutlines = [...this.#targetApp.drawing.outlines];

    this.#targetApp.addToSelected(allOutlines);
  }

  /**
   * Add all outlines outlining the currently selected bases to the current selection.
   */
  #selectOutlining() {
    let selectedBases = new Set(this.#targetApp.selectedBases);

    let allOutlines = [...this.#targetApp.drawing.outlines];

    this.#targetApp.addToSelected(allOutlines.filter(o => selectedBases.has(o.owner)));
  }

  /**
   * Remove all outlines from selected.
   */
  #deselectAll() {
    let allOutlines = [...this.#targetApp.drawing.outlines];

    this.#targetApp.removeFromSelected(allOutlines);
  }

  refresh(): void {
    this.#refreshAllButton();

    this.#refreshOutliningButton();

    this.#refreshNoneButton();
  }

  #refreshAllButton() {
    let allOutlines = [...this.#targetApp.drawing.outlines];

    let selectedOutlines = [...this.#targetApp.selectedOutlines];

    if (allOutlines.length == 0) {
      this.#allButton.disable();
      this.#allButton.tooltip.textContent = 'There are no outlines in the drawing.';
    } else if (selectedOutlines.length == allOutlines.length) {
      this.#allButton.disable();
      this.#allButton.tooltip.textContent = 'All outlines are already selected.';
    } else {
      this.#allButton.enable();
      this.#allButton.tooltip.textContent = 'Select all outlines.';
    }
  }

  #refreshOutliningButton() {
    let allOutlines = [...this.#targetApp.drawing.outlines];

    let selectedBases = new Set(this.#targetApp.selectedBases);

    let outliningOutlines = allOutlines.filter(o => selectedBases.has(o.owner));

    let selectedOutlines = new Set(this.#targetApp.selectedOutlines);

    if (selectedBases.size == 0) {
      this.#outliningButton.disable();
      this.#outliningButton.tooltip.textContent = 'No bases are selected.';
    } else if (outliningOutlines.length == 0) {
      this.#outliningButton.disable();
      this.#outliningButton.tooltip.textContent = 'No selected bases are outlined.';
    } else if (outliningOutlines.every(o => selectedOutlines.has(o))) {
      this.#outliningButton.disable();
      this.#outliningButton.tooltip.textContent = 'All outlines outlining the selected bases are already selected.';
    } else {
      this.#outliningButton.enable();
      this.#outliningButton.tooltip.textContent = 'Select outlines outlining the selected bases.';
    }
  }

  #refreshNoneButton() {
    let selectedOutlines = [...this.#targetApp.selectedOutlines];

    if (selectedOutlines.length == 0) {
      this.#noneButton.disable();
      this.#noneButton.tooltip.textContent = 'No outlines are selected.';
    } else {
      this.#noneButton.enable();
      this.#noneButton.tooltip.textContent = 'Deselect all outlines.';
    }
  }
}

class AddSection {
  #targetApp;

  readonly domNode = document.createElement('div');

  #button = new LightSolidButton('Add', () => this.#add());

  #onlyAddMissingCheckbox = new Checkbox();

  #onlyAddMissingField = new CheckboxField('Only add missing outlines', this.#onlyAddMissingCheckbox.domNode);

  #drawingObserver;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.style.marginTop = '27px';

    this.domNode.style.display = 'flex';
    this.domNode.style.flexDirection = 'column';

    this.domNode.append(this.#button.domNode);

    // checked by default
    this.#onlyAddMissingCheckbox.domNode.checked = true;

    this.#onlyAddMissingField.domNode.style.margin = '10px 0px 0px 10px';
    this.#onlyAddMissingField.domNode.style.alignSelf = 'start';

    this.domNode.append(this.#onlyAddMissingField.domNode);

    // only refresh when necessary
    targetApp.selectedBases.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh() : {});

    // only refresh when necessary
    this.#drawingObserver = new MutationObserver(() => document.body.contains(this.domNode) ? this.refresh() : {});
    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, subtree: true });

    this.#onlyAddMissingCheckbox.domNode.addEventListener('change', () => this.refresh());

    this.refresh();
  }

  get #onlyAddMissing(): boolean {
    return this.#onlyAddMissingCheckbox.domNode.checked;
  }

  refresh(): void {
    let selectedBases = [...this.#targetApp.selectedBases];

    let allOutlines = [...this.#targetApp.drawing.outlines];

    let outlined = new Set(allOutlines.map(o => o.owner));

    let notOutlined = selectedBases.filter(b => !outlined.has(b));

    if (selectedBases.length == 0) {
      this.#button.disable();
      this.#button.tooltip.textContent = 'No bases are selected.';
    } else if (this.#onlyAddMissing && notOutlined.length == 0) {
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

    let outlined = new Set(allOutlines.map(o => o.owner));

    let notOutlined = selectedBases.filter(b => !outlined.has(b));

    let toBeOutlined = this.#onlyAddMissing ? notOutlined : selectedBases;

    if (toBeOutlined.length == 0) {
      return;
    }

    this.#targetApp.pushUndoStack();

    let addedOutlines = toBeOutlined.map(b => this.#targetApp.drawing.outline(b));

    this.#targetApp.addToSelected(addedOutlines);

    this.refresh();
  }
}

class RemoveButton {
  #targetApp;

  #button = new LightSolidButton('Remove', () => this.press());

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.style.marginTop = '18px';

    // only refresh when necessary
    this.#targetApp.selectedOutlines.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh() : {});

    this.refresh();
  }

  get domNode() {
    return this.#button.domNode;
  }

  press(): void {
    let selectedOutlines = [...this.#targetApp.selectedOutlines];

    if (selectedOutlines.length == 0) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedOutlines.forEach(o => o.domNode.remove());

    this.refresh();
  }

  refresh(): void {
    let selectedOutlines = [...this.#targetApp.selectedOutlines];

    if (selectedOutlines.length == 0) {
      this.#button.disable();
      this.#button.tooltip.textContent = 'No outlines are selected.';
    } else {
      this.#button.enable();
      this.#button.tooltip.textContent = 'Remove the selected outlines from the drawing.';
    }
  }
}

class ZSection {
  #targetApp;

  readonly domNode = document.createElement('div');

  #label = document.createElement('p');

  #frontButton = new TextButton();

  #backButton = new TextButton();

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['z-section']);

    this.#label.classList.add(styles['z-section-label']);
    this.#label.textContent = 'Send to:';
    this.domNode.append(this.#label);

    this.#frontButton.domNode.addEventListener('click', () => this.#bringToFront());
    this.#frontButton.textContent = 'Front';
    this.#frontButton.domNode.style.marginLeft = '24px';
    this.domNode.append(this.#frontButton.domNode);

    this.#backButton.domNode.addEventListener('click', () => this.#sendToBack());
    this.#backButton.textContent = 'Back';
    this.#backButton.domNode.style.marginLeft = '28px';
    this.domNode.append(this.#backButton.domNode);

    // only refresh when necessary
    targetApp.selectedOutlines.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh() : {});

    this.refresh();
  }

  #bringToFront() {
    let selectedOutlines = [...this.#targetApp.selectedOutlines];

    if (selectedOutlines.length == 0) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedOutlines.forEach(o => bringToFront(o.domNode));

    this.refresh();
  }

  #sendToBack() {
    let selectedOutlines = [...this.#targetApp.selectedOutlines];

    if (selectedOutlines.length == 0) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedOutlines.forEach(o => sendToBack(o.domNode));

    this.refresh();
  }

  refresh(): void {
    this.#refreshFrontButton();

    this.#refreshBackButton();
  }

  #refreshFrontButton() {
    let selectedOutlines = [...this.#targetApp.selectedOutlines];

    if (selectedOutlines.length == 0) {
      this.#frontButton.disable();
      this.#frontButton.tooltip.textContent = 'No outlines are selected.';
    } else {
      this.#frontButton.enable();
      this.#frontButton.tooltip.textContent = 'Bring the selected outlines to the front.';
    }
  }

  #refreshBackButton() {
    let selectedOutlines = [...this.#targetApp.selectedOutlines];

    if (selectedOutlines.length == 0) {
      this.#backButton.disable();
      this.#backButton.tooltip.textContent = 'No outlines are selected.';
    } else {
      this.#backButton.enable();
      this.#backButton.tooltip.textContent = 'Send selected outlines to the back.';
    }
  }
}

class RField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input = new AttributeInput(targetApp, 'r');

    this.#field = new TextInputField('Radius', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/r';

    $(this.domNode).css({ marginTop: '22px', alignSelf: 'start' });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    this.#input.refresh();
  }
}

class FillField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input = new AttributeInput(targetApp, 'fill');

    this.#field = new TextInputField('Fill', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/fill';

    $(this.domNode).css({ marginTop: '10px', alignSelf: 'start' });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    this.#input.refresh();
  }
}

class FillColorField {
  #targetApp;

  #input = new ColorInput();

  #field;

  /**
   * Used to determine whether to push the undo stack or not.
   */
  #previousState: unknown;

  /**
   * The value of the color input when last focused.
   */
  #lastFocusValue?: string;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input.domNode.addEventListener('input', () => this.#handleInput());

    this.#field = new ColorField('Fill Color', this.#input.domNode);

    $(this.domNode).css({ marginTop: '12px', alignSelf: 'start' });

    this.#targetApp.selectedOutlines.addEventListener('change', () => this.#previousState = undefined);

    this.#input.domNode.addEventListener('focus', () => this.#lastFocusValue = this.#input.domNode.value);

    // only refresh if necessary
    this.#targetApp.selectedOutlines.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh() : {});

    // only refresh if necessary
    let drawingObserver = new MutationObserver(() => document.body.contains(this.domNode) ? this.refresh() : {});
    drawingObserver.observe(this.#targetApp.drawing.domNode, { attributes: true, attributeFilter: ['fill'], subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    let selectedOutlines = [...this.#targetApp.selectedOutlines];

    if (selectedOutlines.length == 0) {
      this.#input.domNode.value = '#000000';
      return;
    }

    try {
      // this line of code assumes that `window.getComputedStyle()` returns color values in RGB format
      let fills = selectedOutlines.map(b => window.getComputedStyle(b.domNode).fill);

      // note that the `Color` class cannot handle keyword colors (e.g., "red", "magenta", "azure")
      let colors = fills.map(f => new Color(f));

      this.#input.domNode.value = consensusValue(colors.map(c => c.toHex().toLowerCase()));
    } catch {
      this.#input.domNode.value = '#000000';
    }
  }

  #handleInput(): void {
    if (this.#input.domNode.value === this.#lastFocusValue) {
      // in Firefox an input event is fired when just opening a color input
      return;
    }

    let selectedOutlines = [...this.#targetApp.selectedOutlines];

    if (selectedOutlines.length == 0) {
      this.refresh();
      return;
    }

    if (selectedOutlines.every(o => o.domNode.getAttribute('fill')?.toLowerCase() === this.#input.domNode.value.toLowerCase())) {
      this.refresh();
      return;
    }

    if (this.#targetApp.undoStack.isEmpty() || this.#targetApp.undoStack.peek() !== this.#previousState) {
      this.#targetApp.pushUndoStack();

      this.#previousState = this.#targetApp.undoStack.peek();
    }

    selectedOutlines.forEach(o => o.domNode.setAttribute('fill', this.#input.domNode.value.toLowerCase()));

    this.refresh();
  }
}

class FillOpacityField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input = new AttributeInput(targetApp, 'fill-opacity');

    this.#field = new TextInputField('Fill Opacity', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/fill-opacity';

    $(this.domNode).css({ marginTop: '12px', alignSelf: 'start' });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    this.#input.refresh();
  }
}

class StrokeField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input = new AttributeInput(targetApp, 'stroke');

    this.#field = new TextInputField('Stroke', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke';

    $(this.domNode).css({ marginTop: '10px', alignSelf: 'start' });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    this.#input.refresh();
  }
}

class StrokeColorField {
  #targetApp;

  #input = new ColorInput();

  #field;

  /**
   * Used to determine whether to push the undo stack or not.
   */
  #previousState: unknown;

  /**
   * The value of the color input when last focused.
   */
  #lastFocusValue?: string;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input.domNode.addEventListener('input', () => this.#handleInput());

    this.#field = new ColorField('Stroke Color', this.#input.domNode);

    $(this.domNode).css({ marginTop: '12px', alignSelf: 'start' });

    this.#targetApp.selectedOutlines.addEventListener('change', () => this.#previousState = undefined);

    this.#input.domNode.addEventListener('focus', () => this.#lastFocusValue = this.#input.domNode.value);

    // only refresh if necessary
    this.#targetApp.selectedOutlines.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh() : {});

    // only refresh if necessary
    let drawingObserver = new MutationObserver(() => document.body.contains(this.domNode) ? this.refresh() : {});
    drawingObserver.observe(this.#targetApp.drawing.domNode, { attributes: true, attributeFilter: ['stroke'], subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    let selectedOutlines = [...this.#targetApp.selectedOutlines];

    if (selectedOutlines.length == 0) {
      this.#input.domNode.value = '#000000';
      return;
    }

    try {
      // this line of code assumes that `window.getComputedStyle()` returns color values in RGB format
      let strokes = selectedOutlines.map(b => window.getComputedStyle(b.domNode).stroke);

      // note that the `Color` class cannot handle keyword colors (e.g., "red", "magenta", "azure")
      let colors = strokes.map(s => new Color(s));

      this.#input.domNode.value = consensusValue(colors.map(c => c.toHex().toLowerCase()));
    } catch {
      this.#input.domNode.value = '#000000';
    }
  }

  #handleInput(): void {
    if (this.#input.domNode.value === this.#lastFocusValue) {
      // in Firefox an input event is fired when just opening a color input
      return;
    }

    let selectedOutlines = [...this.#targetApp.selectedOutlines];

    if (selectedOutlines.length == 0) {
      this.refresh();
      return;
    }

    if (selectedOutlines.every(o => o.domNode.getAttribute('stroke')?.toLowerCase() === this.#input.domNode.value.toLowerCase())) {
      this.refresh();
      return;
    }

    if (this.#targetApp.undoStack.isEmpty() || this.#targetApp.undoStack.peek() !== this.#previousState) {
      this.#targetApp.pushUndoStack();

      this.#previousState = this.#targetApp.undoStack.peek();
    }

    selectedOutlines.forEach(o => o.domNode.setAttribute('stroke', this.#input.domNode.value.toLowerCase()));

    this.refresh();
  }
}

class StrokeOpacityField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input = new AttributeInput(targetApp, 'stroke-opacity');

    this.#field = new TextInputField('Stroke Opacity', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke-opacity';

    $(this.domNode).css({ marginTop: '12px', alignSelf: 'start' });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    this.#input.refresh();
  }
}

class StrokeWidthField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input = new AttributeInput(targetApp, 'stroke-width');

    this.#field = new TextInputField('Stroke Width', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke-width';

    $(this.domNode).css({ marginTop: '10px', alignSelf: 'start' });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    this.#input.refresh();
  }
}

class StrokeDasharrayField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input = new AttributeInput(targetApp, 'stroke-dasharray');

    this.#field = new TextInputField('Stroke Dash-Array', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke-dasharray';

    $(this.domNode).css({ marginTop: '10px', alignSelf: 'start' });

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
  #targetApp;

  #attributeName;

  #input = new TextInput({ onSubmit: () => this.#submit() });

  constructor(targetApp: App, attributeName: string) {
    this.#targetApp = targetApp;

    this.#attributeName = attributeName;

    // only refresh when necessary
    this.#targetApp.selectedOutlines.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh() : {});

    // only refresh when necessary
    let drawingObserver = new MutationObserver(() => document.body.contains(this.domNode) ? this.refresh() : {});
    drawingObserver.observe(this.#targetApp.drawing.domNode, { attributes: true, subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#input.domNode;
  }

  refresh(): void {
    let selectedOutlines = [...this.#targetApp.selectedOutlines];

    try {
      this.#input.domNode.value = consensusValue(selectedOutlines.map(o => o.domNode.getAttribute(this.#attributeName) ?? ''));
    } catch {
      this.#input.domNode.value = '';
    }
  }

  #submit() {
    let value = this.#input.domNode.value;

    let selectedOutlines = [...this.#targetApp.selectedOutlines];

    if (selectedOutlines.length == 0 || selectedOutlines.every(o => o.domNode.getAttribute(this.#attributeName) === value)) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedOutlines.forEach(o => o.domNode.setAttribute(this.#attributeName, value));

    this.refresh();
  }
}
