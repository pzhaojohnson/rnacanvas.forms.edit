import type { App } from './App';

import * as styles from './BasesSelectionTools.module.css';

import { SectionToggle } from './SectionToggle';

import { TextButton } from './TextButton';

export class BasesSelectionTools {
  readonly #targetApp;

  readonly domNode = document.createElement('div');

  readonly #toggle = new SectionToggle('Select:', () => this.toggle());

  readonly #buttons = {
    'All': new TextButton('All', () => this.#selectAll()),
    'None': new TextButton('None', () => this.#selectNone()),

    'A': new TextButton('A', () => this.#selectWithTextContent('A')),
    'U': new TextButton('U', () => this.#selectWithTextContent('U')),
    'G': new TextButton('G', () => this.#selectWithTextContent('G')),
    'C': new TextButton('C', () => this.#selectWithTextContent('C')),
    'T': new TextButton('T', () => this.#selectWithTextContent('T')),

    'a': new TextButton('a', () => this.#selectWithTextContent('a')),
    'u': new TextButton('u', () => this.#selectWithTextContent('u')),
    'g': new TextButton('g', () => this.#selectWithTextContent('g')),
    'c': new TextButton('c', () => this.#selectWithTextContent('c')),
    't': new TextButton('t', () => this.#selectWithTextContent('t')),

    'Outlined': new TextButton('Outlined', () => this.#selectOutlined()),

    'Paired': new TextButton('Paired', () => this.#selectPaired()),
    'Unpaired': new TextButton('Unpaired', () => this.#selectUnpaired()),
  };

  readonly #rightSide = document.createElement('div');

  readonly #alwaysVisibleButtonsContainer = new ButtonsContainer();

  readonly #hideableButtonsContainer = new ButtonsContainer();

  readonly #drawingObserver;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['bases-selection-tools']);

    this.domNode.append(this.#toggle.domNode);

    this.#rightSide.classList.add(styles['right-side']);
    this.domNode.append(this.#rightSide);

    this.#rightSide.append(this.#alwaysVisibleButtonsContainer.domNode);

    this.#alwaysVisibleButtonsContainer.addRow(
      (['All', 'None'] as const).map(name => this.#buttons[name]),
      { gap: 23 },
    );

    this.#rightSide.append(this.#hideableButtonsContainer.domNode);

    this.#hideableButtonsContainer.addRow(
      (['A', 'U', 'G', 'C', 'T'] as const).map(letter => this.#buttons[letter]),
      { gap: 17 },
    );

    this.#hideableButtonsContainer.addRow(
      (['a', 'u', 'g', 'c', 't'] as const).map(letter => this.#buttons[letter]),
      { gap: 18 },
    );

    this.#hideableButtonsContainer.addRow(
      [this.#buttons['Outlined']],
      { gap: 0 },
    );

    this.#hideableButtonsContainer.addRow(
      (['Paired', 'Unpaired'] as const).map(name => this.#buttons[name]),
      { gap: 18 },
    );

    // only refresh when the Edit form is open
    targetApp.selectedBases.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh(): {};
    });

    // only refresh when the Edit form is open
    targetApp.selectedOutlines.addEventListener('change', () => {
      document.body.contains(this.domNode) ? this.refresh(): {};
    });

    // only refresh when the Edit form is open
    this.#drawingObserver = new MutationObserver(() => {
      document.body.contains(this.domNode) ? this.refresh(): {};
    });

    // watch for any bases being added or removed from the drawing
    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, subtree: true });

    this.refresh();

    // collapse by default
    this.collapse();
  }

  toggle() {
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

  #selectAll() {
    this.#targetApp.addToSelected([...this.#targetApp.drawing.bases]);
  }

  #selectNone() {
    this.#targetApp.removeFromSelected([...this.#targetApp.drawing.bases]);
  }

  #selectWithTextContent(textContent: string) {
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
    let pairedBases = new Set([...this.#targetApp.drawing.secondaryBonds].flatMap(sb => [sb.base1, sb.base2]));

    this.#targetApp.addToSelected([...this.#targetApp.drawing.bases].filter(b => !pairedBases.has(b)));
  }

  refresh(): void {
    let allBases = [...this.#targetApp.drawing.bases];

    let pairedBases = new Set([...this.#targetApp.drawing.secondaryBonds].flatMap(sb => [sb.base1, sb.base2]));
    let unpairedBases = allBases.filter(b => !pairedBases.has(b));

    let selectedBases = new Set(this.#targetApp.selectedBases);
    let selectedOutlines = [...this.#targetApp.selectedOutlines];

    if (allBases.length == 0) {
      this.#buttons['All'].disable();
      this.#buttons['All'].tooltip.textContent = "There aren't any bases in the drawing.";
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
