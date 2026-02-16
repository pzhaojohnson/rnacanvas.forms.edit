import type { App } from './App';

import type { SecondaryBond } from './SecondaryBond';

import { BasePair } from '@rnacanvas/draw.bases';

import * as styles from './SecondaryBondsSelectionTools.module.css';

import { SectionToggle } from './SectionToggle';

import { TextButton } from './TextButton';

export class SecondaryBondsSelectionTools {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #toggle = new SectionToggle('Select:', () => this.toggle());

  readonly #rightSide = document.createElement('div');

  readonly #buttons = {
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

  readonly #alwaysVisibleButtonsContainer = new ButtonsContainer();

  readonly #hideableButtonsContainer = new ButtonsContainer();

  readonly #drawingObserver;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['secondary-bonds-selection-tools']);

    this.domNode.append(this.#toggle.domNode);

    this.#rightSide.classList.add(styles['right-side']);
    this.domNode.append(this.#rightSide);

    this.#alwaysVisibleButtonsContainer.addRow(
      (['All', 'None'] as const).map(name => this.#buttons[name]),
      { gap: 27 },
    );

    this.#rightSide.append(this.#alwaysVisibleButtonsContainer.domNode);

    this.#hideableButtonsContainer.addRow(
      (['Between', 'Connecting'] as const).map(name => this.#buttons[name]),
      { gap: 20 },
    );

    this.#hideableButtonsContainer.addRow(
      (['A:U', 'G:C', 'G:U', 'A:T', 'G:T'] as const).map(name => this.#buttons[name]),
      { gap: 12 },
    );

    this.#rightSide.append(this.#hideableButtonsContainer.domNode);

    // only refresh when the Edit form is open
    targetApp.selectedSecondaryBonds.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when the Edit form is open
    targetApp.selectedBases.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when the Edit form is open
    this.#drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // watch for any elements being added or removed from the drawing
    // (and the text contents of any bases being changed)
    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, characterData: true, subtree: true });

    this.refresh();

    // collapse by default
    this.collapse();
  }

  toggle(): void {
    this.isCollapsed() ? this.expand() : this.collapse();
  }

  isCollapsed(): boolean {
    return this.#hideableButtonsContainer.domNode.style.display === 'none';
  }

  collapse(): void {
    this.#hideableButtonsContainer.domNode.style.display = 'none';

    this.#toggle.caret.pointRight();
  }

  expand(): void {
    this.#hideableButtonsContainer.domNode.style.display = 'flex';

    this.#toggle.caret.pointDown();
  }

  #selectAll(): void {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.secondaryBonds])
  }

  #deselectAll(): void {
    this.#targetApp.removeFromSelected([...this.#targetApp.drawing.secondaryBonds]);
  }

  #selectBetween(): void {
    let selectedBases = new Set(this.#targetApp.selectedBases);

    this.#targetApp.addToSelected(
      [...this.#targetApp.drawing.secondaryBonds].map(wrap).filter(sb => sb.isBetween(selectedBases)).map(unwrap)
    );
  }

  #selectConnecting(): void {
    let selectedBases = new Set(this.#targetApp.selectedBases);

    this.#targetApp.addToSelected(
      [...this.#targetApp.drawing.secondaryBonds].map(wrap).filter(sb => sb.connects(selectedBases)).map(unwrap)
    );
  }

  #selectAU() {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.secondaryBonds].filter(isAU));
  }

  #selectAT() {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.secondaryBonds].filter(isAT));
  }

  #selectGC() {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.secondaryBonds].filter(isGC));
  }

  #selectGU() {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.secondaryBonds].filter(isGU));
  }

  #selectGT() {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.secondaryBonds].filter(isGT));
  }

  refresh(): void {
    let allSecondaryBonds = [...this.#targetApp.drawing.secondaryBonds];

    let selectedSecondaryBonds = new Set(this.#targetApp.selectedSecondaryBonds);

    if (allSecondaryBonds.length == 0) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = "There aren't any secondary bonds in the drawing.";
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

    let selectedBases = new Set(this.#targetApp.selectedBases);

    let betweenSecondaryBonds = (
      [...this.#targetApp.drawing.secondaryBonds].map(wrap).filter(sb => sb.isBetween(selectedBases)).map(unwrap)
    );

    if (selectedBases.size == 0) {
      this.#buttons['Between'].disable();
      this.#buttons['Between'].tooltip.textContent = 'No bases are selected.';
    } else if (betweenSecondaryBonds.every(sb => selectedSecondaryBonds.has(sb))) {
      this.#buttons['Between'].disable();
      this.#buttons['Between'].tooltip.textContent = 'All secondary bonds between the selected bases are already selected.';
    } else {
      this.#buttons['Between'].enable();
      this.#buttons['Between'].tooltip.textContent = 'Select secondary bonds between the selected bases.';
    }

    let connectingSecondaryBonds = (
      [...this.#targetApp.drawing.secondaryBonds].map(wrap).filter(sb => sb.connects(selectedBases)).map(unwrap)
    );

    if (selectedBases.size == 0) {
      this.#buttons['Connecting'].disable();
      this.#buttons['Connecting'].tooltip.textContent = 'No bases are selected.';
    } else if (connectingSecondaryBonds.every(sb => selectedSecondaryBonds.has(sb))) {
      this.#buttons['Connecting'].disable();
      this.#buttons['Connecting'].tooltip.textContent = 'All secondary bonds connecting the selected bases are already selected.';
    } else {
      this.#buttons['Connecting'].enable();
      this.#buttons['Connecting'].tooltip.textContent = 'Select secondary bonds connecting the selected bases.';
    }

    ([
      ['A:U', [...this.#targetApp.drawing.secondaryBonds].filter(isAU)],
      ['A:T', [...this.#targetApp.drawing.secondaryBonds].filter(isAT)],
      ['G:C', [...this.#targetApp.drawing.secondaryBonds].filter(isGC)],
      ['G:U', [...this.#targetApp.drawing.secondaryBonds].filter(isGU)],
      ['G:T', [...this.#targetApp.drawing.secondaryBonds].filter(isGT)]
    ] as const)
      .forEach(([basePair, secondaryBonds]) => {
        if (secondaryBonds.length == 0) {
          this.#buttons[basePair].disable();
          this.#buttons[basePair].tooltip.textContent = `There aren't any ${basePair} base-pairs in the drawing.`;
        } else if (secondaryBonds.every(sb => selectedSecondaryBonds.has(sb))) {
          this.#buttons[basePair].disable();
          this.#buttons[basePair].tooltip.textContent = `All secondary bonds between ${basePair} base-pairs are already selected.`;
        } else {
          this.#buttons[basePair].enable();
          this.#buttons[basePair].tooltip.textContent = `Select secondary bonds between ${basePair} base-pairs.`;
        }
      });
  }
}

class ButtonsContainer {
  readonly domNode = document.createElement('div');

  constructor() {
    this.domNode.classList.add(styles['buttons-container']);
  }

  addRow(buttons: Button[], options: { gap: number }) {
    let { gap } = options;

    let row = document.createElement('div');

    row.style.display = 'flex';
    row.style.flexDirection = 'row';
    row.style.gap = `${gap}px`;

    row.append(...buttons.map(b => b.domNode));

    this.domNode.append(row);
  }
}

interface Button {
  readonly domNode: Element;
}

function wrap(sb: SecondaryBond) {
  return {
    isBetween(targetBases: Set<Nucleobase>) {
      return targetBases.has(sb.base1) && targetBases.has(sb.base2);
    },

    connects(targetBases: Set<Nucleobase>) {
      return targetBases.has(sb.base1) || targetBases.has(sb.base2);
    },

    unwrap() {
      return sb;
    },
  };
}

function unwrap(sb: ReturnType<typeof wrap>) {
  return sb.unwrap();
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

type Nucleobase = SecondaryBond['base1'] | SecondaryBond['base2'];
