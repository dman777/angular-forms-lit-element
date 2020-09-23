import {
  Component,
  OnInit,
  Input,
  Optional,
  Self,
  ChangeDetectorRef,
  NgZone,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormControl, Validators, ControlValueAccessor, ValidationErrors, NgControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';

// Models
import { FloatLabelType, MatFormFieldAppearance } from '@angular/material/form-field';
import { ThemePalette } from '@angular/material/core';
import { AtlasFormFieldExtras, AtlasFormFieldErrors } from '@wellsky/atlas-ui/core';
import IMask from 'imask';

let nextUniqueId = 0;

@Component({
  selector: 'atlas-input',
  templateUrl: './input.component.html',
  exportAs: 'atlasInput'
})
export class AtlasInput implements OnInit, ControlValueAccessor, AfterViewInit, OnChanges, OnDestroy {

  private _errors: AtlasFormFieldErrors;
  private _maxLength: number;
  private _showClearButton: boolean;
  private _maskedInput: any;
  private _options: AtlasFormFieldExtras;
  private _uid = `atlas-input-${nextUniqueId++}`;
  private _id: string;

  currentInputLength: number;
  errorMessage: string;
  inputControl: FormControl;
  value: any;
  maskedValue: any;

  @ViewChild('matInput') matInput: ElementRef<HTMLElement>;
  @ViewChild('contentLabel') contentLabel: ElementRef<HTMLElement>;
  @ViewChild('labelContentData') labelContentData: ElementRef<HTMLElement>;

  @Input()
  debounceTime: number;

  @Input()
  get disabled(): boolean {
    return this.inputControl.disabled;
  }
  set disabled(disabled: boolean) {
    if (this.inputControl) {
      if (disabled) {
        this.inputControl.disable();
      } else {
        this.inputControl.enable();
      }
    }
  }

  @Input()
  get errors(): AtlasFormFieldErrors {
    return this._errors;
  }
  set errors(errors: AtlasFormFieldErrors) {
    if (errors) {
      this._errors = errors;
    }
  }

  /**
    * Input of checkbox component: id
    * Gives ID to the <atlas-input> component
    */
  @Input()
  set id(value: string) {
    // If id is passed from external component then assign or else assign id from within the component
    this._id = value || this._uid;
  }
  get id(): string { return this._id; }

  /**
   * Set Tab index for Input
   */
  @Input()
  tabIndex: number;


  @Input()
  fieldAppearance: MatFormFieldAppearance;

  @Input()
  floatLabel: FloatLabelType;

  @Input()
  hideRequiredMarker: boolean;

  @Input()
  hintEnd: string;

  @Input()
  hintStart: string;

  @Input()
  label: string;

  @Input()
  get maxLength(): number {
    return this._maxLength;
  }
  set maxLength(maxLength: number) {
    this._maxLength = maxLength;
  }

  @Input()
  placeholder: number;

  @Input()
  required: boolean;

  @Input()
  type: string;


  @Input()
  get options(): AtlasFormFieldExtras {
    return this._options;
  }
  set options(options: AtlasFormFieldExtras) {
    if (options) {
      this._options = options;
    }
  }

  /**
   * @deprecated: This property is getting deprecated instead use options
   */
  @Input()
  get enable(): AtlasFormFieldExtras {
    return this._options;
  }
  set enable(options: AtlasFormFieldExtras) {
    console.warn(`Atlas.UI: 'enable' property is getting deprecated, please use 'options' instead.`);
    if (options) {
      this._options = options;
    }
  }

  /**
   * Input of input component: color
   * Supports three values: 'primary' | 'accent' | 'warn' | undefined
   */
  @Input()
  color: ThemePalette;

  /**
   * mask to be supplied from the user
   */
  @Input()
  maskConfig: any;


  constructor(
    @Optional() @Self() public ngControl: NgControl,
    public elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
    private _cdr: ChangeDetectorRef,
    private _ngZone: NgZone
  ) {
    // Values: 'legacy' | 'standard' | 'fill' | 'outline'
    this.fieldAppearance = 'fill';

    // Values: 'auto' | 'always' | 'never'
    this.floatLabel = 'auto';

    // false: for hiding the required marker when required is enabled
    this.hideRequiredMarker = false;

    // Hint Start
    this.hintStart = '';

    // Hint End
    this.hintEnd = '';

    // Label
    this.label = '';

    // Values: color | date | datetime-local |email | month | number | password | search | tel | text | time | url | week
    this.type = 'text';

    // Extras
    this.options = {
      clearButton: false,
      charCounter: false
    };

    // Max-length
    this.maxLength = 256;

    // Form Control
    this.inputControl = new FormControl(
      '',
      [
        Validators.maxLength(this.maxLength),
      ],
    );

    // Required
    this.required = false;

    // Debounce time in ms
    this.debounceTime = 0;

    // Errors
    this.errors = new AtlasFormFieldErrors();

    // Default char count
    this.currentInputLength = 0;

    // Replace the provider from above with this.
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    // Set default color to 'accent'
    this.color = 'accent';

    // Set value to ID
    this.id = this.id;

    // Set default value to tabIndex
    this.tabIndex = 0;

    // Set the mask as null as default
    // Takes config from the imask library maskOptions
    this.maskConfig = null;

    // Set the value (eg: 0000000000) for the inputControl
    this.value = null;

    // Sets the masked value (eg: 000-000-0000) for the inputControl
    this.maskedValue = null;

    // Handles user input
    this.inputControl.valueChanges.
      pipe(
        debounceTime(this.debounceTime)
      ).subscribe((inputValue) => {
        // Emit value to CVA
        if (this._maskedInput) {
          this.maskedValue = this._maskedInput.value;
          this.value = this._maskedInput.unmaskedValue;
          this.onChange(this._maskedInput.unmaskedValue);
        } else {
          this.maskedValue = inputValue;
          this.value = inputValue;
          this.onChange(inputValue);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.maskConfig && this._maskedInput) {
      this._maskedInput.updateOptions(changes.maskConfig.currentValue);
    }
  }

  private setErrors(): void {
    if (this.ngControl.invalid) {
      this.inputControl.setErrors(this.ngControl.errors);
    } else {
      this.inputControl.setErrors(null);
    }
  }

  private updateErrors(inputValue:string): void {
    this.updateError(
      this.ngControl.invalid,
      this.ngControl.errors,
      this.errors,
    );
  }

  private setInputDisabledState(): void {
    if (this.ngControl.disabled !== this.inputControl.disabled) {
      this.disabled = this.ngControl.disabled;
    }
  }

  ngOnInit() {
    // Get and update the errors on inputControl
    if (this.ngControl === null) { return; }

    this.ngControl.statusChanges.subscribe(
      (inputValue) => {
        this.setInputDisabledState();
        this.setErrors();
        this.updateErrors(inputValue);
      });

    this.ngControl.valueChanges.subscribe((inputValue) => {
      this.updateCharCount(inputValue);
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
    this._focusMonitor.monitor(this.elementRef.nativeElement, true)
      .subscribe(origin => this._ngZone.run(() => {
        this._showClearButton = this.formatOrigin(origin);
        this._cdr.markForCheck();
      }));

    if (this.type === 'tel' && !this.maskConfig) {
      this.maskConfig = {
        mask: '000-000-0000'
      };
    }
    if (this.maskConfig) {
      this._maskedInput = IMask(this.matInput.nativeElement, this.maskConfig);
    }
    this.labelContentChanged();
  }

  // Clears input value
  public clear(event) {
    // Prevents the datepicker popup to get opened
    event.stopPropagation();

    // Update char count
    this.updateCharCount(null);

    // Sets input value to null
    this.inputControl.setValue(null);

    this.showClearButton();
  }

  // To show the clear button
  public showClearButton(): boolean {
    if (this.options.clearButton && this.inputControl.valid && this.inputControl.value && this._showClearButton) {
      return true;
    } else {
      return false;
    }
  }

  private formatOrigin(origin: FocusOrigin): boolean {
    return origin ? true : false;
  }

  // get error message
  private getErrorMessage(
    activatedErrors: ValidationErrors,
    atlasErrors: AtlasFormFieldErrors,
  ): string {
    const _activatedErrors = Object.keys(activatedErrors);
    const errors: Map<string, string> = atlasErrors.getErrors();

    const error = _activatedErrors.find((errorCode) => errors.has(errorCode));

    if (error) {
      return atlasErrors.getErrorMessage(error);
    }

    return 'Invalid Input';
  }

  // Updates error message according to the ValidationErrors
  private updateError(isInputInvalid, activeErrors, errorSet): void {
    // Update error message
    if (isInputInvalid) {
      this.errorMessage = this.getErrorMessage(activeErrors, errorSet);
    } else {
      this.errorMessage = '';
    }
  }

  // Updates the char counter at Hint section
  private updateCharCount(inputValue) {
    if (inputValue) {
      this.currentInputLength = inputValue.length;
    } else {
      this.currentInputLength = 0;
    }
  }

  getTabIndex() {
    if (this.inputControl.disabled) {
      return -1;
    } else {
      return this.tabIndex || 0;
    }
  }

  // -----------ControlValueAccessor-----------------
  // Function to call when the change detects.
  onChange = (input) => { };
  // Function to call when the input is touched.
  onTouched = () => { };
  // Allows Angular to update the model.
  writeValue(input: any): void {
    // Update the model and changes needed for the view here.
    this.inputControl.setValue(input);
  }

  // Allows Angular to register a function to call when the model changes.
  registerOnChange(fn: (input: any) => void): void {
    // Save the function as a property to call later here.
    this.onChange = fn;
  }

  // Allows Angular to register a function to call when the input has been touched.
  registerOnTouched(fn: any): void {
    // Save the function as a property to call later here.
    this.onTouched = fn;
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this.elementRef.nativeElement);
    if (this._maskedInput) {
      this._maskedInput.destroy();
    }
  }
}
