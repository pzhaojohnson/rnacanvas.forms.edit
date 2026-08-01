import type { App } from './App';

import type { TertiaryBond } from './TertiaryBond';

import { BasePair } from '@rnacanvas/draw.bases';

import * as styles from './TertiaryBondsSelectionTools.module.css';

import { SectionToggle } from './SectionToggle';

import { TextButton } from './TextButton';

export class TertiaryBondsSelectionTools {
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

    this.domNode.classList.add(styles['tertiary-bonds-selection-tools']);

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
    targetApp.selectedTertiaryBonds.addEventListener('change', () => {
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
    this.#targetApp.addToSelected([...this.#targetApp.drawing.tertiaryBonds])
  }

  #deselectAll(): void {
    this.#targetApp.removeFromSelected([...this.#targetApp.drawing.tertiaryBonds]);
  }

  #selectBetween(): void {
    let selectedBases = new Set(this.#targetApp.selectedBases);

    this.#targetApp.addToSelected(
      [...this.#targetApp.drawing.tertiaryBonds].map(wrap).filter(sb => sb.isBetween(selectedBases)).map(unwrap)
    );
  }

  #selectConnecting(): void {
    let selectedBases = new Set(this.#targetApp.selectedBases);

    this.#targetApp.addToSelected(
      [...this.#targetApp.drawing.tertiaryBonds].map(wrap).filter(sb => sb.connects(selectedBases)).map(unwrap)
    );
  }

  #selectAU() {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.tertiaryBonds].filter(isAU));
  }

  #selectAT() {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.tertiaryBonds].filter(isAT));
  }

  #selectGC() {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.tertiaryBonds].filter(isGC));
  }

  #selectGU() {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.tertiaryBonds].filter(isGU));
  }

  #selectGT() {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.tertiaryBonds].filter(isGT));
  }

  refresh(): void {
    let allTertiaryBonds = [...this.#targetApp.drawing.tertiaryBonds];

    let selectedTertiaryBonds = new Set(this.#targetApp.selectedTertiaryBonds);

    if (allTertiaryBonds.length == 0) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = "There aren't any tertiary bonds in the drawing.";
    } else if (allTertiaryBonds.every(sb => selectedTertiaryBonds.has(sb))) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = 'All tertiary bonds are already selected.';
    } else {
      this.#buttons['All'].enable();
      this.#buttons['All'].tooltip.textContent = 'Select all tertiary bonds.';
    }

    if (selectedTertiaryBonds.size == 0) {
      this.#buttons['None'].disable();
      this.#buttons['None'].tooltip.textContent = 'No tertiary bonds are selected.';
    } else {
      this.#buttons['None'].enable();
      this.#buttons['None'].tooltip.textContent = 'Deselect all tertiary bonds.';
    }

    let selectedBases = new Set(this.#targetApp.selectedBases);

    let betweenTertiaryBonds = (
      [...this.#targetApp.drawing.tertiaryBonds].map(wrap).filter(sb => sb.isBetween(selectedBases)).map(unwrap)
    );

    if (selectedBases.size == 0) {
      this.#buttons['Between'].disable();
      this.#buttons['Between'].tooltip.textContent = 'No bases are selected.';
    } else if (betweenTertiaryBonds.every(sb => selectedTertiaryBonds.has(sb))) {
      this.#buttons['Between'].disable();
      this.#buttons['Between'].tooltip.textContent = 'All tertiary bonds between the selected bases are already selected.';
    } else {
      this.#buttons['Between'].enable();
      this.#buttons['Between'].tooltip.textContent = 'Select tertiary bonds between the selected bases.';
    }

    let connectingTertiaryBonds = (
      [...this.#targetApp.drawing.tertiaryBonds].map(wrap).filter(sb => sb.connects(selectedBases)).map(unwrap)
    );

    if (selectedBases.size == 0) {
      this.#buttons['Connecting'].disable();
      this.#buttons['Connecting'].tooltip.textContent = 'No bases are selected.';
    } else if (connectingTertiaryBonds.every(sb => selectedTertiaryBonds.has(sb))) {
      this.#buttons['Connecting'].disable();
      this.#buttons['Connecting'].tooltip.textContent = 'All tertiary bonds connecting the selected bases are already selected.';
    } else {
      this.#buttons['Connecting'].enable();
      this.#buttons['Connecting'].tooltip.textContent = 'Select tertiary bonds connecting the selected bases.';
    }

    ([
      ['A:U', [...this.#targetApp.drawing.tertiaryBonds].filter(isAU)],
      ['A:T', [...this.#targetApp.drawing.tertiaryBonds].filter(isAT)],
      ['G:C', [...this.#targetApp.drawing.tertiaryBonds].filter(isGC)],
      ['G:U', [...this.#targetApp.drawing.tertiaryBonds].filter(isGU)],
      ['G:T', [...this.#targetApp.drawing.tertiaryBonds].filter(isGT)]
    ] as const)
      .forEach(([basePair, tertiaryBonds]) => {
        if (tertiaryBonds.length == 0) {
          this.#buttons[basePair].disable();
          this.#buttons[basePair].tooltip.textContent = `There aren't any ${basePair} base-pairs in the drawing.`;
        } else if (tertiaryBonds.every(sb => selectedTertiaryBonds.has(sb))) {
          this.#buttons[basePair].disable();
          this.#buttons[basePair].tooltip.textContent = `All tertiary bonds between ${basePair} base-pairs are already selected.`;
        } else {
          this.#buttons[basePair].enable();
          this.#buttons[basePair].tooltip.textContent = `Select tertiary bonds between ${basePair} base-pairs.`;
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

function wrap(sb: TertiaryBond) {
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

function isAU(tertiaryBond: TertiaryBond): boolean {
  return (new BasePair(tertiaryBond.base1, tertiaryBond.base2)).isAU();
}

function isAT(tertiaryBond: TertiaryBond): boolean {
  return (new BasePair(tertiaryBond.base1, tertiaryBond.base2)).isAT();
}

function isGC(tertiaryBond: TertiaryBond): boolean {
  return (new BasePair(tertiaryBond.base1, tertiaryBond.base2)).isGC();
}

function isGU(tertiaryBond: TertiaryBond): boolean {
  return (new BasePair(tertiaryBond.base1, tertiaryBond.base2)).isGU();
}

function isGT(tertiaryBond: TertiaryBond): boolean {
  return (new BasePair(tertiaryBond.base1, tertiaryBond.base2)).isGT();
}

type Nucleobase = TertiaryBond['base1'] | TertiaryBond['base2'];
