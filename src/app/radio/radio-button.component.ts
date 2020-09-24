import { Component, Input, EventEmitter, Injector, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

import { AtlasErrorsHandlerService } from '@wellsky/atlas-ui/core';
import { AtlasRadioGroupConfig } from './radio-group.model';
import { MatRadioChange } from '@angular/material/radio';

// Global counter variable for assigning dynamic id
let nextUniqueId = 0;

@Component({
  selector: 'atlas-radio-button',
  templateUrl: './radio-button.component.html',
  exportAs: 'atlasRadioButton'
})
export class AtlasRadioButton {

  private _caption: string;
  private _labelPosition: string;
  public errorsHandlerService: AtlasErrorsHandlerService;
  public radioButtons: any;

  // To be read after element's label and field type
  @Input('aria-describedby')
  ariaDescribedby: string;

  // To set the 'aria-label' attribute on the underlying input element.
  @Input('aria-label')
  ariaLabel: string;

  // To set the element's text alternative.
  @Input('aria-labelledby')
  ariaLabelledby: string;

  // To set the caption text for radio buttons
  @Input()
  public set caption(caption: string) {
    try {
      this._caption = caption;
      if (caption && caption.length > 150) {
        this._caption = '';
        throw new Error(`Caption for length exceeds 150 character limit`);
      }
    } catch (error) {
      this.errorsHandlerService.handleError(error);
    }
  }
  public get caption(): string {
    return this._caption;
  }

  // To get the checked(boolean) value
  @Input() checked: boolean;

  // To set the theme
  @Input()
  color: ThemePalette;

  // To disable the ripples
  @Input()
  disableRipple: boolean;

  // To set the button to be disabled
  @Input() disabled: boolean;

  /**
   * Set Id for the radio button
   */
  @Input()
  id: string;

  // To set the id for native radio input element
  @Input()
  inputId: string;

  // To set the position for the label
  @Input()
  public set labelPosition(labelPosition: string) {
    try {
      this._labelPosition = labelPosition;
      if (labelPosition && (labelPosition !== 'before') && (labelPosition !== 'after')) {
        this._labelPosition = '';
        throw new Error(`Label position for radio button '${this.id}' should be 'before' or 'after'`);
      }
    } catch (error) {
      this.errorsHandlerService.handleError(error);
    }
  }
  public get labelPosition(): string {
    return this._labelPosition;
  }

  // To set the name attribute
  @Input()
  name: string;

  // To declare the radio group for the buttons
  @Input()
  radioGroup: AtlasRadioGroupConfig;

  // To set the required indication on radio buttons
  @Input()
  required: boolean;

  // To set the value for radio buttons
  @Input()
  value: any;

  // To return the value selected call back
  @Output()
  change = new EventEmitter<MatRadioChange>();

  // To emit the selected values
  public selectedOption(event: MatRadioChange): void {
    if (this.change) {
      this.change.emit(event);
    }
  }

  constructor(private _injector: Injector) {
    // setting default id of radio button when not passed by user
    this.id = `atlas-radio-button-${nextUniqueId++}`;

    this._caption = '';
    this.errorsHandlerService = this._injector.get(AtlasErrorsHandlerService);

    // To set the default values
    this.ariaLabel = '';
    this.ariaLabelledby = null;
    this.checked = false;
    this.color = 'accent';
    this.disabled = false;
    this.disableRipple = false;
    this.name = null;
    this.required = false;
    this.value = '';
  }
}
