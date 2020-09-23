import {
  Component, OnInit, Input, Inject, Optional, Self, HostBinding, ElementRef, OnChanges,
  SimpleChanges, AfterViewInit, Renderer2, ViewChild
} from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NgControl, FormControl, ValidationErrors } from '@angular/forms';
import IMask from 'imask';
import { debounceTime, tap } from 'rxjs/operators';
import { FloatLabelType, MatFormFieldAppearance } from '@angular/material/form-field';
import { ThemePalette } from '@angular/material/core';
import { AtlasFormFieldErrors } from '@wellsky/atlas-ui/core';
import { ATLAS_MERIDIAN, MERIDIAN, AtlasMeridian } from './atlas-meridian.constant';
import { AtlasTimeBounds } from './time-bounds.model';
import { AtlasTime } from './time.model';

@Component({
  selector: 'atlas-timepicker',
  templateUrl: './timepicker.component.html',
  providers: [
    {
      provide: ATLAS_MERIDIAN,
      useValue: MERIDIAN
    }
  ],
  exportAs: 'atlasTimepicker'
})
export class AtlasTimepicker implements OnInit, OnChanges, ControlValueAccessor, AfterViewInit {

  public dropdownTime: FormControl;
  public time: FormControl;
  public meridian: FormControl;
  public errorMessage: string;
  public meridianErrorMessage: string;
  public placeholder: string;
  public timepickerDropdown = [];
  public mask: any;
  public meridianState: string;
  public disableOptionCentering: boolean;

  // Meridian
  private atlasTime: AtlasTime;
  // Time Bounds
  private timeBounds: AtlasTimeBounds;
  private _errors: AtlasFormFieldErrors;
  private _localErrors: AtlasFormFieldErrors;
  private _fontSize: any;
  private _maskedTime: any;
  private defaultHoursStepper: number;
  private defaultMinsStepper: number;
  private defaultSecsStepper: number;
  private defaultStartTime: number;
  private defaultEndTime: number;

  @HostBinding('attr.dropdown') public dropdown: boolean;
  @ViewChild('matInput') matInput: ElementRef<HTMLElement>;
  @ViewChild('contentLabel') contentLabel: ElementRef<HTMLElement>;
  @ViewChild('labelContentData') labelContentData: ElementRef<HTMLElement>;

  @Input()
  isMeridian: boolean;

  @Input()
  debounceTime: number;

  @Input()
  fieldAppearance: MatFormFieldAppearance;

  @Input()
  floatLabel: FloatLabelType;

  @Input()
  hideRequiredMarker: boolean;

  @Input()
  required: boolean;

  /**
   * Input of input component: color
   * Supports three values: 'primary' | 'accent' | 'warn' | undefined
   */
  @Input()
  color: ThemePalette;

  @Input()
  disableRipple: boolean;

  @Input()
  hoursStepper: number;

  @Input()
  minsStepper: number;

  @Input()
  secsStepper: number;

  @Input()
  startTime: number;

  @Input()
  endTime: number;

  @Input()
  errors: AtlasFormFieldErrors;

  @Input()
  showSeconds: boolean;

  @Input('aria-label')
  ariaLabel: string;

  @Input('aria-labelledby')
  ariaLabelledby: string;

  @Input()
  label: string;

  @Input()
  disabled: boolean;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    @Inject(ATLAS_MERIDIAN) private atlasMeridian: AtlasMeridian,
    private fb: FormBuilder,
    public _elementRef: ElementRef,
    private renderer2: Renderer2
  ) {
    /**
      * Dropdown timepicker
    */
    this.dropdown = false;

    // Values: 'legacy' | 'standard' | 'fill' | 'outline'
    this.fieldAppearance = 'fill';

    // Values: 'auto' | 'always' | 'never'
    this.floatLabel = 'auto';

    // false: for hiding the required marker when required is enabled
    this.hideRequiredMarker = false;

    // Whether the timepicker is required
    this.required = false;

    // Label
    this.label = '';

    // Default Meridian
    this.isMeridian = false;

    // Default Seconds
    this.showSeconds = false;

    // Meridian
    this.meridianState = null;

    this.atlasTime = new AtlasTime();

    this.timeBounds = new AtlasTimeBounds(this.isMeridian);

    this.time = new FormControl(null);
    this.meridian = new FormControl(null);

    this.dropdownTime = new FormControl(null);

    // disabled
    this.disabled = false;

    // Debounce time in ms
    this.debounceTime = 300;

    this.placeholder = 'hh:mm';

    this.defaultHoursStepper = 1;
    this.defaultMinsStepper = 15;
    this.defaultSecsStepper = 60;

    this.hoursStepper = this.defaultHoursStepper;
    this.minsStepper = this.defaultMinsStepper;
    this.secsStepper = this.defaultSecsStepper;

    this.defaultStartTime = this.timeBounds.HOUR.min;
    this.defaultEndTime = this.timeBounds.HOUR.max + 1;

    this.startTime = this.defaultStartTime;
    this.endTime = this.defaultEndTime;

    // Errors
    this._errors = new AtlasFormFieldErrors();
    this._errors.setError('hourRangeError', 'Hour value is not in range');
    this._errors.setError('minRangeError', 'Minute value is not in range');
    this._errors.setError('secRangeError', 'Second value is not in range');
    this._errors.setError('meridianRequired', 'Input required');

    this.errors = new AtlasFormFieldErrors();
    this.errors.merge(this._errors.getErrors());

    // Creates a local copy of errors to exclude external/custom errors
    this._localErrors = new AtlasFormFieldErrors();
    this._localErrors.merge(this.errors.getErrors());

    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    // Set default color to 'accent'
    this.color = 'accent';

    // Set disableOptionCentering to true
    this.disableOptionCentering = true;

    // Set dropdown to true if attribute is present otherwise false
    this.dropdown = this._elementRef.nativeElement.hasAttribute('dropdown') ? true : null;

    // Handles user input in time control of timepicker
    this.time.valueChanges
      .pipe(
        tap((time) => {
          // Processing input value by defining mask value
          this.defineMaskPattern();
          if (this._maskedTime) {
            // Updating mask value based on input value
            this._maskedTime.updateOptions(this.mask);
            // Assigning input raw value back to IMask to update the view
            this._maskedTime.unmaskedValue = time ? time : '';
          }
        }),
        debounceTime(this.debounceTime)
      )
      .subscribe((time: string) => {

        // Convert string time value into AtlasTime
        this.atlasTime = this.stringToAtlasTimeParser(time);

        // To handle null inputs
        if (!this.atlasTime) {
          this.onChange(null);
          return;
        }

        // Validate raw time by using TimeBound Values
        this.validateTimeRange(this.atlasTime);

        this.updateError(this.time.invalid, this.time.errors || {}, this.errors);

        // If meridian is enabled
        if (this.isMeridian) {
          // Set meridianState
          this.meridianState = this.meridian.value;

          // Update time in hours
          this.atlasTime = this.getTimeInHours(this.atlasTime, this.meridianState);
        }

        this.onChange(this.atlasTime);
      });

    // Handles user input in meridian control of timepicker
    this.meridian.valueChanges
      .pipe(debounceTime(this.debounceTime))
      .subscribe((meridian: 'AM' | 'PM') => {
        if (!meridian) {
          // Emit null to CVA
          this.onChange(null);
          return;
        }

        // If meridian is enabled
        if (this.isMeridian && this.atlasTime) {
          // Set meridianState
          this.meridianState = this.meridian.value;

          // Convert string time value into AtlasTime
          this.atlasTime = this.stringToAtlasTimeParser(this.time.value);

          // Update time in hours
          this.atlasTime = this.getTimeInHours(this.atlasTime, this.meridianState);
        }

        this.onChange(this.atlasTime);

      });

    // Handles user input in dropdown timepicker
    this.dropdownTime.valueChanges
      .pipe(debounceTime(this.debounceTime))
      .subscribe(
        (options) => {
          if (!options) {
            // Emit null to CVA
            this.onChange(null);
            return;
          }
          // Convert string time value into AtlasTime
          this.atlasTime = this.stringToAtlasTimeParserForDropdown(options);

          if ((this.dropdownTime.valid || this.dropdownTime.disabled) && this.atlasTime) {
            // Emit time to CVA
            this.onChange(this.atlasTime);
          } else {
            // Emit null to CVA
            this.onChange(null);
          }
        }
      );
  }

  // Clears the error state from the control, if no internal library error present
  private clearErrorState(errors, _timeErrors) {
    const hasErrors = _timeErrors.some((err) => errors.has(err));

    if (!hasErrors) {
      this.time.setErrors(null);
      this.meridian.setErrors(null);
      this.updateError(this.ngControl.invalid, this.ngControl.errors, this.errors);
    }
  }

  ngOnInit() {
    // populate dropdown timepicker if dropdown attribute
    if (this.dropdown) {
      this.populateTimepickerDropdown();
    } else {
      // Processing input value by defining mask value
      this.defineMaskPattern();
    }

    this.ngControl.valueChanges.subscribe(
      () => {
        if (this.dropdown) {
          // Set errors from within component
          if (this.dropdownTime.invalid) {
            this.updateError(this.dropdownTime.invalid, this.dropdownTime.errors || {}, this.errors);
            return;
          }
          // Set errors from external component
          if (this.ngControl.invalid) {
            this.dropdownTime.setErrors(this.ngControl.errors);
          } else {
            this.dropdownTime.setErrors(null);
          }

          // Update errors
          this.updateError(this.ngControl.invalid, this.ngControl.errors, this.errors);
        } else {
          // Keeps library errors to control if available, when error from external control is removed
          if (this.ngControl.valid && this.time.errors) {
            const _timeErrors = Object.keys(this.time.errors);
            const errors: Map<string, string> = this._localErrors.getErrors();
            this.clearErrorState(errors, _timeErrors);
          }

          // An object containing errors from form control as well as ng control
          // Order will always be internal error on top and external error at bottom
          const currentErrors: ValidationErrors = {
            ...this.time.errors,
            ...this.ngControl.errors
          };

          // Set errors from within/outside component
          if (this.time.invalid || this.meridian.invalid || this.ngControl.invalid) {
            if (this.ngControl.invalid || this.time.invalid) {
              this.time.setErrors(currentErrors);
              this.ngControl.control.setErrors(currentErrors);
              this.updateError(this.time.invalid || this.ngControl.invalid, currentErrors || {}, this.errors);
            }
            // Validating meridian separately as for required state, we are setting 'meridianRequired' error
            if (this.isMeridian && this.meridian.invalid) {
              this.ngControl.control.setErrors(this.meridian.errors);
              this.meridian.setErrors({ meridianRequired: true });
              this.updateError(this.meridian.invalid, this.meridian.errors || {}, this.errors);
            }
          } else {
            this.time.setErrors(null);
            this.meridian.setErrors(null);
            this.ngControl.control.setErrors(null);
          }
        }
      });
  }

  // Reads and add dynamic label from ng-content to mat-label using cdkObserveContent
  labelContentChanged() {

    // Removing the mat-label content, if present before adding the updated label from ng-content
    if (this.labelContentData && this.labelContentData.nativeElement && this.labelContentData.nativeElement.childNodes.length) {
      this.labelContentData.nativeElement.innerHTML = '';
    }

    // Adding the child to the mat-label when label is available in ng-content
    if (this.contentLabel && this.contentLabel.nativeElement && this.contentLabel.nativeElement.children.length) {
      this.labelContentData.nativeElement.insertAdjacentHTML('beforeend', this.contentLabel.nativeElement.children[0].innerHTML);
    }
  }

  ngAfterViewInit() {

    this.labelContentChanged();

    // query select element
    const elMatSelect = document.querySelector('mat-select');

    if (elMatSelect) {
      // fetching font-size of select element
      const fontValue = getComputedStyle(elMatSelect).getPropertyValue('font-size').split('px');
      this._fontSize = Number(fontValue[0]);
    }
    if (!this.dropdown) {
      this.defineMaskPattern();
      this._maskedTime = IMask(this.matInput.nativeElement, this.mask);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    // On meridian change
    if (changes.isMeridian) {
      this.timeBounds = new AtlasTimeBounds(changes.isMeridian.currentValue);
      if (changes.isMeridian.currentValue) {
        this.meridianState = this.atlasTime ? this.getMeridianStatus(this.atlasTime.hour) : null;
      }

      if (this.dropdown) {
        // To calculate endTime for dropdown time values and update defaultEndTime
        this.defaultEndTime = changes.isMeridian.currentValue ? this.timeBounds.HOUR.max : this.timeBounds.HOUR.max + 1;
        this.endTime = this.defaultEndTime;
        // compute dropdown values
        this.populateTimepickerDropdown();
        this.dropdownTime.setValue(this.getViewTime(this.atlasTime, this.showSeconds, changes.isMeridian.currentValue, this.dropdown));
      } else {
        // time & meridian value changes
        this.time.setValue(this.getViewTime(this.atlasTime, this.showSeconds, changes.isMeridian.currentValue));
        this.meridian.setValue(this.meridianState);
      }
    }

    // On stepper and range change
    if (this.dropdown) {

      // Update the hour stepper if it falls in range otherwise assign default stepper value
      if (changes['hoursStepper']) {
        this.hoursStepper = this.validateHourStepperRange(changes['hoursStepper'].currentValue);
      }

      if (changes['minsStepper']) {
        // Second parameter value will be true if minutes
        this.minsStepper = this.validateMinAndSecStepperRange(changes['minsStepper'].currentValue, true);
      }

      if (changes['secsStepper']) {
        // Second parameter value will be false if seconds
        this.secsStepper = this.validateMinAndSecStepperRange(changes['secsStepper'].currentValue, false);
      }

      if (changes['startTime']) {
        this.startTime = this.validateStartTimeRange(changes['startTime'].currentValue);
      }

      if (changes['endTime']) {
        this.endTime = this.validateEndTimeRange(changes['endTime'].currentValue);
      }
      // compute dropdown values
      this.populateTimepickerDropdown();
    }

    // Merging errors from within component and external component
    if (changes.errors && changes.errors.currentValue instanceof AtlasFormFieldErrors) {
      this._errors.merge(changes.errors.currentValue.getErrors());
      this.errors = new AtlasFormFieldErrors();
      this.errors = this._errors;
    }

    // On seconds change
    if (changes.showSeconds) {
      this.placeholder = changes.showSeconds.currentValue ? 'hh:mm:ss' : 'hh:mm';

      if (this.dropdown) {
        // compute dropdown values
        this.populateTimepickerDropdown();
        this.dropdownTime.setValue(this.getViewTime(this.atlasTime, changes.showSeconds.currentValue, this.isMeridian, this.dropdown));
      } else {
        // time & meridian value changes
        this.time.setValue(this.getViewTime(this.atlasTime, changes.showSeconds.currentValue, this.isMeridian));
      }
    }
  }

  /**
   * Validate range of hour stepper value.
   * @param hourStepper: number
   * @Output() hourStepper: number
   */
  private validateHourStepperRange(hourStepper): number {
    if (hourStepper && ((this.isMeridian && hourStepper >= this.timeBounds.HOUR.min && hourStepper <= this.timeBounds.HOUR.max) ||
      (!this.isMeridian && hourStepper > this.timeBounds.HOUR.min && hourStepper <= this.timeBounds.HOUR.max + 1))) {
      return hourStepper;
    } else {
      let minHourValue = this.timeBounds.HOUR.min + 1;
      let maxHourValue = this.timeBounds.HOUR.max + 1;

      if (this.isMeridian) {
        minHourValue = this.timeBounds.HOUR.min;
        maxHourValue = this.timeBounds.HOUR.max;
      }

      console.error(`Atlas.UI Timepicker(dropdown): hourStepper(${hourStepper}) is not in a valid range. Please enter the stepper value between
        ${minHourValue} to ${maxHourValue}`);
      return this.defaultHoursStepper;
    }
  }

  /**
   * Validate range of minute and second stepper value.
   * @param stepperValue: number
   * @param isMinuteValue: boolean
   * @Output() stepperValue: number
   */
  private validateMinAndSecStepperRange(stepperValue, isMinuteValue): number {
    if (stepperValue && stepperValue > this.timeBounds.MINUTE.min && stepperValue <= this.timeBounds.MINUTE.max + 1) {
      return stepperValue;
    } else {
      const minHourValue = this.timeBounds.MINUTE.min + 1;
      const maxHourValue = this.timeBounds.MINUTE.max + 1;
      const stepper = isMinuteValue ? 'minsStepper' : 'secsStepper';

      console.error(`Atlas.UI Timepicker(dropdown): ${stepper}(${stepperValue}) is not in a valid range. Please enter the stepper value
      between ${minHourValue} to ${maxHourValue}`);

      if (isMinuteValue) {
        return this.defaultMinsStepper;
      } else {
        return this.defaultSecsStepper;
      }
    }
  }

  /**
   * Validate range of start time.
   * @param startTime: number
   * @Output startTime: number
   * If meridian is ON, then startTime ranges from 0 to 12
   * If meridian is OFF, then startTime ranges from 0 to 24
   */
  private validateStartTimeRange(startTime): number {
    if (startTime !== null && ((this.isMeridian && startTime >= this.timeBounds.HOUR.min - 1 && startTime <= this.timeBounds.HOUR.max) ||
      (!this.isMeridian && startTime >= this.timeBounds.HOUR.min && startTime <= this.timeBounds.HOUR.max + 1))) {
      if (startTime && startTime >= this.endTime) {
        console.error(`Atlas.UI Timepicker(dropdown): startTime(${startTime}) should not be greater than or equal to endTime(${this.endTime})`);
      } else {
        return startTime;
      }
    } else {
      let minHourValue = this.timeBounds.HOUR.min;
      let maxHourValue = this.timeBounds.HOUR.max + 1;

      if (this.isMeridian) {
        minHourValue = this.timeBounds.HOUR.min - 1;
        maxHourValue = this.timeBounds.HOUR.max;
      }

      console.error(`Atlas.UI Timepicker(dropdown): startTime(${startTime}) is not in a valid range. Please enter the value between
      ${minHourValue} to ${maxHourValue}`);

      return this.defaultStartTime;
    }
  }

  /**
   * Validate range of end time.
   * @param endTime: number
   * @Output endTime: number
   * If meridian is ON, then endTime ranges from 0 to 12
   * If meridian is OFF, then endTime ranges from 0 to 24
   */
  private validateEndTimeRange(endTime): number {
    if (endTime !== null && ((this.isMeridian && endTime >= this.timeBounds.HOUR.min - 1 && endTime <= this.timeBounds.HOUR.max) ||
      (!this.isMeridian && endTime >= this.timeBounds.HOUR.min && endTime <= this.timeBounds.HOUR.max + 1))) {
      if (endTime && endTime <= this.startTime) {
        console.error(`Atlas.UI Timepicker(dropdown): endTime(${endTime}) should not be less than or
        equal to startTime(${this.startTime})`);
      } else {
        return endTime;
      }
    } else {
      let minHourValue = this.timeBounds.HOUR.min;
      let maxHourValue = this.timeBounds.HOUR.max + 1;

      if (this.isMeridian) {
        minHourValue = this.timeBounds.HOUR.min - 1;
        maxHourValue = this.timeBounds.HOUR.max;
      }

      console.error(`Atlas.UI Timepicker(dropdown): endTime(${endTime}) is not in a valid range. Please enter the value between
        ${minHourValue} to ${maxHourValue}`);

      return this.defaultEndTime;
    }
  }

  /**
   * This function helps in defining pattern of mask. It provides flexibility when processing on input is needed.
   */
  private defineMaskPattern() {
    const time = this.time.value;
    if (time) {
      this.mask = {
        // Pattern mask is a string value
        mask: this.maskInputValue(time, this.isMeridian, this.showSeconds),
        definitions: {
          // <any single char>: <same type as mask (RegExp, Function, etc.)>
          // defaults are '0', 'a', '*'
          '#': /[0-5]/,
          '@': /[0-2]/,
          '$': /[01]/,
          '^': /[0-3]/
        }
      };
    } else {
      // Pattern mask is a string when we have time as null
      this.mask = {
        mask: '00:00'
      };
    }
  }

  /**
   * This function helps to mask time input in the required format hh:mm:ss or hh:mm
   * @param rawValue
   * @param meridian
   * @param showSeconds
   * @Output() mask: string
   * Sets the value for mask variable
   */
  private maskInputValue(rawValue, meridian, showSeconds): string {
    const separator = ':';
    let hours: string, mask: string, minutes: string, seconds: string;

    if (meridian) {
      // '$' defines /[01]/, '@' defines /[0-2]/, '^' defines /[0-3]/
      // '0' value stands for any digit
      hours = '$';
      hours += Number(rawValue.charAt(0)) === 1 ? '@' : '0';
    } else {
      hours = '@';
      hours += Number(rawValue.charAt(0)) === 2 ? '^' : '0';
    }

    // '#' defines /[0-5]/
    minutes = '{#}0';
    seconds = '{#}0';

    if (showSeconds) {
      mask = hours.concat(separator).concat(minutes).concat(separator).concat(seconds);
    } else {
      mask = hours.concat(separator).concat(minutes);
    }

    return mask;
  }

  // Get time in hours format
  private getTimeInHours(time: AtlasTime, meridian: string): AtlasTime {
    const hourTime = Object.assign({}, time);
    if (meridian === this.atlasMeridian.AM && time.hour === this.timeBounds.HOUR.max) {
      hourTime.hour = 0;
    } else if (meridian === this.atlasMeridian.PM && time.hour < this.timeBounds.HOUR.max) {
      hourTime.hour = time.hour + this.timeBounds.HOUR.max;
    }
    return hourTime;
  }

  // get error message
  getErrorMessage(activatedErrors: ValidationErrors, atlasErrors: AtlasFormFieldErrors) {
    let errorMessage = 'Invalid Time';
    const _activatedErrors = Object.keys(activatedErrors);
    const errors: Map<string, string> = atlasErrors.getErrors();
    for (let errorCode = 0; errorCode < _activatedErrors.length; errorCode++) {
      if (errors.has(_activatedErrors[errorCode])) {
        errorMessage = atlasErrors.getErrorMessage(_activatedErrors[errorCode]);
        break;
      }
    }
    return errorMessage;
  }

  // Updates error message according to the ValidationErrors
  updateError(isInputInvalid, activeErrors, errorSet): void {
    // Update error message
    if (isInputInvalid) {
      if (Object.keys(activeErrors)[0] === 'meridianRequired') {
        this.meridianErrorMessage = this.getErrorMessage(activeErrors, errorSet);
      } else {
        this.errorMessage = this.getErrorMessage(activeErrors, errorSet);
      }
    } else {
      this.errorMessage = '';
      this.meridianErrorMessage = '';
    }
  }

  // Checks the give value is in range or not
  private inRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  // Validate time
  private validateTimeRange(time: AtlasTime) {
    if (!this.inRange(time.hour, this.timeBounds.HOUR.min, this.timeBounds.HOUR.max)) {
      this.time.setErrors({ hourRangeError: true });
      this.ngControl.control.setErrors({ hourRangeError: true });
    } else if (!this.inRange(time.minute, this.timeBounds.MINUTE.min, this.timeBounds.MINUTE.max)) {
      this.time.setErrors({ minRangeError: true });
      this.ngControl.control.setErrors({ minRangeError: true });
    } else if (this.showSeconds && !this.inRange(time.second, this.timeBounds.SECOND.min, this.timeBounds.SECOND.max)) {
      this.time.setErrors({ secRangeError: true });
      this.ngControl.control.setErrors({ secRangeError: true });
    }
  }

  /**
 * Return the AtlasTime in string format
 * @param time: AtlasTime
 * @param isSecond: boolean
 */
  private getViewTime(time: AtlasTime, isSecond: boolean, isMeridian: boolean, isDropdown?: boolean): string {
    if (!time || (time.hour === null && time.minute === null && time.second === null)) {
      return null;
    }
    // Create a local copy for avoid altering the original source { time }
    let viewTime: AtlasTime = Object.assign({}, time);

    // Update the hours component
    if (isMeridian) {
      viewTime = this.getTimeInMeridian(viewTime);
    }

    // Computes and returns timeValue in required format
    let timeValue = `${this.pad(viewTime.hour)}:${this.pad(viewTime.minute)}`;

    // Append seconds only if required
    timeValue = isSecond ? timeValue + ':' + this.pad(viewTime.second) : timeValue;

    // Append meridian state only if dropdown
    timeValue = isMeridian && isDropdown ? timeValue + ' ' + this.meridianState : timeValue;

    return timeValue;
  }

  /**
   * Converts a number to string and pads/prefix a zero before is if it is single digit
   * @param number The number to be padded/prefixed with zero
   */
  private pad(number: number): string {
    let value = String(number);
    if (value.length < 2) {
      value = '0' + value;
    }
    return value;
  }

  /**
     * Returns the meridian status (AM/PM)
     * @param hour Hour value (0-23)
     */
  private getMeridianStatus(hour: number): string {
    if (hour) {
      return hour > this.timeBounds.HOUR.max - 1 ? this.atlasMeridian.PM : this.atlasMeridian.AM;
    } else {
      return null;
    }
  }

  /**
   * Converts time in string to AtlasTime
   * @param stringTimeValue Time in string formate separated by colon (hh:mm/hh:mm:ss)
   */
  private stringToAtlasTimeParser(stringTimeValue: string): AtlasTime {
    const localAtlasTime: AtlasTime = new AtlasTime();

    if (!(stringTimeValue && stringTimeValue.length)) {
      return null;
    }

    // Using entered time value and extracting hour, minutes and seconds
    const timeArray = stringTimeValue.split(':').join('').match(/.{1,2}/g);

    localAtlasTime.hour = timeArray[0] !== undefined ? Number(timeArray[0]) : -1;
    localAtlasTime.minute = timeArray[1] !== undefined ? Number(timeArray[1]) : -1;
    localAtlasTime.second = this.showSeconds ? (timeArray[2] !== undefined ? Number(timeArray[2]) : -1) : 0;

    return localAtlasTime;
  }

  /**
   * Converts time in string to AtlasTime
   * @param stringTimeValue Time in string formate separated by colon (hh:mm/hh:mm:ss)
   */
  private stringToAtlasTimeParserForDropdown(value: string): AtlasTime {
    // If meridian is enabled
    if (this.isMeridian) {
      const stringTimeDropdownArray = value.split(' ');
      const timeValue = stringTimeDropdownArray[0], meridian = stringTimeDropdownArray[1];

      // Convert string time value into AtlasTime
      this.atlasTime = this.stringToAtlasTimeParser(timeValue);
      // Set meridianState
      this.meridianState = meridian;

      if (this.atlasTime) {
        // Update time in hours
        this.atlasTime = this.getTimeInHours(this.atlasTime, this.meridianState);
      }
    } else {
      this.atlasTime = this.stringToAtlasTimeParser(value);
    }

    return this.atlasTime;
  }

  /**
   * Returns AtlasTime in meridian
   * @param time AtlasTime in hours
   */
  private getTimeInMeridian(time: AtlasTime): AtlasTime {
    const timeInMeridian: AtlasTime = Object.assign({}, time);
    if (timeInMeridian.hour) {
      timeInMeridian.hour = ((timeInMeridian.hour + 11) % 12 + 1);
    }
    return timeInMeridian;
  }

  // Calculate time when meridian is ON
  private prepareMeridianTimes(meridian, startTime, endTime) {
    // hour loop
    for (let hours = startTime; hours < endTime; hours += this.hoursStepper) {

      // pad '0' if length is < 2
      let currentHour = this.pad(hours);

      // minutes loop
      for (let mins = 0; mins < 60; mins += this.minsStepper) {

        // pad '0' if length is < 2
        const currentMin = this.pad(mins);

        // seconds loop
        for (let secs = 0; secs < 60; secs += this.secsStepper) {

          // pad '0' if length is < 2
          const currentSec = this.pad(secs);

          // To start with value 12 when Meridian ON
          if (currentHour === '00') { currentHour = '12'; }

          // Populate timepicker dropdown array
          if (this.showSeconds) {
            this.timepickerDropdown.push(currentHour + ':' + currentMin + ':' + currentSec + ' ' + meridian);
          } else {
            this.timepickerDropdown.push(currentHour + ':' + currentMin + ' ' + meridian);
          }
        }
      }
    }
  }

  // Calculate time when meridian is OFF
  private prepareTwentyFourHourTimes(startTime, endTime) {
    // hour loop
    for (let hours = startTime; hours < endTime; hours += this.hoursStepper) {
      // pad '0' if length is < 2
      const currentHour = this.pad(hours);

      // minute loop
      for (let mins = 0; mins < 60; mins += this.minsStepper) {
        // pad '0' if length is < 2
        const currentMin = this.pad(mins);

        // seconds loop
        for (let secs = 0; secs < 60; secs += this.secsStepper) {
          // pad '0' if length is < 2
          const currentSec = this.pad(secs);

          // Populate timepicker dropdown array
          if (this.showSeconds) {
            this.timepickerDropdown.push(currentHour + ':' + currentMin + ':' + currentSec);
          } else {
            this.timepickerDropdown.push(currentHour + ':' + currentMin);
          }
        }
      }
    }
  }

  /**
   * Populates timepicker dropdown if dropdown attribute is passed
   */
  populateTimepickerDropdown() {
    this.timepickerDropdown = [];
    if (this.isMeridian) {
      this.prepareMeridianTimes('AM', this.startTime, this.endTime);
      this.prepareMeridianTimes('PM', this.startTime, this.endTime);
    } else {
      this.prepareTwentyFourHourTimes(this.startTime, this.endTime);
    }
  }

  /**
   * To open the overlay panel from bottom of the select control when isPanelToggled
   * @param isPanelToggled
   */
  public isPanelToggled(isPanelToggled: boolean): void {
    // If select panel is open
    if (isPanelToggled && document.querySelector('.mat-select-panel-wrap')) {
      //  Compute margin-top based on the font-size of parent element
      const panel = document.querySelector('.mat-select-panel-wrap').parentElement as HTMLElement;
      this.renderer2.setStyle(panel, 'margin-top', this._fontSize * 2 + 'px');
    }
  }

  // -----------ControlValueAccessor-----------------
  // Function to call when the change detects.
  onChange = (time: AtlasTime) => { };
  // Function to call when the input is touched.
  onTouched = () => { };
  // Allows Angular to update the model.
  writeValue(time: AtlasTime): any {
    if (time && time['value']) {
      time = time['value'];
    }

    // Update the model and changes needed for the view here.
    if (time && !(isNaN(time.hour) || isNaN(time.minute) || isNaN(time.second))) {
      this.atlasTime = { ...time };

      // If meridian is enabled
      if (this.isMeridian) {
        // Set meridianState
        this.meridianState = this.getMeridianStatus(this.atlasTime.hour);

        // Validate raw time by using TimeBound Values
        this.validateTimeRange(this.getTimeInMeridian(this.atlasTime));

      } else {
        // Validate raw time by using TimeBound Values
        this.validateTimeRange(this.atlasTime);
      }
      this.updateError(this.time.invalid, this.time.errors || {}, this.errors);

      if (this.dropdown) {
        // Set dropdown time
        this.dropdownTime.setValue(this.getViewTime(time, this.showSeconds, this.isMeridian, this.dropdown));
      } else {
        // Set time & meridian value
        this.time.setValue(this.getViewTime(time, this.showSeconds, this.isMeridian));
        this.meridian.setValue(this.meridianState);
      }
    } else {
      // Dropdown
      if (this.dropdown) {
        this.dropdownTime.setValue(null);
      } else {
        // Input
        this.time.setValue(null);
        this.meridian.setValue(null);
      }
      if (time !== null) {
        console.error(`Atlas.UI Timepicker: Value is not of type AtlasTime`);
      }
    }
  }

  // Allows Angular to register a function to call when the model changes.
  registerOnChange(fn: (input: any) => void): void {
    // Save the function as a property to call later here.
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // Save the function as a property to call later here.
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      if (this.dropdown) {
        this.dropdownTime.disable();
      } else {
        this.time.disable();
        this.meridian.disable();
      }
    } else {
      if (this.dropdown) {
        this.dropdownTime.enable();
      } else {
        this.time.enable();
        this.meridian.enable();
      }
    }
  }
}
