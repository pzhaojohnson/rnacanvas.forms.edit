import type { App } from './App';

import type { Nucleobase } from '@rnacanvas/draw.bases';

import * as styles from './BasesSection.module.css';

import { SectionHeader } from './SectionHeader';

import { TextButton } from './TextButton';

import { TextInput } from './TextInput';

import { TextInputField } from './TextInputField';

import { Checkbox } from './Checkbox';

import { CheckboxField } from './CheckboxField';

import { ColorInput } from './ColorInput';

import { ColorField } from './ColorField';

import { Color } from '@svgdotjs/svg.js';

import { consensusValue } from '@rnacanvas/consensize';

import { bringToFront, sendToBack } from '@rnacanvas/draw.svg';

import * as $ from 'jquery';

/**
 * The section for editing bases.
 */
export class BasesSection {
  #targetApp;

  readonly domNode = document.createElement('div');

  #header = new Header();

  #content = document.createElement('div');

  #numBasesSelected;

  #selectionTools;

  #bottomContent = document.createElement('div');

  #zSection;
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
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['bases-section']);

    this.#header.domNode.addEventListener('click', () => this.domNode.classList.toggle(styles['open']));
    this.domNode.append(this.#header.domNode);

    this.#content.classList.add(styles['content']);
    this.domNode.append(this.#content);

    this.#numBasesSelected = new NumBasesSelected(targetApp);
    this.#content.append(this.#numBasesSelected.domNode);

    this.#selectionTools = new SelectionTools(targetApp);
    this.#content.append(this.#selectionTools.domNode);

    this.#bottomContent.classList.add(styles['bottom-content']);
    this.#content.append(this.#bottomContent);

    // only refresh when necesary
    targetApp.selectedBases.addEventListener('change', () => {
      if (document.body.contains(this.domNode)) {
        [...targetApp.selectedBases].length > 0 ? this.#showBottomContent() : this.#hideBottomContent();
      }
    });

    this.#zSection = new ZSection(targetApp);
    this.#bottomContent.append(this.#zSection.domNode);

    this.#textContentField = new TextContentField(targetApp);
    this.#bottomContent.append(this.#textContentField.domNode);

    this.#fillField = new FillField(targetApp);
    this.#bottomContent.append(this.#fillField.domNode);

    this.#fillColorField = new FillColorField(targetApp);
    this.#bottomContent.append(this.#fillColorField.domNode);

    this.#fillOpacityField = new FillOpacityField(targetApp);
    this.#bottomContent.append(this.#fillOpacityField.domNode);

    this.#fontFamilyField = new FontFamilyField(targetApp);
    this.#bottomContent.append(this.#fontFamilyField.domNode);

    this.#fontSizeField = new FontSizeField(targetApp);
    this.#bottomContent.append(this.#fontSizeField.domNode);

    this.#fontWeightField = new FontWeightField(targetApp);
    this.#bottomContent.append(this.#fontWeightField.domNode);

    this.#boldField = new BoldField(targetApp);
    this.#bottomContent.append(this.#boldField.domNode);

    this.#fontStyleField = new FontStyleField(targetApp);
    this.#bottomContent.append(this.#fontStyleField.domNode);

    this.#textDecorationField = new TextDecorationField(targetApp);
    this.#bottomContent.append(this.#textDecorationField.domNode);

    this.#underlinedField = new UnderlinedField(targetApp);
    this.#bottomContent.append(this.#underlinedField.domNode);
  }

  get #refreshableComponents() {
    return [
      this.#numBasesSelected,
      this.#selectionTools,
      this.#zSection,
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

    [...this.#targetApp.selectedBases].length > 0 ? this.#showBottomContent() : this.#hideBottomContent();
  }

  #showBottomContent() {
    this.#bottomContent.style.display = 'block';
  }

  #hideBottomContent() {
    this.#bottomContent.style.display = 'none';
  }
}

class Header {
  readonly domNode = document.createElement('div');

  #caret = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  #text = document.createElement('p');

  constructor() {
    this.domNode.classList.add(styles['header']);

    this.#caret.classList.add(styles['header-caret']);
    this.#caret.setAttribute('viewBox', '0 0 6 10');
    this.#caret.setAttribute('width', '6');
    this.#caret.setAttribute('height', '10');

    this.#caret.innerHTML = `
      <path
        d="M 1 1 L 5 5 L 1 9"
        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        fill="none"
      ></path>
    `;

    this.domNode.append(this.#caret);

    this.#text.classList.add(styles['header-text']);
    this.#text.textContent = 'Bases';
    this.domNode.append(this.#text);
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

class SelectionTools {
  #targetApp;

  readonly domNode = document.createElement('div');

  #label = new SectionHeader();

  #hidableButtons = document.createElement('div');

  #buttons = {
    'All': new TextButton('All', () => this.#selectAll()),
    'None': new TextButton('None', () => this.#selectNone()),

    'A': new TextButton('A', () => this.#selectByTextContent('A')),
    'U': new TextButton('U', () => this.#selectByTextContent('U')),
    'G': new TextButton('G', () => this.#selectByTextContent('G')),
    'C': new TextButton('C', () => this.#selectByTextContent('C')),
    'T': new TextButton('T', () => this.#selectByTextContent('T')),

    'a': new TextButton('a', () => this.#selectByTextContent('a')),
    'u': new TextButton('u', () => this.#selectByTextContent('u')),
    'g': new TextButton('g', () => this.#selectByTextContent('g')),
    'c': new TextButton('c', () => this.#selectByTextContent('c')),
    't': new TextButton('t', () => this.#selectByTextContent('t')),

    'Outlined': new TextButton('Outlined', () => this.#selectOutlined()),

    'Paired': new TextButton('Paired', () => this.#selectPaired()),
    'Unpaired': new TextButton('Unpaired', () => this.#selectUnpaired()),
  };

  #drawingObserver;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['selection-tools']);

    this.#label.textContent = 'Select:';
    this.#label.domNode.addEventListener('click', () => this.#toggle());
    this.domNode.append(this.#label.domNode);

    let buttonsContainer = document.createElement('div');
    $(buttonsContainer).css({ marginTop: '1.5px', display: 'flex', flexDirection: 'column', gap: '6px' });
    this.domNode.append(buttonsContainer);

    let topRow = document.createElement('div');
    $(topRow).css({ display: 'flex', flexDirection: 'row', gap: '23px' });
    topRow.append(...(['All', 'None'] as const).map(name => this.#buttons[name].domNode));
    buttonsContainer.append(topRow);

    $(this.#hidableButtons).css({ display: 'flex', flexDirection: 'column', gap: '6px' });
    buttonsContainer.append(this.#hidableButtons);

    // hide by default
    this.#hidableButtons.style.display = 'none';
    this.#label.caret.pointRight();

    let upperCaseButtons = document.createElement('div');
    $(upperCaseButtons).css({ display: 'flex', flexDirection: 'row', gap: '17px' });
    upperCaseButtons.append(...(['A', 'U', 'G', 'C', 'T'] as const).map(letter => this.#buttons[letter].domNode))
    this.#hidableButtons.append(upperCaseButtons);

    let lowerCaseButtons = document.createElement('div');
    $(lowerCaseButtons).css({ display: 'flex', flexDirection: 'row', gap: '18px' });
    lowerCaseButtons.append(...(['a', 'u', 'g', 'c', 't'] as const).map(letter => this.#buttons[letter].domNode))
    this.#hidableButtons.append(lowerCaseButtons);

    this.#hidableButtons.append(this.#buttons['Outlined'].domNode);

    let secondaryStructureButtons = document.createElement('div');
    $(secondaryStructureButtons).css({ display: 'flex', flexDirection: 'row', gap: '18px' });
    secondaryStructureButtons.append(...(['Paired', 'Unpaired'] as const).map(name => this.#buttons[name].domNode));
    this.#hidableButtons.append(secondaryStructureButtons);

    // only refresh when the Editing form is open
    targetApp.selectedBases.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh(): {});
    targetApp.selectedOutlines.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh(): {});

    // only refresh when the Editing form is open
    this.#drawingObserver = new MutationObserver(() => document.body.contains(this.domNode) ? this.refresh(): {});

    // watch for the addition and removal of elements
    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, subtree: true });

    this.refresh();
  }

  #toggle() {
    let isOpen = this.#hidableButtons.style.display != 'none';

    this.#hidableButtons.style.display = isOpen ? 'none' : 'flex';
    isOpen ? this.#label.caret.pointRight() : this.#label.caret.pointDown();
  }

  #selectAll() {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.bases]);
  }

  #selectNone() {
    this.#targetApp.removeFromSelected([...this.#targetApp.drawing.bases]);
  }

  #selectByTextContent(textContent: string) {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.bases].filter(b => b.domNode.textContent == textContent));
  }

  #selectOutlined() {
    this.#targetApp.addToSelected([...this.#targetApp.selectedOutlines].map(o => o.owner));
  }

  #selectPaired() {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.secondaryBonds].flatMap(sb => [sb.base1, sb.base2]));
  }

  #selectUnpaired() {
    // all paired bases
    let paired = new Set([...this.#targetApp.drawing.secondaryBonds].flatMap(sb => [sb.base1, sb.base2]));

    this.#targetApp.addToSelected([...this.#targetApp.drawing.bases].filter(b => !paired.has(b)));
  }

  refresh(): void {
    let allBases = [...this.#targetApp.drawing.bases];

    let pairedBases = new Set([...this.#targetApp.drawing.secondaryBonds].flatMap(sb => [sb.base1, sb.base2]));
    let unpairedBases = allBases.filter(b => !pairedBases.has(b));

    let selectedBases = new Set(this.#targetApp.selectedBases);
    let selectedOutlines = [...this.#targetApp.selectedOutlines];

    if (allBases.length == 0) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = 'There are no bases in the drawing.';
    } else if (selectedBases.size == allBases.length) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = 'All bases are already selected.';
    } else {
      this.#buttons['All'].enable();
      this.#buttons['All'].tooltip.textContent = 'Select all bases.';
    }

    if (selectedBases.size == 0) {
      this.#buttons['None'].disable();
      this.#buttons['None'].tooltip.textContent = 'No bases are selected.';
    } else {
      this.#buttons['None'].enable();
      this.#buttons['None'].tooltip.textContent = 'Deselect all bases.';
    }

    (['A', 'U', 'G', 'C', 'T', 'a', 'u', 'g', 'c', 't'] as const).forEach(letter => {
      let bases = allBases.filter(b => b.textContent == letter);
      let button = this.#buttons[letter];

      if (bases.length == 0) {
        button.disable();
        button.tooltip.textContent = `No bases have the letter "${letter}".`;
      } else if (bases.every(b => selectedBases.has(b))) {
        button.disable();
        button.tooltip.textContent = `All bases with the letter "${letter}" are already selected.`;
      } else {
        button.enable();
        button.tooltip.textContent = `Select all bases with the letter "${letter}".`;
      }
    });

    if (selectedOutlines.length == 0) {
      this.#buttons['Outlined'].disable();
      this.#buttons['Outlined'].tooltip.textContent = 'No outlines are selected.';
    } else if (selectedOutlines.map(o => o.owner).every(b => selectedBases.has(b))) {
      this.#buttons['Outlined'].disable();
      this.#buttons['Outlined'].tooltip.textContent = 'All bases outlined by the selected outlines are already selected.';
    } else {
      this.#buttons['Outlined'].enable();
      this.#buttons['Outlined'].tooltip.textContent = 'Select bases outlined by the selected outlines.';
    }

    if (pairedBases.size == 0) {
      this.#buttons['Paired'].disable();
      this.#buttons['Paired'].tooltip.textContent = 'There are no paired bases in the drawing.';
    } else if ([...pairedBases].every(b => selectedBases.has(b))) {
      this.#buttons['Paired'].disable();
      this.#buttons['Paired'].tooltip.textContent = 'All paired bases are already selected.';
    } else {
      this.#buttons['Paired'].enable();
      this.#buttons['Paired'].tooltip.textContent = 'Select all paired bases.';
    }

    if (unpairedBases.length == 0) {
      this.#buttons['Unpaired'].disable();
      this.#buttons['Unpaired'].tooltip.textContent = 'There are no unpaired bases in the drawing.';
    } else if (unpairedBases.every(b => selectedBases.has(b))) {
      this.#buttons['Unpaired'].disable();
      this.#buttons['Unpaired'].tooltip.textContent = 'All unpaired bases are already selected.';
    } else {
      this.#buttons['Unpaired'].enable();
      this.#buttons['Unpaired'].tooltip.textContent = 'Select all unpaired bases.';
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
    this.#frontButton.domNode.style.marginLeft = '26px';
    this.domNode.append(this.#frontButton.domNode);

    this.#backButton.domNode.addEventListener('click', () => this.#sendToBack());
    this.#backButton.textContent = 'Back';
    this.#backButton.domNode.style.marginLeft = '28px';
    this.domNode.append(this.#backButton.domNode);

    // only refresh when necessary
    targetApp.selectedBases.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh() : {});

    this.refresh();
  }

  #bringToFront(): void {
    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedBases.forEach(b => bringToFront(b.domNode));
  }

  #sendToBack(): void {
    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0) {
      this.refresh();
      return;
    }

    this.#targetApp.pushUndoStack();

    selectedBases.forEach(b => sendToBack(b.domNode));
  }

  refresh(): void {
    this.#refreshFrontButton();

    this.#refreshBackButton();
  }

  #refreshFrontButton(): void {
    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0) {
      this.#frontButton.disable();
      this.#frontButton.tooltip.textContent = 'No bases are selected.';
    } else {
      this.#frontButton.enable();
      this.#frontButton.tooltip.textContent = 'Bring the selected bases to the front.';
    }
  }

  #refreshBackButton(): void {
    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0) {
      this.#backButton.disable();
      this.#backButton.tooltip.textContent = 'No bases are selected.';
    } else {
      this.#backButton.enable();
      this.#backButton.tooltip.textContent = 'Send the selected bases to the back.';
    }
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

    this.domNode.style.marginTop = '22px';
    this.domNode.style.alignSelf = 'start';

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

class FontSizeField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input = new AttributeInput(targetApp, 'font-size');

    this.#field = new TextInputField('Font Size', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-size';

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

class FontWeightField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input = new AttributeInput(targetApp, 'font-weight');

    this.#field = new TextInputField('Font Weight', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-weight';

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
