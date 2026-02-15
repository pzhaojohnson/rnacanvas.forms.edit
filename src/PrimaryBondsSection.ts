import type { App } from './App';

import * as styles from './PrimaryBondsSection.module.css';

import { SectionHeader } from './SectionHeader';

import { TextButton } from './TextButton';

import { ZTools as _ZTools } from './ZTools';

import { PrimaryBondsStrokeField } from './PrimaryBondsStrokeField';

import { ColorAttributeInput } from './ColorAttributeInput';

import { ColorField } from './ColorField';

import { PrimaryBondsStrokeOpacityField } from './PrimaryBondsStrokeOpacityField';

import { PrimaryBondsStrokeWidthField } from './PrimaryBondsStrokeWidthField';

import { PrimaryBondsStrokeLinecapField } from './PrimaryBondsStrokeLinecapField';

import { PrimaryBondsStrokeDasharrayField } from './PrimaryBondsStrokeDasharrayField';

import { PrimaryBondsBasePadding1Field } from './PrimaryBondsBasePadding1Field';

import { PrimaryBondsBasePadding2Field } from './PrimaryBondsBasePadding2Field';

import * as $ from 'jquery';

export class PrimaryBondsSection {
  #targetApp;

  readonly domNode = document.createElement('div');

  #header = new SectionHeader('Primary Bonds', () => this.toggle());

  #content = document.createElement('div');

  #numSelected;
  #selectionTools;

  #bottomContent = document.createElement('div');

  #zTools;
  #strokeField;
  #strokeColorField;
  #strokeOpacityField;
  #strokeWidthField;
  #strokeLinecapField;
  #strokeDasharrayField;
  #basePadding1Field;
  #basePadding2Field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['primary-bonds-section']);

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
    targetApp.selectedPrimaryBonds.addEventListener('change', () => {
      if (document.body.contains(this.domNode)) {
        [...targetApp.selectedPrimaryBonds].length == 0 ? this.#hideBottomContent() : this.#showBottomContent();
      }
    });

    this.#zTools = new ZTools(targetApp);
    this.#bottomContent.append(this.#zTools.domNode);

    this.#strokeField = new PrimaryBondsStrokeField(targetApp);
    this.#bottomContent.append(this.#strokeField.domNode);

    this.#strokeColorField = new StrokeColorField(targetApp);
    this.#bottomContent.append(this.#strokeColorField.domNode);

    this.#strokeOpacityField = new PrimaryBondsStrokeOpacityField(targetApp);
    this.#bottomContent.append(this.#strokeOpacityField.domNode);

    this.#strokeWidthField = new PrimaryBondsStrokeWidthField(targetApp);
    this.#bottomContent.append(this.#strokeWidthField.domNode);

    this.#strokeLinecapField = new PrimaryBondsStrokeLinecapField(targetApp);
    this.#bottomContent.append(this.#strokeLinecapField.domNode);

    this.#strokeDasharrayField = new PrimaryBondsStrokeDasharrayField(targetApp);
    this.#bottomContent.append(this.#strokeDasharrayField.domNode);

    this.#basePadding1Field = new PrimaryBondsBasePadding1Field(targetApp);
    this.#bottomContent.append(this.#basePadding1Field.domNode);

    this.#basePadding2Field = new PrimaryBondsBasePadding2Field(targetApp);
    this.#bottomContent.append(this.#basePadding2Field.domNode);

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

    [...this.#targetApp.selectedPrimaryBonds].length == 0 ? this.#hideBottomContent() : this.#showBottomContent();
  }

  get #refreshableComponents() {
    return [
      this.#numSelected,
      this.#selectionTools,
      this.#zTools,
      this.#strokeField,
      this.#strokeColorField,
      this.#strokeOpacityField,
      this.#strokeWidthField,
      this.#strokeLinecapField,
      this.#strokeDasharrayField,
      this.#basePadding1Field,
      this.#basePadding2Field,
    ];
  }

  #hideBottomContent(): void {
    this.#bottomContent.style.display = 'none';
  }

  #showBottomContent(): void {
    this.#bottomContent.style.display = 'flex';
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
    this.#targetApp.selectedPrimaryBonds.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    this.refresh();
  }

  refresh(): void {
    let num = [...this.#targetApp.selectedPrimaryBonds].length;

    this.#num.textContent = `${num}`;

    this.#trailingText.textContent = num == 1 ? ' primary bond is selected.' : ' primary bonds are selected.';
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
  };

  #buttonsContainer = document.createElement('div');

  #alwaysVisibleButtons = document.createElement('div');

  #sometimesHiddenButtons = document.createElement('div');

  #drawingObserver;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['selection-tools']);

    this.domNode.append(this.#toggle.domNode);

    $(this.#buttonsContainer).css({ marginTop: '1.5px', display: 'flex', flexDirection: 'column', gap: '10px' });
    this.domNode.append(this.#buttonsContainer);

    $(this.#alwaysVisibleButtons).css({ display: 'flex', flexDirection: 'row', gap: '27px' });
    this.#alwaysVisibleButtons.append(...(['All', 'None'] as const).map(name => this.#buttons[name].domNode));
    this.#buttonsContainer.append(this.#alwaysVisibleButtons);

    $(this.#sometimesHiddenButtons).css({ display: 'flex', flexDirection: 'row', gap: '20px' });
    this.#sometimesHiddenButtons.append(...(['Between', 'Connecting'] as const).map(name => this.#buttons[name].domNode));
    this.#buttonsContainer.append(this.#sometimesHiddenButtons);

    // hide by default
    this.#sometimesHiddenButtons.style.display = 'none';
    this.#toggle.caret.pointRight();

    // only refresh when the Editing form is open
    targetApp.selectedPrimaryBonds.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh() : {});
    targetApp.selectedBases.addEventListener('change', () => document.body.contains(this.domNode) ? this.refresh(): {});

    // only refresh when the Editing form is open
    this.#drawingObserver = new MutationObserver(() => document.body.contains(this.domNode) ? this.refresh() : {});

    // watch for the addition and removal of elements
    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, subtree: true });

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
    this.#targetApp.addToSelected([...this.#targetApp.drawing.primaryBonds])
  }

  #deselectAll(): void {
    this.#targetApp.removeFromSelected([...this.#targetApp.drawing.primaryBonds]);
  }

  #selectBetween(): void {
    this.#targetApp.addToSelected(this.#between);
  }

  /**
   * All primary bonds between the selected bases.
   */
  get #between() {
    let selectedBases = new Set(this.#targetApp.selectedBases);

    return [...this.#targetApp.drawing.primaryBonds].filter(pb => selectedBases.has(pb.base1) && selectedBases.has(pb.base2));
  }

  #selectConnecting(): void {
    this.#targetApp.addToSelected(this.#connecting);
  }

  /**
   * All primary bonds connecting the selected bases.
   */
  get #connecting() {
    let selectedBases = new Set(this.#targetApp.selectedBases);

    return [...this.#targetApp.drawing.primaryBonds].filter(pb => selectedBases.has(pb.base1) || selectedBases.has(pb.base2));
  }

  refresh(): void {
    let allPrimaryBonds = [...this.#targetApp.drawing.primaryBonds];

    let selectedPrimaryBonds = new Set(this.#targetApp.selectedPrimaryBonds);

    if (allPrimaryBonds.length == 0) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = 'There are no primary bonds in the drawing.';
    } else if (allPrimaryBonds.every(pb => selectedPrimaryBonds.has(pb))) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = 'All primary bonds are already selected.';
    } else {
      this.#buttons['All'].enable();
      this.#buttons['All'].tooltip.textContent = 'Select all primary bonds.';
    }

    if (selectedPrimaryBonds.size == 0) {
      this.#buttons['None'].disable();
      this.#buttons['None'].tooltip.textContent = 'No primary bonds are selected.';
    } else {
      this.#buttons['None'].enable();
      this.#buttons['None'].tooltip.textContent = 'Deselect all primary bonds.';
    }

    let selectedBases = [...this.#targetApp.selectedBases];

    let between = this.#between;

    if (selectedBases.length == 0) {
      this.#buttons['Between'].disable();
      this.#buttons['Between'].tooltip.textContent = 'No bases are selected.';
    } else if (between.every(pb => selectedPrimaryBonds.has(pb))) {
      this.#buttons['Between'].disable();
      this.#buttons['Between'].tooltip.textContent = 'All primary bonds between the selected bases are already selected.';
    } else {
      this.#buttons['Between'].enable();
      this.#buttons['Between'].tooltip.textContent = 'Select primary bonds between the selected bases.';
    }

    let connecting = this.#connecting;

    if (selectedBases.length == 0) {
      this.#buttons['Connecting'].disable();
      this.#buttons['Connecting'].tooltip.textContent = 'No bases are selected.';
    } else if (connecting.every(pb => selectedPrimaryBonds.has(pb))) {
      this.#buttons['Connecting'].disable();
      this.#buttons['Connecting'].tooltip.textContent = 'All primary bonds connecting the selected bases are already selected.';
    } else {
      this.#buttons['Connecting'].enable();
      this.#buttons['Connecting'].tooltip.textContent = 'Select primary bonds connecting the selected bases.';
    }
  }
}

class ZTools {
  #targetApp;

  #zTools;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedPrimaryBonds = targetApp.selectedPrimaryBonds;

    this.#zTools = new _ZTools(selectedPrimaryBonds, targetApp);

    this.domNode.style.marginTop = '26px';

    this.#zTools.addEventListener('refresh', () => this.#handleRefresh());

    this.refresh();
  }

  get domNode() {
    return this.#zTools.domNode;
  }

  refresh(): void {
    this.#zTools.refresh();
  }

  #handleRefresh(): void {
    let selectedPrimaryBonds = [...this.#targetApp.selectedPrimaryBonds];

    if (selectedPrimaryBonds.length == 0) {
      this.#zTools.buttons['Front'].tooltip.textContent = 'No primary bonds are selected.';
    } else {
      this.#zTools.buttons['Front'].tooltip.textContent = 'Bring the selected primary bonds to the front.';
    }

    if (selectedPrimaryBonds.length == 0) {
      this.#zTools.buttons['Back'].tooltip.textContent = 'No primary bonds are selected.';
    } else {
      this.#zTools.buttons['Back'].tooltip.textContent = 'Send the selected primary bonds to the back.';
    }
  }
}

class StrokeColorField {
  #targetApp;

  #input;

  #field;

  /**
   * Used to help determine whether to push the undo stack or not.
   */
  #previousState: unknown;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedPrimaryBonds = targetApp.selectedPrimaryBonds;

    let parentDrawing = targetApp.drawing;

    this.#input = new ColorAttributeInput('stroke', selectedPrimaryBonds, parentDrawing);

    this.#input.onBeforeEdit = () => {
      if (targetApp.undoStack.isEmpty() || targetApp.undoStack.peek() !== this.#previousState) {
        targetApp.pushUndoStack();

        this.#previousState = targetApp.undoStack.peek();
      }
    };

    selectedPrimaryBonds.addEventListener('change', () => {
      this.#previousState = undefined;
    });

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
