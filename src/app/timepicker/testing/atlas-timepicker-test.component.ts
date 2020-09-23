import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { AtlasFormFieldErrors } from '@wellsky/atlas-ui/core';
import { AtlasTime } from '../time.model';
import { AtlasTimepicker } from '../timepicker.component';

/** Test component that contains an AtlasTimepicker. */
@Component({
  selector: 'atlas-test-app',
  template: `
  <div class="row mb-4">
    <div class="col-12">
      <h3 class="mat-display-1 mb-0">Basic Timepicker</h3>
    </div>
  </div>
  <!-- Form Control -->
  <div class="row mb-4">
    <!-- Input Timepicker -->
    <div class="col-12 col-md-6 mb-4">
      <p class="mat-title">Input Timepicker</p>
        <atlas-timepicker
        #inputTimepicker
        [formControl]="textInputFormControl"
        [isMeridian]="isMeridian"
        [showSeconds]="showSeconds"
        [required]="required"
        [errors]= "customErrors"
        [hideRequiredMarker]="hideRequiredMarker"
        [label]="label">
        </atlas-timepicker>
    </div>
    <!-- Dropdown Timepicker -->
    <div class="col-12 col-md-6">
      <p class="mat-title">Dropdown Timepicker</p>
      <h2 class="mat-subheading-2">Default stepper values => Hour: 1, Minute: 15</h2>
      <atlas-timepicker
        dropdown
        #dropdownTimepicker
        [formControl]="dropdownFormControl"
        [fieldAppearance]="'fill'"
        [hoursStepper]="hoursStepper"
        [minsStepper]="minsStepper"
        [secsStepper]="secsStepper"
        [isMeridian]="isMeridian"
        [showSeconds]="showSeconds"
        [startTime]="startTime"
        [endTime]="endTime"
        [required]="required">
      </atlas-timepicker>
    </div>
  </div>
  <!-- Template Driven -->
  <div class="row mb-4">
    <!-- Input Timepicker -->
    <div class="col-12 col-md-6 mb-4">
      <p class="mat-title">Input Timepicker</p>

      <atlas-timepicker
        #inputTempTimepicker
        [(ngModel)]="textInputTemplate"
        [isMeridian]="isMeridian"
        [showSeconds]="showSeconds"
        [disabled]="disabled"
        [required]="required">
        <span label>{{labelValue}}</span>
      </atlas-timepicker>
    </div>

    <!-- Dropdown Timepicker -->
    <div class="col-12 col-md-6">
      <p class="mat-title">Dropdown Timepicker</p>
      <atlas-timepicker
        dropdown
        #dropdownTempTimepicker
        [(ngModel)]="dropdownTemplate"
        [fieldAppearance]="'fill'"
        [hoursStepper]="hoursStepper"
        [minsStepper]="minsStepper"
        [secsStepper]="secsStepper"
        [isMeridian]="isMeridian"
        [showSeconds]="showSeconds"
        [startTime]="startTime"
        [endTime]="endTime"
        [disabled]="disabled"
        [required]="required">
      </atlas-timepicker>
    </div>
  </div>

  <!-- Input Timepicker -->
  <div class="col-12 col-md-6 mb-4">
    <p class="mat-title">Input Timepicker</p>
      <atlas-timepicker
      [formControl]="time"
      [required]="required">
      </atlas-timepicker>
  </div>
  `
})
export class AtlasTimepickerTestComponent {
  textInputFormControl: FormControl;
  dropdownFormControl: FormControl;
  time: FormControl;
  textInputTemplate: AtlasTime;
  dropdownTemplate: AtlasTime;
  timeValue: AtlasTime;
  isMeridian: boolean;
  showSeconds: boolean;
  disabled: boolean;
  startTime: number;
  endTime: number;
  hoursStepper: number;
  minsStepper: number;
  secsStepper: number;
  defaultHoursStepper: number;
  defaultMinsStepper: number;
  defaultSecsStepper: number;
  defaultStartTime: number;
  defaultEndTime: number;
  customErrors: AtlasFormFieldErrors;
  required: boolean;
  hideRequiredMarker: boolean;
  placeholder: string;
  label: string;
  labelValue: string;

  @ViewChild('inputTimepicker') inputTimepicker: AtlasTimepicker;
  @ViewChild('dropdownTimepicker') dropdownTimepicker: AtlasTimepicker;
  @ViewChild('inputTempTimepicker') inputTempTimepicker: AtlasTimepicker;
  @ViewChild('dropdownTempTimepicker') dropdownTempTimepicker: AtlasTimepicker;

  constructor() {
    this.disabled = false;
    this.customErrors = new AtlasFormFieldErrors();

    this.textInputFormControl = new FormControl(null, [
      this.timeRangeValidator(),
      Validators.required
    ]);
    this.dropdownFormControl = new FormControl({ value: null, disabled: false });
    this.textInputTemplate = null;
    this.dropdownTemplate = null;
    this.showSeconds = false;
    this.isMeridian = false;

    this.time = new FormControl(null, [
      this.timeRangeValidator()
    ]);

    this.required = false;
    this.hideRequiredMarker = false;
    this.labelValue = 'Test Label';
    this.label = 'Test';

    this.defaultHoursStepper = 1;
    this.defaultMinsStepper = 15;
    this.defaultSecsStepper = 60;

    this.hoursStepper = this.defaultHoursStepper;
    this.minsStepper = this.defaultMinsStepper;
    this.secsStepper = this.defaultSecsStepper;

    this.defaultStartTime = 0;
    this.defaultEndTime = this.isMeridian ? 12 : 24;

    this.startTime = this.defaultStartTime;
    this.endTime = this.defaultEndTime;
  }

  /**
  * Validator that checks whether input time value is in particular range.
  *
  * @param {AbstractControl} control
  * @returns {{ [key: string]: boolean }}
  *
  */
  timeRangeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value && control.value.hour > 6 && control.value.hour < 10) {
        return { 'timeRangeError': control.value };
      }
      return null;
    };
  }

  changeLabel() {
    this.labelValue = 'New Label';
  }
}

