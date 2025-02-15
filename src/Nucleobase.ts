/**
 * The nucleobase interface used by the Editing form.
 */
export interface Nucleobase {
  textContent: string | null;

  /**
   * A method that will restore the center point of the nucleobase
   * after calling the provided callback function (that edits the base).
   */
  maintainingCenterPoint(callbackFn: () => void): void;
}
