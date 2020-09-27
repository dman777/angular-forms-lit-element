import {
  Component,
  OnInit,
} from '@angular/core';

import { FormBuilder, FormControl, ControlValueAccessor } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AtlasFormFieldErrors } from '@wellsky/atlas-ui/core';
import { AtlasSelectDataSource } from './select';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  errorSet: AtlasFormFieldErrors;
  formControlDemo: FormControl;

  form = this.fb.group({
    radio: ['true'],
  })

  selectedOption(e) {
    //console.log(e);
  }

  submit() {
    //console.log('submit');
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

