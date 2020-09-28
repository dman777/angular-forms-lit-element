import { css } from 'lit-element';

export const timePickerStyles = css`
  :host {
    width: 300px;
    height: 140px;
    display: flex;
    justify-content: center;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }

  .body {
    display: flex;
  }

  .body > div {
    width: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  div.colon {
    justify-content: center;
    font-size: 28px;
    width: 3px;
    height: 131px;
  }

  mwc-textfield {
    --mdc-text-field-idle-line-color: inherit;
    --mdc-text-field-fill-color: none;
    --mdc-text-field-idle-line-color: transparent;
    --mdc-text-field-outlined-hover-border-color: transparent;
    --mdc-text-field-hover-line-color: transparent;
    top: 40px;
    height: 30%;
    width: 84%;
  }

  .meridian {
    width: 100%;
  }

  mwc-textfield > label {
    background-color: red;
  }

  mwc-button {
    margin: 4px 0 2px 0;
    --mdc-typography-button-font-size: 16px;
    --mdc-typography-button-font-weight: 400;
    --mdc-theme-on-primary: black;
    --mdc-theme-primary: rgba(0, 0, 0, 0.87);
  }
`;

