import type { App } from './App';

import { BasePair } from '@rnacanvas/draw.bases';

import type { SecondaryBond } from './SecondaryBond';

import * as styles from './SecondaryBondsSection.module.css';

import { SectionHeader } from './SectionHeader';

import { TextButton } from './TextButton';

import { ZSection as _ZSection } from './ZSection';

import { AttributeInput } from './AttributeInput';

import { TextInputField } from './TextInputField';

import { ColorAttributeInput } from './ColorAttributeInput';

import { ColorField } from './ColorField';

import * as $ from 'jquery';

export class SecondaryBondsSection {
  #targetApp;

  readonly domNode = document.createElement('div');

  #header = new SectionHeader('Secondary Bonds', () => this.toggle());

  #content = document.createElement('div');

  #numSelected;
  #selectionTools;

  #bottomContent = document.createElement('div');

  #zSection;
  #strokeField;
  #strokeColorField;
  #strokeOpacityField;
  #strokeWidthField;
  #strokeLinecapField;
  #strokeDasharrayField;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['secondary-bonds-section']);

    this.domNode.append(this.#header.domNode);

    this.#content.classList.add(styles['content']);
    this.domNode.append(this.#content);

    this.#numSelected = new NumSelected(targetApp);
    this.#content.append(this.#numSelected.domNode);

    this.#selectionTools = new SelectionTools(targetApp);
    this.#content.append(this.#selectionTools.domNode);

    this.#bottomContent.classList.add(styles['bottom-content']);
    this.#content.append(this.#bottomContent);

    // only refresh when necessary
    targetApp.selectedSecondaryBonds.addEventListener('change', () => {
      if (document.body.contains(this.domNode)) {
        [...targetApp.selectedSecondaryBonds].length == 0 ? this.#hideBottomContent() : this.#showBottomContent();
      }
    });

    this.#zSection = new ZSection(targetApp);
    this.#bottomContent.append(this.#zSection.domNode);

    this.#strokeField = new StrokeField(targetApp);
    this.#bottomContent.append(this.#strokeField.domNode);

    this.#strokeColorField = new StrokeColorField(targetApp);
    this.#bottomContent.append(this.#strokeColorField.domNode);

    this.#strokeOpacityField = new StrokeOpacityField(targetApp);
    this.#bottomContent.append(this.#strokeOpacityField.domNode);

    this.#strokeWidthField = new StrokeWidthField(targetApp);
    this.#bottomContent.append(this.#strokeWidthField.domNode);

    this.#strokeLinecapField = new StrokeLinecapField(targetApp);
    this.#bottomContent.append(this.#strokeLinecapField.domNode);

    this.#strokeDasharrayField = new StrokeDasharrayField(targetApp);
    this.#bottomContent.append(this.#strokeDasharrayField.domNode);

    this.collapse();

    this.refresh();
  }

  isCollapsed(): boolean {
    return this.domNode.classList.contains(styles['collapsed']);
  }

  collapse(): void {
    this.domNode.classList.add(styles['collapsed']);
    this.#header.caret.pointRight();
  }

  expand(): void {
    this.domNode.classList.remove(styles['collapsed']);
    this.#header.caret.pointDown();
  }

  toggle(): void {
    this.isCollapsed() ? this.expand() : this.collapse();
  }

  refresh(): void {
    this.#refreshableComponents.forEach(component => component.refresh());

    [...this.#targetApp.selectedSecondaryBonds].length == 0 ? this.#hideBottomContent() : this.#showBottomContent();
  }

  get #refreshableComponents() {
    return [
      this.#numSelected,
      this.#selectionTools,
      this.#zSection,
      this.#strokeField,
      this.#strokeColorField,
      this.#strokeOpacityField,
      this.#strokeWidthField,
      this.#strokeLinecapField,
      this.#strokeDasharrayField,
    ];
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
    this.#targetApp.selectedSecondaryBonds.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    this.refresh();
  }

  refresh(): void {
    let num = [...this.#targetApp.selectedSecondaryBonds].length;

    this.#num.textContent = `${num}`;

    this.#trailingText.textContent = num == 1 ? ' secondary bond is selected.' : ' secondary bonds are selected.';
  }
}

class SelectionTools {
  #targetApp;

  readonly domNode = document.createElement('div');

  #toggle = new SectionHeader('Select:', () => this.toggle());

  #buttons = {
    'All': new TextButton('All', () => this.#selectAll()),
    'None': new TextButton('None', () => this.#deselectAll()),

    'Between': new TextButton('Between', () => this.#selectBetween()),
    'Connecting': new TextButton('Connecting', () => this.#selectConnecting()),

    'A:U': new TextButton('A:U', () => this.#selectAU()),
    'A:T': new TextButton('A:T', () => this.#selectAT()),
    'G:C': new TextButton('G:C', () => this.#selectGC()),
    'G:U': new TextButton('G:U', () => this.#selectGU()),
    'G:T': new TextButton('G:T', () => this.#selectGT()),
  };

  #buttonsContainer = document.createElement('div');

  #alwaysVisibleButtons = document.createElement('div');

  #sometimesHiddenButtons = document.createElement('div');

  #drawingObserver;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['selection-tools']);

    this.domNode.append(this.#toggle.domNode);

    $(this.#buttonsContainer).css({ marginTop: '1.5px', display: 'flex', flexDirection: 'column', gap: '12px' });
    this.domNode.append(this.#buttonsContainer);

    $(this.#alwaysVisibleButtons).css({ display: 'flex', flexDirection: 'row', gap: '27px' });
    this.#alwaysVisibleButtons.append(...(['All', 'None'] as const).map(name => this.#buttons[name].domNode));
    this.#buttonsContainer.append(this.#alwaysVisibleButtons);

    $(this.#sometimesHiddenButtons).css({ display: 'flex', flexDirection: 'column', gap: '12px' });
    this.#buttonsContainer.append(this.#sometimesHiddenButtons);

    // hide by default
    this.#sometimesHiddenButtons.style.display = 'none';
    this.#toggle.caret.pointRight();

    let row2 = document.createElement('div');
    $(row2).css({ display: 'flex', flexDirection: 'row', gap: '20px' });
    row2.append(...(['Between', 'Connecting'] as const).map(name => this.#buttons[name].domNode));
    this.#sometimesHiddenButtons.append(row2);

    let row3 = document.createElement('div');
    $(row3).css({ display: 'flex', flexDirection: 'row', gap: '12px' });
    row3.append(...(['A:U', 'G:C', 'G:U', 'A:T', 'G:T'] as const).map(name => this.#buttons[name].domNode));
    this.#sometimesHiddenButtons.append(row3);

    // only refresh when the Editing form is open
    targetApp.selectedSecondaryBonds.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh() : {});
    targetApp.selectedBases.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh(): {});

    // only refresh when the Editing form is open
    this.#drawingObserver = new MutationObserver(() => document.body.contains(this.domNode) ? this.refresh() : {});

    // watch for the addition / removal of elements and changes to the text contents of bases
    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, characterData: true, subtree: true });

    this.refresh();
  }

  toggle(): void {
    this.isCollapsed() ? this.expand() : this.collapse();
  }

  isCollapsed(): boolean {
    return this.#sometimesHiddenButtons.style.display == 'none';
  }

  collapse(): void {
    this.#sometimesHiddenButtons.style.display = 'none';
    this.#toggle.caret.pointRight();
  }

  expand(): void {
    this.#sometimesHiddenButtons.style.display = 'flex';
    this.#toggle.caret.pointDown();
  }

  #selectAll(): void {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.secondaryBonds])
  }

  #deselectAll(): void {
    this.#targetApp.removeFromSelected([...this.#targetApp.drawing.secondaryBonds]);
  }

  #selectBetween(): void {
    this.#targetApp.addToSelected(this.#between);
  }

  /**
   * All secondary bonds between the selected bases.
   */
  get #between() {
    let selectedBases = new Set(this.#targetApp.selectedBases);

    return [...this.#targetApp.drawing.secondaryBonds].filter(sb => selectedBases.has(sb.base1) && selectedBases.has(sb.base2));
  }

  #selectConnecting(): void {
    this.#targetApp.addToSelected(this.#connecting);
  }

  /**
   * All secondary bonds connecting the selected bases.
   */
  get #connecting() {
    let selectedBases = new Set(this.#targetApp.selectedBases);

    return [...this.#targetApp.drawing.secondaryBonds].filter(sb => selectedBases.has(sb.base1) || selectedBases.has(sb.base2));
  }

  #selectAU() {
    this.#targetApp.addToSelected(this.#AU);
  }

  /**
   * All A:U secondary bonds in the drawing of the target app.
   */
  get #AU() {
    return [...this.#targetApp.drawing.secondaryBonds].filter(isAU);
  }

  #selectAT() {
    this.#targetApp.addToSelected(this.#AT);
  }

  /**
   * All A:T secondary bonds in the drawing of the target app.
   */
  get #AT() {
    return [...this.#targetApp.drawing.secondaryBonds].filter(isAT);
  }

  #selectGC() {
    this.#targetApp.addToSelected(this.#GC);
  }

  /**
   * All G:C secondary bonds in the drawing of the target app.
   */
  get #GC() {
    return [...this.#targetApp.drawing.secondaryBonds].filter(isGC);
  }

  #selectGU() {
    this.#targetApp.addToSelected(this.#GU);
  }

  /**
   * All G:U secondary bonds in the drawing of the target app.
   */
  get #GU() {
    return [...this.#targetApp.drawing.secondaryBonds].filter(isGU);
  }

  #selectGT() {
    this.#targetApp.addToSelected(this.#GT);
  }

  /**
   * All G:T secondary bonds in the drawing of the target app.
   */
  get #GT() {
    return [...this.#targetApp.drawing.secondaryBonds].filter(isGT);
  }

  refresh(): void {
    let allSecondaryBonds = [...this.#targetApp.drawing.secondaryBonds];

    let selectedSecondaryBonds = new Set(this.#targetApp.selectedSecondaryBonds);

    if (allSecondaryBonds.length == 0) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = 'There are no secondary bonds in the drawing.';
    } else if (allSecondaryBonds.every(sb => selectedSecondaryBonds.has(sb))) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = 'All secondary bonds are already selected.';
    } else {
      this.#buttons['All'].enable();
      this.#buttons['All'].tooltip.textContent = 'Select all secondary bonds.';
    }

    if (selectedSecondaryBonds.size == 0) {
      this.#buttons['None'].disable();
      this.#buttons['None'].tooltip.textContent = 'No secondary bonds are selected.';
    } else {
      this.#buttons['None'].enable();
      this.#buttons['None'].tooltip.textContent = 'Deselect all secondary bonds.';
    }

    let selectedBases = [...this.#targetApp.selectedBases];

    let between = this.#between;

    if (selectedBases.length == 0) {
      this.#buttons['Between'].disable();
      this.#buttons['Between'].tooltip.textContent = 'No bases are selected.';
    } else if (between.every(sb => selectedSecondaryBonds.has(sb))) {
      this.#buttons['Between'].disable();
      this.#buttons['Between'].tooltip.textContent = 'All secondary bonds between the selected bases are already selected.';
    } else {
      this.#buttons['Between'].enable();
      this.#buttons['Between'].tooltip.textContent = 'Select secondary bonds between the selected bases.';
    }

    let connecting = this.#connecting;

    if (selectedBases.length == 0) {
      this.#buttons['Connecting'].disable();
      this.#buttons['Connecting'].tooltip.textContent = 'No bases are selected.';
    } else if (connecting.every(sb => selectedSecondaryBonds.has(sb))) {
      this.#buttons['Connecting'].disable();
      this.#buttons['Connecting'].tooltip.textContent = 'All secondary bonds connecting the selected bases are already selected.';
    } else {
      this.#buttons['Connecting'].enable();
      this.#buttons['Connecting'].tooltip.textContent = 'Select secondary bonds connecting the selected bases.';
    }

    ([
      ['A:U', this.#AU],
      ['A:T', this.#AT],
      ['G:C', this.#GC],
      ['G:U', this.#GU],
      ['G:T', this.#GT]
    ] as const)
      .forEach(([basePair, secondaryBonds]) => {
        if (secondaryBonds.length == 0) {
          this.#buttons[basePair].disable();
          this.#buttons[basePair].tooltip.textContent = `There are no ${basePair} base-pairs in the drawing.`;
        } else if (secondaryBonds.every(sb => selectedSecondaryBonds.has(sb))) {
          this.#buttons[basePair].disable();
          this.#buttons[basePair].tooltip.textContent = `All secondary bonds between ${basePair} base-pairs are already selected.`;
        } else {
          this.#buttons[basePair].enable();
          this.#buttons[basePair].tooltip.textContent = `Select all secondary bonds between ${basePair} base-pairs.`;
        }
      });
  }
}

class ZSection {
  #targetApp;

  #zSection;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedSecondaryBonds = targetApp.selectedSecondaryBonds;

    this.#zSection = new _ZSection(selectedSecondaryBonds, targetApp);

    this.domNode.style.marginTop = '25px';

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
    let selectedSecondaryBonds = [...this.#targetApp.selectedSecondaryBonds];

    if (selectedSecondaryBonds.length == 0) {
      this.#zSection.buttons['Front'].tooltip.textContent = 'No secondary bonds are selected.';
    } else {
      this.#zSection.buttons['Front'].tooltip.textContent = 'Bring the selected secondary bonds to the front.';
    }

    if (selectedSecondaryBonds.length == 0) {
      this.#zSection.buttons['Back'].tooltip.textContent = 'No secondary bonds are selected.';
    } else {
      this.#zSection.buttons['Back'].tooltip.textContent = 'Send the selected secondary bonds to the back.';
    }
  }
}

class StrokeField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedSecondaryBonds = targetApp.selectedSecondaryBonds;

    this.#input = new AttributeInput('stroke', selectedSecondaryBonds, targetApp);

    this.#field = new TextInputField('Stroke', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke';

    this.domNode.style.marginTop = '19px';
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

class StrokeColorField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedSecondaryBonds = targetApp.selectedSecondaryBonds;

    this.#input = new ColorAttributeInput('stroke', selectedSecondaryBonds, targetApp);

    this.#field = new ColorField('Stroke Color', this.#input.domNode);

    this.#field.domNode.style.marginTop = '12px';
    this.#field.domNode.style.alignSelf = 'start';

    this.refresh();
  }

  get domNode() {
    return this.#field.domNode;
  }

  refresh(): void {
    this.#input.refresh();
  }
}

class StrokeOpacityField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedSecondaryBonds = targetApp.selectedSecondaryBonds;

    this.#input = new AttributeInput('stroke-opacity', selectedSecondaryBonds, targetApp);

    this.#field = new TextInputField('Stroke Opacity', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke-opacity';

    this.domNode.style.marginTop = '12px';
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

class StrokeWidthField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedSecondaryBonds = targetApp.selectedSecondaryBonds;

    this.#input = new AttributeInput('stroke-width', selectedSecondaryBonds, targetApp);

    this.#field = new TextInputField('Stroke Width', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke-width';

    this.domNode.style.marginTop = '10px';
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

class StrokeLinecapField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedSecondaryBonds = targetApp.selectedSecondaryBonds;

    this.#input = new AttributeInput('stroke-linecap', selectedSecondaryBonds, targetApp);

    this.#field = new TextInputField('Stroke Line-Cap', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke-linecap';

    this.domNode.style.marginTop = '10px';
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

class StrokeDasharrayField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedSecondaryBonds = targetApp.selectedSecondaryBonds;

    this.#input = new AttributeInput('stroke-dasharray', selectedSecondaryBonds, targetApp);

    this.#field = new TextInputField('Stroke Dash-Array', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke-dasharray';

    this.domNode.style.marginTop = '10px';
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

function isAU(secondaryBond: SecondaryBond): boolean {
  return (new BasePair(secondaryBond.base1, secondaryBond.base2)).isAU();
}

function isAT(secondaryBond: SecondaryBond): boolean {
  return (new BasePair(secondaryBond.base1, secondaryBond.base2)).isAT();
}

function isGC(secondaryBond: SecondaryBond): boolean {
  return (new BasePair(secondaryBond.base1, secondaryBond.base2)).isGC();
}

function isGU(secondaryBond: SecondaryBond): boolean {
  return (new BasePair(secondaryBond.base1, secondaryBond.base2)).isGU();
}

function isGT(secondaryBond: SecondaryBond): boolean {
  return (new BasePair(secondaryBond.base1, secondaryBond.base2)).isGT();
}
