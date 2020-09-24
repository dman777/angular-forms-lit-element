import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  QueryList,
  Injector,
  Optional,
  Self,
  AfterViewInit,
} from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';

import { AtlasRadioButton } from './radio-button.component';
import { AtlasRadioButtonConfig } from './radio-button.model';
import { AtlasErrorsHandlerService } from '@wellsky/atlas-ui/core';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'atlas-radio-group',
  templateUrl: './radio-group.component.html',
  preserveWhitespaces: false,
  exportAs: 'atlasRadioGroup'
})
export class AtlasRadioGroup implements AfterContentInit, AfterViewInit {

  private _direction: string;
  private _labelPosition: string;
  private _disabled: boolean;

  public formControl: FormControl;
  public errorsHandlerService: AtlasErrorsHandlerService;
  public radioButtons: Array<any>;
  public textContent: Array<string>;
  public selectedRadioId: any;
  public selectedRadioValue: any;

  // To get the child radio buttons.
  @ContentChildren(forwardRef(() => AtlasRadioButton), { descendants: true })
  _radios: QueryList<AtlasRadioButton>;

  // To set the direction of the radio group
  @Input()
  public set direction(direction: string) {
    try {
      this._direction = direction;
      if (direction && (direction !== 'horizontal') && (direction !== 'vertical')) {
        this._direction = 'horizontal';
        throw new Error(`Layout for radio group direction should be 'horizontal' or 'vertical'`);
      }
    } catch (error) {
      this.errorsHandlerService.handleError(error);
    }
  }
  public get direction(): string {
    return this._direction;
  }

  // To set the radio group to be disabled
  @Input()
  public set disabled(disabled: boolean) {
    this._disabled = disabled;
    if (disabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }
  public get disabled(): boolean {
    return this._disabled;
  }

  // To set the position for the label
  @Input()
  public set labelPosition(labelPosition: string) {
    try {
      this._labelPosition = labelPosition;
      if (labelPosition && (labelPosition !== 'before') && (labelPosition !== 'after')) {
        this._labelPosition = '';
        throw new Error(`Label position for radio group should be 'before' or 'after'`);
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

  // To set the required indication on radio group
  @Input()
  required: boolean;

  // To indicate the currently selected button
  @Input()
  selected: AtlasRadioButtonConfig;

  // To set the value for radio buttons
  @Input()
  value: any;

  // To return the value selected call back
  @Output()
  change = new EventEmitter<MatRadioChange>();

  // To emit the selected values
  public selectedOption(event: MatRadioChange): void {
    if (this.change) {
      this.onChange(event.value);
      this.change.emit(event);
    }
  }

  constructor(
    private _injector: Injector,
    @Optional() @Self() public ngControl: NgControl) {
    this.formControl = new FormControl('', []);
    this.direction = 'horizontal';
    this.errorsHandlerService = this._injector.get(AtlasErrorsHandlerService);
    this._labelPosition = 'after';

    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }

  ngAfterViewInit() {
     /**
     * Listen to the changes in projected content
     */
    this._radios.changes.subscribe(_ => {
      this.registerRadioButtonEvents();
    });
  }

  ngAfterContentInit() {
    // contentChildren is set
    this.radioButtons = this._radios.toArray();
    this.registerRadioButtonEvents();
  }

  /**
   * Register events for atlas radio button
   */
  private registerRadioButtonEvents() {
    if (this.selected !== undefined) {
      this.selectedRadioId = this.selected.id;
    }

    this.radioButtons.forEach((radioButton) => {
      if (radioButton.id === this.selectedRadioId) {
        this.selectedRadioValue = radioButton;
      }

      radioButton.change.subscribe((atlasRadio) => {
        this.selectedRadioValue = atlasRadio;
        this.onChange(atlasRadio.value);
        this.change.emit(atlasRadio);
      });
    });
  }

  // -----------ControlValueAccessor-----------------
  // Function to call when the change detects.
  onChange = (input: object) => { };
  // Function to call when the input is touched.
  onTouched = () => { };
  // Allows Angular to update the model.
  writeValue(input: boolean): void {
    // Update the model and changes needed for the view here.
    this.formControl.setValue(input);
  }

  // Allows Angular to register a function to call when the model changes.
  registerOnChange(fn: (input: any) => void): void {
    // Save the function as a property to call later here.
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    // throw new Error("Method not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {
    // throw new Error("Method not implemented.");
  }
}
