import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AtlasFormFieldExtras, AtlasFormFieldErrors } from '@wellsky/atlas-ui/core';
import { AtlasInput } from '../input.component';

@Component({
  selector: 'atlas-input-test',
  template: `
  <atlas-input
    #amount
    [formControl]="amountFormControl"
    [maxLength]="maxLength"
    [placeholder]="placeholder"
    [label]="label"
    [id]="id"
    [options]="options"
    [errors]="customErrors"
    [required]="required"
    [tabIndex]="tabIndex">
  </atlas-input>

  <atlas-input
    [(ngModel)]="inputTemplateDriven"
    [ngModelOptions]="{standalone: true}"
    [maxLength]="maxLength"
    [placeholder]="placeholder"
    [label]="label"
    [disabled]="disabled"
    [id]="'inputModel'"
    [options]="options"
    [required]="required"
    [tabIndex]="tabIndex">
  </atlas-input>

  <atlas-input
    #tel
    [formControl]="telephoneFormControl"
    [type]="'tel'"
    [id]="id"
    [placeholder]="'Enter Phone Number'"
    [maskConfig]="telMaskConfig"
    [tabIndex]="tabIndex">
    <span label>{{labelValue}}</span>
  </atlas-input>
  `
})
export class AtlasInputTestComponent {

  private _disabled: boolean;

  public get disabled(): boolean {
    return this._disabled;
  }
  public set disabled(value: boolean) {
    this._disabled = value;
    if (this.amountFormControl) {
      if (value) {
        this.amountFormControl.disable();
      } else {
        this.amountFormControl.enable();
      }
    }
  }

  divider: boolean;
  disableRipple: boolean;
  amountFormControl: FormControl;
  telephoneFormControl: FormControl;
  telMaskConfig: object;
  inputTemplateDriven: string;
  placeholder: string;
  label: string;
  id: string;
  maxLength: number;
  options: AtlasFormFieldExtras;
  customErrors: AtlasFormFieldErrors;
  required: boolean;
  tabIndex: number;
  labelValue: string;

  @ViewChild('amount') atlasInput: AtlasInput;
  @ViewChild('tel') atlasInputTelephone: AtlasInput;

  constructor() {

    this.tabIndex = 0;
    this.disabled = false;
    this.divider = false;
    this.disableRipple = false;
    this.placeholder = 'Enter Here';
    this.label = 'Enter Here';
    this.labelValue = 'Test Label';
    this.amountFormControl = new FormControl(
      { value: '', disabled: this.disabled },
      [
        Validators.required,
        Validators.maxLength(10)
      ]
    );
    this.telephoneFormControl = new FormControl('0123456789');
    this.options = { clearButton: false, charCounter: false };
  }

  changeLabel() {
    this.labelValue = 'New Label';
  }

}
