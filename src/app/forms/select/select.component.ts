import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Optional,
  Self,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl, NgControl, ControlValueAccessor, ValidationErrors } from '@angular/forms';
import { FloatLabelType, MatFormFieldAppearance } from '@angular/material/form-field';
import { ThemePalette } from '@angular/material/core';
import { AtlasFormFieldErrors } from '@wellsky/atlas-ui/core';
import { MatSelect } from '@angular/material/select';
import { AtlasSelectDataSource } from './select.model';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'atlas-select',
  templateUrl: './select.component.html',
  exportAs: 'atlasSelect'
})
export class AtlasSelect implements OnInit, ControlValueAccessor {
  private _errors: AtlasFormFieldErrors;

  disableOptionCentering: boolean;
  selectControl: FormControl;
  errorMessage: string;

  /**
   * ENHANCE:
   * @Input()
   * compareWith: (o1: any, o2: any) => boolean
   * @Input()
   * panelClass: string | string[] | Set<string> | { [key: string]: any; }
   * @Input()
   * sortComparator: (a: MatOption, b: MatOption, options: MatOption[]) => number
   */

  @ViewChild(MatSelect, {read: ElementRef}) private matSelect: ElementRef<HTMLElement>;

  // Material Select---------------
  @Input('aria-label')
  ariaLabel: string;

  @Input('aria-labelledby')
  ariaLabelledby: string;

  @Input()
  disableRipple: boolean;

  @Input()
  id: string;

  @Input()
  multiple: boolean;

  @Input()
  placeholder: string;

  @Input()
  required: boolean;

  @Input()
  value: any;

  @Output()
  openedChange: EventEmitter<boolean>;

  // Material FormField-----------------
  @Input()
  fieldAppearance: MatFormFieldAppearance;

  @Input()
  floatLabel: FloatLabelType;

  @Input()
  hideRequiredMarker: boolean;

  @Input()
  label: string;

  // FIXME: Mat-Hint component throwing ExpressionChanged error.
  // @Input()
  // hintEnd: string;
  // @Input()
  // hintStart: string;

  // Custom Properties----------------

  // Enables default option to clear the choice
  @Input()
  default: string;

  // Data source for select
  @Input() dataSource: AtlasSelectDataSource;

  // Get error set
  @Input()
  get errors(): AtlasFormFieldErrors { return this._errors; }
  set errors(errors: AtlasFormFieldErrors) {
    if (errors && errors instanceof AtlasFormFieldErrors) {
      this._errors = errors;
    } else {
      this._errors = new AtlasFormFieldErrors();
    }
  }

  /**
   * Input of input component: color
   * Supports three values: 'primary' | 'accent' | 'warn' | undefined
   */
  @Input()
  color: ThemePalette;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private renderer2: Renderer2,
    private overlay: OverlayContainer,
  ) {

    // Replace the provider from above with this.
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    // Select FromControl
    this.selectControl = new FormControl();

    // Errors
    this.errors = new AtlasFormFieldErrors();

    // Emit panel toggled
    this.openedChange = new EventEmitter<boolean>();

    // Values: 'legacy' | 'standard' | 'fill' | 'outline'
    this.fieldAppearance = 'fill';

    // Values: 'auto' | 'always' | 'never'
    this.floatLabel = 'auto';

    // false: for hiding the required marker when required is enabled
    this.hideRequiredMarker = false;

    // Set default color to 'accent'
    this.color = 'accent';

    // Set disableOptionCentering to true
    this.disableOptionCentering = true;
  }

  ngOnInit() {
    this.selectControl.valueChanges.subscribe(
      (options) => {
        // Emit value to CVA
        this.onChange(options);
      }
    );

    // Get and update the errors on selectControl
    if (this.ngControl != null) {
      this.ngControl.valueChanges.subscribe(
        () => {
          // Set errors
          if (this.ngControl.invalid) {
            this.selectControl.setErrors(this.ngControl.errors);
          } else {
            this.selectControl.setErrors(null);
          }

          // Update errors
          this.updateError(this.ngControl.invalid, this.ngControl.errors, this.errors);
        }
      );
    }
  }

  // Updates error message according to the ValidationErrors
  public updateError(isInputInvalid: boolean, activeErrors: ValidationErrors, errorSet: AtlasFormFieldErrors): void {
    // Update error message
    if (isInputInvalid && activeErrors) {
      this.errorMessage = this.getErrorMessage(activeErrors, errorSet);
    } else {
      this.errorMessage = '';
    }
  }

  // get error message
  public getErrorMessage(activatedErrors: ValidationErrors, atlasErrors: AtlasFormFieldErrors) {
    let errorMessage = 'Wrong Input';
    const _activatedErrors = Object.keys(activatedErrors);
    const errors: Map<string, string> = atlasErrors.getErrors();

    // Find valid error and assign its message
    for (let errorCode = 0; errorCode < _activatedErrors.length; errorCode++) {
      if (errors.has(_activatedErrors[errorCode])) {
        errorMessage = atlasErrors.getErrorMessage(_activatedErrors[errorCode]);
        break;
      }
    }
    return errorMessage;
  }

  // Is item group or option
  public isItemGroup(item: AtlasSelectDataSource): 'group' | 'option' {
    if (item && Array.isArray(item.value)) {
      return 'group';
    } else if (item && typeof item.value === 'string') {
      return 'option';
    } else {
      return null;
    }
  }

  private getFont() {
    const fontValue = getComputedStyle(this.matSelect.nativeElement).getPropertyValue('font-size').split('px');
    return `${parseInt(fontValue[0], 10) * 2}px`;
  }

  /**
   * To open the overlay panel from bottom of the select control when isPanelToggled
   * @param isPanelToggled
   * @Output() openedChange($event)
   */
  public isPanelToggled(isPanelToggled: boolean): void {
    const overlay = this.overlay.getContainerElement();

    if (isPanelToggled && overlay) {
      //  Compute margin-top based on the font-size of parent element
      const panel = overlay.querySelector('.cdk-overlay-pane');
      this.renderer2.setStyle(panel, 'margin-top', '55px');
    }
    this.openedChange.emit(isPanelToggled);
  }

  // -----------ControlValueAccessor-----------------
  // Function to call when the change detects.
  private onChange = (input) => { };
  // Function to call when the input is touched.
  private onTouched = () => { };
  // Allows Angular to update the model.
  writeValue(input: any): void {
    // Update the model and changes needed for the view here.
    this.selectControl.setValue(input);
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

  setDisabledState?(isDisabled: boolean): void {
    // Disables the selectControl
    if (isDisabled) {
      this.selectControl.disable();
    } else {
      this.selectControl.enable();
    }
  }
}
