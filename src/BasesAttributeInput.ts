import type { App } from './App';

import type { Nucleobase } from '@rnacanvas/draw.bases';

import type { LiveCollection } from './LiveCollection';

import { AttributeInput } from './AttributeInput';

export class BasesAttributeInput {
  readonly #attributeName;

  readonly #targetBases;

  readonly #parentDrawing;

  readonly #attributeInput;

  #centerPoints: Point[] = [];

  readonly #onBeforeEdit = () => {
    // cache center points
    this.#centerPoints = [...this.#targetBases].map(b => ({ x: b.centerPoint.x, y: b.centerPoint.y }));
  };

  readonly #onEdit = () => {
    // restore center points
    [...this.#targetBases].forEach((b, i) => {
      if (i < this.#centerPoints.length) {
        let centerPoint = this.#centerPoints[i];

        b.centerPoint.x = centerPoint.x;
        b.centerPoint.y = centerPoint.y;
      }
    });

    // uncache center points
    this.#centerPoints = [];
  };

  constructor(attributeName: string, targetBases: LiveCollection<Nucleobase>, parentDrawing: Drawing) {
    this.#attributeName = attributeName;

    this.#targetBases = targetBases

    this.#parentDrawing = parentDrawing;

    this.#attributeInput = new AttributeInput(attributeName, targetBases, parentDrawing);

    this.#attributeInput.onBeforeEdit = this.#onBeforeEdit;

    this.#attributeInput.onEdit = this.#onEdit;

    this.refresh();
  }

  get domNode() {
    return this.#attributeInput.domNode;
  }

  get onEdit() {
    return this.#attributeInput.onEdit ?? this.#onEdit;
  }

  set onEdit(onEdit) {
    this.#attributeInput.onEdit = () => {
      // always do on edit
      this.#onEdit();

      onEdit();
    };
  }

  get onBeforeEdit() {
    return this.#attributeInput.onBeforeEdit ?? this.#onBeforeEdit;
  }

  set onBeforeEdit(onBeforeEdit) {
    this.#attributeInput.onBeforeEdit = () => {
      // always do before edit
      this.#onBeforeEdit();

      onBeforeEdit();
    };
  }

  refresh(): void {
    this.#attributeInput.refresh();
  }
}

type Drawing = App['drawing'];

type Point = {
  x: number;
  y: number;
};
