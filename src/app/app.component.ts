import {
  Component,
  OnInit,
} from '@angular/core';

import { FormBuilder, FormControl } from '@angular/forms';
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
    radio: [{ value: true }, []],
  })

  selectedOption(e) {
    console.log(e);
  }

  submit() {
    console.log('submit');
  }

  constructor(
    private fb: FormBuilder,
  ) {
    //   this.formControlDemo = new FormControl({ value: true, disabled: false }, []);
  }


  ngOnInit(): void {
  }

}

