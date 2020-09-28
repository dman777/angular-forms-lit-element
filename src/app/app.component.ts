import './lit-time-picker/lit-time-picker';

import {
  Component,
  OnInit,
} from '@angular/core';

import { FormBuilder, FormControl, ControlValueAccessor, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  formControlDemo: FormControl;
  private _newTimeISO: string;
  private _newTime: string;

  form = this.fb.group({
    radio: ['true'],
    time: ['2020-05-04T05:33:21.511Z'],
  })

  selectedOption(e) {
    //console.log(e);
  }

  submit() {
    //console.log('submit');
  }

  updateTimeDisplay(e) {
    this.newTimeISO = e.detail.timeStampISO;
    this.newTime = e.detail.momentObj.format('hh:mm:ss A');
  }

  public get newTimeISO():string {
    return this._newTimeISO;
  }

  public get newTime():string {
    return this._newTime;
  }

  public set newTimeISO(value:string) {
    this._newTimeISO = value;
  }

  public set newTime(value:string) {
    this._newTime = value;
  }

  constructor(
    private fb: FormBuilder,
  ) {
    //   this.formControlDemo = new FormControl({ value: true, disabled: false }, []);
  }


  ngOnInit(): void {
  }

  // -----------ControlValueAccessor-----------------
  onChange = (input: boolean) => { };

  onTouched = () => { };

  writeValue(input): void {
    console.log(input);
    this.form.setValue(input, {emitEvent: false});
  }

  registerOnChange(fn: (input: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    // Not using, as on change event will also trigger on touch
  }
  setDisabledState?(isDisabled: boolean): void {
    // Not using, instead handling the event from disabled property
  }

}

