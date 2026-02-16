import type { App } from './App';

import type { PrimaryBond } from './PrimaryBond';

import * as styles from './PrimaryBondsSelectionTools.module.css';

import { SectionToggle } from './SectionToggle';

import { TextButton } from './TextButton';

export class PrimaryBondsSelectionTools {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #toggle = new SectionToggle('Select:', () => this.toggle());

  readonly #buttons = {
    'All': new TextButton('All', () => this.#selectAll()),
    'None': new TextButton('None', () => this.#deselectAll()),

    'Between': new TextButton('Between', () => this.#selectBetween()),
    'Connecting': new TextButton('Connecting', () => this.#selectConnecting()),
  };

  readonly #rightSide = document.createElement('div');

  readonly #alwaysVisibleButtonsContainer = new ButtonsContainer();

  readonly #hideableButtonsContainer = new ButtonsContainer();

  readonly #drawingObserver;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['primary-bonds-selection-tools']);

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

    this.#rightSide.append(this.#hideableButtonsContainer.domNode);

    // only refresh when the Edit form is open
    targetApp.selectedPrimaryBonds.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // only refresh when the Edit form is open
    targetApp.selectedBases.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh(): {};
    });

    // only refresh when the Edit form is open
    this.#drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh() : {};
    });

    // watch for any primary bonds being added or removed from the drawing
    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, subtree: true });

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
    this.#targetApp.addToSelected([...this.#targetApp.drawing.primaryBonds])
  }

  #deselectAll(): void {
    this.#targetApp.removeFromSelected([...this.#targetApp.drawing.primaryBonds]);
  }

  #selectBetween(): void {
    let selectedBases = new Set(this.#targetApp.selectedBases);

    this.#targetApp.addToSelected(
      [...this.#targetApp.drawing.primaryBonds].map(wrap).filter(pb => pb.isBetween(selectedBases)).map(unwrap)
    );
  }

  #selectConnecting(): void {
    let selectedBases = new Set(this.#targetApp.selectedBases);

    this.#targetApp.addToSelected(
      [...this.#targetApp.drawing.primaryBonds].map(wrap).filter(pb => pb.connects(selectedBases)).map(unwrap)
    );
  }

  refresh(): void {
    let allPrimaryBonds = [...this.#targetApp.drawing.primaryBonds];

    let selectedPrimaryBonds = new Set(this.#targetApp.selectedPrimaryBonds);

    if (allPrimaryBonds.length == 0) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = "There aren't any primary bonds in the drawing.";
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

    let selectedBases = new Set(this.#targetApp.selectedBases);

    let betweenPrimaryBonds = (
      [...this.#targetApp.drawing.primaryBonds].map(wrap).filter(pb => pb.isBetween(selectedBases)).map(unwrap)
    );

    if (selectedBases.size == 0) {
      this.#buttons['Between'].disable();
      this.#buttons['Between'].tooltip.textContent = 'No bases are selected.';
    } else if (betweenPrimaryBonds.every(pb => selectedPrimaryBonds.has(pb))) {
      this.#buttons['Between'].disable();
      this.#buttons['Between'].tooltip.textContent = 'All primary bonds between the selected bases are already selected.';
    } else {
      this.#buttons['Between'].enable();
      this.#buttons['Between'].tooltip.textContent = 'Select primary bonds between the selected bases.';
    }

    let connectingPrimaryBonds = (
      [...this.#targetApp.drawing.primaryBonds].map(wrap).filter(pb => pb.connects(selectedBases)).map(unwrap)
    );

    if (selectedBases.size == 0) {
      this.#buttons['Connecting'].disable();
      this.#buttons['Connecting'].tooltip.textContent = 'No bases are selected.';
    } else if (connectingPrimaryBonds.every(pb => selectedPrimaryBonds.has(pb))) {
      this.#buttons['Connecting'].disable();
      this.#buttons['Connecting'].tooltip.textContent = 'All primary bonds connecting the selected bases are already selected.';
    } else {
      this.#buttons['Connecting'].enable();
      this.#buttons['Connecting'].tooltip.textContent = 'Select primary bonds connecting the selected bases.';
    }
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

function wrap(pb: PrimaryBond) {
  return {
    isBetween(targetBases: Set<Nucleobase>) {
      return targetBases.has(pb.base1) && targetBases.has(pb.base2);
    },

    connects(targetBases: Set<Nucleobase>) {
      return targetBases.has(pb.base1) || targetBases.has(pb.base2);
    },

    unwrap() {
      return pb;
    },
  };
}

function unwrap(wrapped: ReturnType<typeof wrap>) {
  return wrapped.unwrap();
}

type Nucleobase = PrimaryBond['base1'] | PrimaryBond['base2'];
