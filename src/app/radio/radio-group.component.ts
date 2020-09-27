import {
  AfterContentInit,
  ChangeDetectorRef,
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
  InjectionToken,
  ViewChild,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl,
  NgControl,
} from '@angular/forms';

import { AtlasRadioButton } from './radio-button.component';
import { AtlasErrorsHandlerService } from '@wellsky/atlas-ui/core';
import { MatRadioChange, MatRadioGroup } from '@angular/material/radio';

@Component({
  selector: 'atlas-radio-group',
  templateUrl: './radio-group.component.html',
  preserveWhitespaces: false,
  exportAs: 'AtlasRadioGroup',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AtlasRadioGroup),
    multi: true,
  }],
})

export class AtlasRadioGroup implements AfterContentInit, AfterViewInit {

  private _direction: string;
  private _labelPosition: string;
  private _disabled: boolean;
  private _value: any = null;
  private _selected = null;

  public errorsHandlerService: AtlasErrorsHandlerService;
  public radioButtons: Array<any>;
  public textContent: Array<string>;
  public selectedRadioId: any;
  public selectedRadioValue: any;

  @ContentChildren(forwardRef(() => AtlasRadioButton), { descendants: true })
  _radios: QueryList<AtlasRadioButton>;

  @ViewChild(MatRadioGroup, {read: NG_VALUE_ACCESSOR})
  matRadioGroupEl: ControlValueAccessor;

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

  @Input()
  public set disabled(disabled: boolean) {
    this._disabled = disabled;
    if (disabled) {
    } else {
    }
  }
  public get disabled(): boolean {
    return this._disabled;
  }

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

  @Input()
  name: string;

  @Input()
  required: boolean;

  @Input()
  get value(): any { return this._value; }
  set value(newValue: any) {
    if (this._value !== newValue) {
      this._value = newValue;
    }
  }

  @Input()
  get selected() { return this._selected; }
  set selected(selected) {
    this._selected = selected;
    this.value = selected ? selected.value : null;
    this._checkSelectedRadioButton();
  }

  @Output()
  change = new EventEmitter<MatRadioChange>();

  public selectedOption(event: MatRadioChange): void {
    if (this.change) {
      this.onChange(event.value);
      this.change.emit(event);
    }
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.direction = 'horizontal';
    this._labelPosition = 'after';
  }

  ngAfterViewInit() {
    this._radios.changes.subscribe(_ => {
      //this.registerRadioButtonEvents();
    });
    console.log(this.matRadioGroupEl);
    this.writeValue(true);
  }

  ngAfterContentInit() {
    //this.radioButtons = this._radios.toArray();
    //this._updateSelectedRadioFromValue();
    //this._checkSelectedRadioButton();
    //this.registerRadioButtonEvents();
  }

  _checkSelectedRadioButton() {
    if (this._selected && !this._selected.checked) {
      this._selected.checked = true;
    }
  }

  private registerRadioButtonEvents() {
    if (this.selected && this.selected !== undefined) {
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

  private _updateSelectedRadioFromValue(): void {
    const isAlreadySelected = this._selected !== null && this._selected.value === this._value;

    if (this._radios && !isAlreadySelected) {
      this._selected = null;
      this._radios.forEach(radio => {
        radio.checked = this.value === radio.value;
        if (radio.checked) {
          this._selected = radio;
        }
      });
    }
  }


  // -----------ControlValueAccessor-----------------
  onChange = (input: object) => { };

  onTouched = () => { };

  writeValue(input: boolean): void {
    if (this.matRadioGroupEl) {
      this.matRadioGroupEl.writeValue(true);
      this.changeDetectorRef.detectChanges();
    }
  }

  registerOnChange(fn: (input: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }
}
