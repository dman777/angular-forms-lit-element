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
  selectData: AtlasSelectDataSource[];
  defaultOption: string;




  title = 'component-storybook';
  form = this.fb.group({
    dropdown: [
      '',
    ],
    name: [
      '',
      [ Validators.required ],
    ],

    phone: [
      '',
      [ Validators.required ],
    ],
  })

  submit() {
    console.log('submit');
  }

  constructor(
    private fb: FormBuilder,
  ) {
    this.errorSet = new AtlasFormFieldErrors();

    this.errorSet.setError('userNameExists', 'user already exists')

     this.defaultOption = 'Select Option';

     this.selectData = [
      {
          label: 'Subzero - No Group',
          value: '1'
      },
     ];
  }


  ngOnInit(): void {
  }

}

