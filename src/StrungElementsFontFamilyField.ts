import type { App } from './App';

import type { Point } from './Point';

import { AttributeInput } from './AttributeInput';

import { TextInputField } from './TextInputField';

import { CenterPoint } from '@rnacanvas/draw.svg.text';

export class StrungElementsFontFamilyField {
  readonly #targetApp;

  readonly #input;

  readonly #field;

  /**
   * Cached center points (from on-before edits).
   */
  #centerPoints = new Map<SVGTextElement, Point>();

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.#input = new AttributeInput('font-family', targetApp.selectedStrungElements, targetApp.drawing);

    this.#input.onBeforeEdit = () => {
      targetApp.pushUndoStack();

      this.#cacheCenterPoints();
    };

    this.#input.onEdit = () => this.#restoreCenterPoints();

    this.#field = new TextInputField('Font Family', this.#input.domNode);

    this.#field.infoLink = 'https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/font-family';

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

  #cacheCenterPoints(): void {
    this.#centerPoints = new Map();

    this.#targetApp.selectedStrungElements.toArray().forEach(ele => {
      if (ele.domNode instanceof SVGTextElement) {
        let centerPoint = new CenterPoint(ele.domNode);

        this.#centerPoints.set(ele.domNode, { x: centerPoint.x, y: centerPoint.y });
      }
    });
  }

  #restoreCenterPoints(): void {
    this.#centerPoints.forEach((p, domNode) => {
      let centerPoint = new CenterPoint(domNode);

      centerPoint.x = p.x;
      centerPoint.y = p.y;
    });

    // uncache center points
    this.#centerPoints = new Map();
  }
}
