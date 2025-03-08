import type { App } from './App';

import type  { Nucleobase } from './Nucleobase';

import * as styles from './BasesSection.module.css';

import { TextInput } from './TextInput';

import { TextInputField } from './TextInputField';

import { Checkbox } from './Checkbox';

import { CheckboxField } from './CheckboxField';

import { ColorInput } from './ColorInput';

import { ColorField } from './ColorField';

import { Color } from '@svgdotjs/svg.js';

import { consensusValue } from '@rnacanvas/consensize';

import * as $ from 'jquery';


/**
 * The section for editing bases.
 */
export class BasesSection {
  readonly domNode = document.createElement('div');

  #numBasesSelected;

  #textContentField;
  #fillField;
  #fillColorField;
  #fillOpacityField;
  #fontFamilyField;
  #fontSizeField;
  #fontWeightField;
  #boldField;
  #fontStyleField;
  #textDecorationField;
  #underlinedField;

  constructor(targetApp: App) {
    this.domNode.classList.add(styles['bases-section']);

    this.#numBasesSelected = new NumBasesSelected(targetApp);
    this.domNode.append(this.#numBasesSelected.domNode);

    this.#textContentField = new TextContentField(targetApp);
    this.domNode.append(this.#textContentField.domNode);

    this.#fillField = new FillField(targetApp);
    this.domNode.append(this.#fillField.domNode);

    this.#fillColorField = new FillColorField(targetApp);
    this.domNode.append(this.#fillColorField.domNode);

    this.#fillOpacityField = new FillOpacityField(targetApp);
    this.domNode.append(this.#fillOpacityField.domNode);

    this.#fontFamilyField = new FontFamilyField(targetApp);
    this.domNode.append(this.#fontFamilyField.domNode);

    this.#fontSizeField = new FontSizeField(targetApp);
    this.domNode.append(this.#fontSizeField.domNode);

    this.#fontWeightField = new FontWeightField(targetApp);
    this.domNode.append(this.#fontWeightField.domNode);

    this.#boldField = new BoldField(targetApp);
    this.domNode.append(this.#boldField.domNode);

    this.#fontStyleField = new FontStyleField(targetApp);
    this.domNode.append(this.#fontStyleField.domNode);

    this.#textDecorationField = new TextDecorationField(targetApp);
    this.domNode.append(this.#textDecorationField.domNode);

    this.#underlinedField = new UnderlinedField(targetApp);
    this.domNode.append(this.#underlinedField.domNode);
  }

  get #refreshableComponents() {
    return [
      this.#numBasesSelected,
      this.#textContentField,
      this.#fillField,
      this.#fillColorField,
      this.#fillOpacityField,
      this.#fontFamilyField,
      this.#fontSizeField,
      this.#fontWeightField,
      this.#boldField,
      this.#fontStyleField,
      this.#textDecorationField,
      this.#underlinedField,
    ];
  }

  refresh(): void {
    this.#refreshableComponents.forEach(comp => comp.refresh());
  }
}

/**
 * A component that shows the number of bases currently selected.
 */
class NumBasesSelected {
  #targetApp;

  readonly domNode = document.createElement('p');

  #numSpan = document.createElement('span');

  #trailingTextSpan = document.createElement('span');

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['num-bases-selected']);

    this.#numSpan.style.fontWeight = '700';

    this.domNode.append(this.#numSpan, this.#trailingTextSpan);

    // only refresh when necessary
    this.#targetApp.selectedBases.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh() : {});

    this.refresh();
  }

  refresh(): void {
    let numBasesSelected = [...this.#targetApp.selectedBases].length;

    this.#numSpan.textContent = `${numBasesSelected}`;

    this.#trailingTextSpan.textContent = numBasesSelected == 1 ? ' base is selected.' : ' bases are selected.';
  }
}

class TextContentField {
  #targetApp;

  #input = new TextInput({ onSubmit: () => this.#submit() });

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#field = new TextInputField('Text Content', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent';

    $(this.domNode).css({ marginTop: '15px', alignSelf: 'start' });

    // only refresh when necessary
    this.#targetApp.selectedBases.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh() : {});

    // only refresh when necessary
    let drawingObserver = new MutationObserver(() => document.body.contains(this.domNode) ? this.refresh() : {});
    drawingObserver.observe(this.#targetApp.drawing.domNode, { characterData: true, subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    let selectedBases = [...this.#targetApp.selectedBases];

    try {
      this.#input.domNode.value = consensusValue(selectedBases.map(b => b.textContent ?? ''));
    } catch {
      this.#input.domNode.value = '';
    }
  }

  #submit(): void {
    let textContent = this.#input.domNode.value ?? '';

    // don't forget to trim leading and trailing whitespace
    textContent = textContent.trim();

    // don't assign bases empty text content
    if (!textContent) {
      this.refresh();
      return;
    }

    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0 || selectedBases.every(b => b.textContent === textContent)) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedBases.forEach(b => b.maintainingCenterPoint(() => b.textContent = textContent));

    this.refresh();
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

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill';

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

    this.#targetApp.selectedBases.addEventListener('change', () => this.#previousState = undefined);

    this.#input.domNode.addEventListener('focus', () => this.#lastFocusValue = this.#input.domNode.value);

    // only refresh if necessary
    this.#targetApp.selectedBases.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh() : {});

    // only refresh if necessary
    let drawingObserver = new MutationObserver(() => document.body.contains(this.domNode) ? this.refresh() : {});
    drawingObserver.observe(this.#targetApp.drawing.domNode, { attributes: true, attributeFilter: ['fill'], subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0) {
      this.#input.domNode.value = '#000000';
      return;
    }

    try {
      // fill color values in RGB format
      let fills = selectedBases.map(b => window.getComputedStyle(b.domNode).fill);

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

    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0) {
      this.refresh();
      return;
    }

    if (selectedBases.every(b => b.getAttribute('fill')?.toLowerCase() === this.#input.domNode.value.toLowerCase())) {
      this.refresh();
      return;
    }

    if (this.#targetApp.undoStack.isEmpty() || this.#targetApp.undoStack.peek() !== this.#previousState) {
      this.#targetApp.pushUndoStack();

      this.#previousState = this.#targetApp.undoStack.peek();
    }

    selectedBases.forEach(b => b.setAttribute('fill', this.#input.domNode.value.toLowerCase()));

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

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill-opacity';

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

class FontFamilyField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input = new AttributeInput(targetApp, 'font-family');

    this.#field = new TextInputField('Font Family', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-family';

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

class FontSizeField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input = new AttributeInput(targetApp, 'font-size');

    this.#field = new TextInputField('Font Size', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-size';

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

class FontWeightField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input = new AttributeInput(targetApp, 'font-weight');

    this.#field = new TextInputField('Font Weight', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-weight';

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

class BoldField {
  #targetApp;

  #input = new Checkbox();

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input.domNode.addEventListener('change', () => this.#handleChange());

    this.#field = new CheckboxField('Bold', this.#input.domNode);

    $(this.domNode).css({ marginTop: '12px', alignSelf: 'start' });

    // only refresh when necessary
    this.#targetApp.selectedBases.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh() : {});

    // only refresh when necessary
    let drawingObserver = new MutationObserver(() => document.body.contains(this.domNode) ? this.refresh() : {});
    drawingObserver.observe(this.#targetApp.drawing.domNode, { attributes: true, attributeFilter: ['font-weight'], subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0) {
      this.#input.domNode.checked = false;
    } else {
      this.#input.domNode.checked = selectedBases.every(isBold);
    }
  }

  #handleChange() {
    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0) {
      this.refresh();
      return;
    }

    if (this.#input.domNode.checked && selectedBases.every(isBold)) {
      this.refresh();
      return;
    } else if (!this.#input.domNode.checked && selectedBases.every(isNotBold)) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedBases.forEach(b => {
      b.maintainingCenterPoint(() => {
        if (this.#input.domNode.checked && isNotBold(b)) {
          b.setAttribute('font-weight', '700');
        } else if (!this.#input.domNode.checked && isBold(b)) {
          b.setAttribute('font-weight', '400');
        }
      });
    });

    this.refresh();

    // release focus so that key bindings for the app can work
    this.#input.domNode.blur();
  }
}

function isBold(b: Nucleobase): boolean {
  let fontWeight = b.getAttribute('font-weight');

  if (fontWeight === null) {
    return false;
  }

  let n = Number.parseFloat(fontWeight);

  if (!Number.isNaN(n)) {
    return n >= 700;
  }

  return fontWeight.toLowerCase() === 'bold';
}

function isNotBold(b: Nucleobase): boolean {
  return !isBold(b);
}

class FontStyleField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input = new AttributeInput(targetApp, 'font-style');

    this.#field = new TextInputField('Font Style', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-style';

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

class TextDecorationField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input = new AttributeInput(targetApp, 'text-decoration');

    this.#field = new TextInputField('Text Decoration', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-decoration';

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

class UnderlinedField {
  #targetApp;

  #input = new Checkbox();

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input.domNode.addEventListener('change', () => this.#handleChange());

    this.#field = new CheckboxField('Underlined', this.#input.domNode);

    $(this.domNode).css({ marginTop: '12px', alignSelf: 'start' });

    // only refresh when necessary
    this.#targetApp.selectedBases.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh() : {});

    // only refresh when necessary
    let drawingObserver = new MutationObserver(() => document.body.contains(this.domNode) ? this.refresh() : {});
    drawingObserver.observe(this.#targetApp.drawing.domNode, { attributes: true, attributeFilter: ['text-decoration'], subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0) {
      this.#input.domNode.checked = false;
    } else {
      this.#input.domNode.checked = selectedBases.every(isUnderlined);
    }
  }

  #handleChange() {
    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0) {
      this.refresh();
      return;
    }

    if (this.#input.domNode.checked && selectedBases.every(isUnderlined)) {
      this.refresh();
      return;
    } else if (!this.#input.domNode.checked && selectedBases.every(isNotUnderlined)) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedBases.forEach(b => {
      b.maintainingCenterPoint(() => {
        if (this.#input.domNode.checked && isNotUnderlined(b)) {
          b.setAttribute('text-decoration', 'underline');
        } else if (!this.#input.domNode.checked && isUnderlined(b)) {
          b.setAttribute('text-decoration', '');
        }
      });
    });

    this.refresh();

    // release focus so that key bindings for the app can work
    this.#input.domNode.blur();
  }
}

function isUnderlined(b: Nucleobase): boolean {
  let textDecoration = b.getAttribute('text-decoration');

  if (textDecoration === null) {
    return false;
  }

  let items = textDecoration.split(/\s/);

  return items.map(item => item.toLowerCase()).includes('underline');
}

function isNotUnderlined(b: Nucleobase): boolean {
  return !isUnderlined(b);
}

class AttributeInput {
  #targetApp;

  #attributeName;

  #input = new TextInput({ onSubmit: () => this.#submit() });

  constructor(targetApp: App, attributeName: string) {
    this.#targetApp = targetApp;

    this.#attributeName = attributeName;

    // only refresh when necessary
    this.#targetApp.selectedBases.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh() : {});

    // only refresh when necessary
    let drawingObserver = new MutationObserver(() => document.body.contains(this.domNode) ? this.refresh() : {});
    drawingObserver.observe(this.#targetApp.drawing.domNode, { attributes: true, subtree: true });

    this.refresh();
  }

  get domNode() {
    return this.#input.domNode;
  }

  refresh(): void {
    let selectedBases = [...this.#targetApp.selectedBases];

    try {
      this.#input.domNode.value = consensusValue(selectedBases.map(b => b.getAttribute(this.#attributeName) ?? ''));
    } catch {
      this.#input.domNode.value = '';
    }
  }

  #submit() {
    let value = this.#input.domNode.value;

    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0 || selectedBases.every(b => b.getAttribute(this.#attributeName) === value)) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedBases.forEach(b => b.maintainingCenterPoint(() => b.setAttribute(this.#attributeName, value)));

    this.refresh();
  }
}
