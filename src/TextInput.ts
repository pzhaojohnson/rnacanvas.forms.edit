import * as styles from './TextInput.module.css';

export class TextInput {
  readonly domNode = document.createElement('input');

  constructor(readonly props?: Props) {
    this.domNode.type = 'text';

    this.domNode.classList.add(styles['text-input']);

    this.domNode.addEventListener('blur', () => this.#submit());

    this.domNode.addEventListener('keydown', event => {
      if (event.key.toLowerCase() == 'enter') {
        this.domNode.blur();
      }
    });

    // prevent paste events into this text input from being responded to by other parts of the app
    this.domNode.addEventListener('paste', event => event.stopPropagation());
  }

  #submit(): void {
    if (this.props?.onSubmit) {
      this.props.onSubmit();
    }
  }
}

type Props = {
  onSubmit?: () => void;
};
