import type { App } from './App';

import * as styles from './PrimaryBondsSection.module.css';

import { SectionHeader } from './SectionHeader';

import { ZSection as _ZSection } from './ZSection';

import { AttributeInput } from './AttributeInput';

import { TextInputField } from './TextInputField';

import { ColorAttributeInput } from './ColorAttributeInput';

import { ColorField } from './ColorField';

export class PrimaryBondsSection {
  #targetApp;

  readonly domNode = document.createElement('div');

  #header = new SectionHeader('Primary Bonds', () => this.toggle());

  #content = document.createElement('div');

  #numSelected;

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

    this.domNode.classList.add(styles['primary-bonds-section']);

    this.domNode.append(this.#header.domNode);

    this.#content.classList.add(styles['content']);
    this.domNode.append(this.#content);

    this.#numSelected = new NumSelected(targetApp);
    this.domNode.append(this.#numSelected.domNode);

    this.#bottomContent.classList.add(styles['bottom-content']);
    this.domNode.append(this.#bottomContent);

    // only refresh when necessary
    targetApp.selectedPrimaryBonds.addEventListener('change', () => {
      if (document.body.contains(this.domNode)) {
        [...targetApp.selectedPrimaryBonds].length == 0 ? this.#hideBottomContent() : this.#showBottomContent();
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

    [...this.#targetApp.selectedPrimaryBonds].length == 0 ? this.#hideBottomContent() : this.#showBottomContent();
  }

  get #refreshableComponents() {
    return [
      this.#numSelected,
      this.#zSection,
      this.#strokeField,
      this.#strokeColorField,
      this.#strokeOpacityField,
      this.#strokeWidthField,
      this.#strokeLinecapField,
      this.#strokeDasharrayField,
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

class ZSection {
  #targetApp;

  #zSection;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedPrimaryBonds = targetApp.selectedPrimaryBonds;

    this.#zSection = new _ZSection(selectedPrimaryBonds, targetApp);

    this.domNode.style.marginTop = '23px';

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
    let selectedPrimaryBonds = [...this.#targetApp.selectedPrimaryBonds];

    if (selectedPrimaryBonds.length == 0) {
      this.#zSection.buttons['Front'].tooltip.textContent = 'No primary bonds are selected.';
    } else {
      this.#zSection.buttons['Front'].tooltip.textContent = 'Bring the selected primary bonds to the front.';
    }

    if (selectedPrimaryBonds.length == 0) {
      this.#zSection.buttons['Back'].tooltip.textContent = 'No primary bonds are selected.';
    } else {
      this.#zSection.buttons['Back'].tooltip.textContent = 'Send the selected primary bonds to the back.';
    }
  }
}

class StrokeField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedPrimaryBonds = targetApp.selectedPrimaryBonds;

    this.#input = new AttributeInput('stroke', selectedPrimaryBonds, targetApp);

    this.#field = new TextInputField('Stroke', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke';

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

class StrokeColorField {
  #targetApp;

  #input;

  #field;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    let selectedPrimaryBonds = targetApp.selectedPrimaryBonds;

    this.#input = new ColorAttributeInput('stroke', selectedPrimaryBonds, targetApp);

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

    let selectedPrimaryBonds = targetApp.selectedPrimaryBonds;

    this.#input = new AttributeInput('stroke-opacity', selectedPrimaryBonds, targetApp);

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

    let selectedPrimaryBonds = targetApp.selectedPrimaryBonds;

    this.#input = new AttributeInput('stroke-width', selectedPrimaryBonds, targetApp);

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

    let selectedPrimaryBonds = targetApp.selectedPrimaryBonds;

    this.#input = new AttributeInput('stroke-linecap', selectedPrimaryBonds, targetApp);

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

    let selectedPrimaryBonds = targetApp.selectedPrimaryBonds;

    this.#input = new AttributeInput('stroke-dasharray', selectedPrimaryBonds, targetApp);

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
