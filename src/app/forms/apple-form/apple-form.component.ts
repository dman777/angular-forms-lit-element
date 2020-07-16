import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { UserValidators } from './user-validator.service';
import { AtlasFormFieldErrors } from '@wellsky/atlas-ui/core';
import { AtlasSelectDataSource } from '../select';

@Component({
  selector: 'app-apple-form',
  templateUrl: './apple-form.component.html',
  styleUrls: ['./apple-form.component.scss'],
})

export class AppleFormComponent implements OnInit {
  overrideMsgFormControl: FormBuilder;
  errorSet: AtlasFormFieldErrors;
  selectData: AtlasSelectDataSource[];

  required: boolean;
  defaultOption: string;
  multiple: boolean;
  selected: boolean;
  disabled: boolean;
  labelText: string;


  profile = this.fb.group({
    dropdown: [
      '',
    ],
    name: [
      '',
      [ Validators.required ],
      this.userValidateService.validateUser(),
    ],

    phoneNumbers: this.fb.group({
      homePhone: [
        '',
        [ Validators.required ],
      ],
      workPhone: [''],
    }),
  });

  submit() {
    console.log(this.profile.get('name'));
    //this.userValidateService.searchUser('bob');
  }

  constructor(
    private fb: FormBuilder,
    private userValidateService: UserValidators,
  ) {
    this.errorSet = new AtlasFormFieldErrors();

    this.errorSet.setError('userNameExists', 'user already exists')

     this.defaultOption = 'Select Option';

     this.selectData = [
      {
          label: 'Subzero - No Group',
          value: '1'
      },
      {
          label: 'Lancer  - No Group',
          value: '2',
      },
      {
          label: 'Assault',
          value: [
              {
                  label: 'Bangalore',
                  value: '3'
              },
              {
                  label: 'Mirage ',
                  value: '4 '
              },
              {
                  label: 'Octane',
                  value: '5'
              }

          ]
      }
     ];

  }


  ngOnInit(): void {
  }

}
