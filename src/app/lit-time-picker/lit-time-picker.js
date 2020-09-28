import { LitElement, html, css } from 'lit-element';
import moment from 'moment';
import { timePickerStyles } from './time-picker.css.js'
import '@material/mwc-icon-button';
import '@material/mwc-textfield';
import '@material/mwc-button';


const hour = (hour, changeTimeFromArrow, onChange) => {
  return html`
    <div data-unit="hour">
      <mwc-icon-button
        @click="${changeTimeFromArrow}"
        data-op="add"
        data-unit="hour">
        <img src="assets/up-arrow-icon.svg"></img>
      </mwc-icon-button>

      <mwc-textfield
        @change="${onChange}"
        size="2"
        pattern="[0-9]+"
        data-unit="hour"
        data-format="hh"
        value="${hour}"></mwc-textfield>

      <mwc-icon-button
        @click="${changeTimeFromArrow}"
        data-op="subtract"
        data-unit="hour">
        <img src="assets/down-arrow-icon.svg"></img>
      </mwc-icon-button>
    </div>
  `;
}

const minutes = (minutes, changeTimeFromArrow, onChange) => {
  return html`
    <div data-unit="hour">
      <mwc-icon-button
        @click="${changeTimeFromArrow}"
        data-op="add"
        data-unit="minutes">
        <img src="assets/up-arrow-icon.svg"></img>
      </mwc-icon-button>

      <mwc-textfield
        @change="${onChange}"
        size="2"
        pattern="[0-9]+"
        data-unit="minute"
        data-format="mm"
        value="${minutes}"></mwc-textfield>

      <mwc-icon-button
        @click="${changeTimeFromArrow}"
        data-op="subtract"
        data-unit="minutes">
        <img src="assets/down-arrow-icon.svg"></img>
      </mwc-icon-button>
    </div>
  `;
}

const seconds = (seconds, changeTimeFromArrow, onChange) => {
  return html`
    <div data-unit="seconds">
      <mwc-icon-button
        @click="${changeTimeFromArrow}"
        data-op="add"
        data-unit="seconds">
        <img src="assets/up-arrow-icon.svg"></img>
      </mwc-icon-button>

      <mwc-textfield
        @change="${onChange}"
        size="2"
        pattern="[0-9]+"
        data-unit="second"
        data-format="ss"
        value="${seconds}"></mwc-textfield>

      <mwc-icon-button
        @click="${changeTimeFromArrow}"
        data-op="subtract"
        data-unit="seconds">
        <img src="assets/down-arrow-icon.svg"></img>
      </mwc-icon-button>
    </div>
  `;
}

const meridian = (meridian, toggleMeridianFromArrow) => {
  return html`
    <div>
      <mwc-icon-button @click="${toggleMeridianFromArrow}">
        <img src="assets/up-arrow-icon.svg"></img>
      </mwc-icon-button>

      <mwc-button
        @click="${toggleMeridianFromArrow}"
        label="${meridian}"
      ></mwc-button>

      <mwc-icon-button
        @click="${toggleMeridianFromArrow}">
        <img src="assets/down-arrow-icon.svg"></img>
      </mwc-icon-button>
    </div>
  `;
}

class TimePicker extends LitElement {
  static get styles() {
    return [
      timePickerStyles,
    ];
  }

  static get properties() {
    return {
      hour: { type: Number },
      minutes: { type: Number },
      seconds: { type: Number },
      meridian: { type: String },
      momentObj: { type: Object },
      timeDateStamp: {
        type: String,
        attribute: 'time-date-stamp',
      },
    }
  }

  constructor() {
    super();
    this.timeDateStamp = moment().toDate().toISOString();
  }

  render() {
    return html`

      <div class="body">
        ${hour(this.hour, this.changeTimeFromArrow, this.onChange)}
        <div class="colon">:</div>
        ${minutes(this.minutes, this.changeTimeFromArrow, this.onChange)}
        <div class="colon">:</div>
        ${seconds(this.seconds, this.changeTimeFromArrow, this.onChange)}
        ${meridian(this.meridian, this.toggleMeridianFromArrow)}
      </div>

    `;
  }

  dissectEventObj(e) {
    const unit = e.target.dataset.unit;
    const op = e.target.dataset.op;
    const value = e.target.value;
    const format = e.target.format;

    return { unit, op, value, format };
  }

  changeTimeFromArrow(e) {
    const { unit, op } = this.dissectEventObj(e);
    this.setTimeDateStampRaw((momentObj) => { momentObj[op](1, unit); });
  }

  toggleMeridianFromArrow() {
    this.setTimeDateStampRaw((momentObj) => { momentObj.add('12', 'hours'); });
  }

  fireTimeChangeEvent() {
    const event = new CustomEvent('time-changed', {
      detail: {
        timeStampISO: this.timeDateStamp,
        momentObj: moment(this.timeDateStamp),
      }
    });
    this.dispatchEvent(event);
  }

  set timeDateStamp(value) {
    this._timeDateStamp = value;
    const momentObj = moment(value).local();
    this.hour = momentObj.format('hh');
    this.minutes =  momentObj.minutes();
    this.seconds =  momentObj.seconds();
    this.meridian = momentObj.format('A');
    this.fireTimeChangeEvent();
  }

  setTimeDateStampRaw(callback) {
    const momentObj = moment(this.timeDateStamp);
    callback(momentObj)
    this.timeDateStamp = momentObj.toDate().toISOString();
  }

  get timeDateStamp() {
    return this._timeDateStamp;
  }

  onChange(e) {
    const el = e.composedPath()[0];

    const { unit, value } = this.dissectEventObj(e);
    const isValid = moment(value, `${unit} A`).isValid();

    if (!isValid) {
      el.setCustomValidity();
      el.focus();
    } else {
      el.setCustomValidity('');
      this.setTimeDateStampRaw((momentObj) => {momentObj[unit](value);});
    }
  }

}

customElements.define('lit-time-picker', TimePicker);
