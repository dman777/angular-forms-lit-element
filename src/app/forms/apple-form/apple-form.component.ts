import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { UserValidators } from './user-validator.service';
import { AtlasFormFieldErrors } from '@wellsky/atlas-ui/core';

@Component({
  selector: 'app-apple-form',
  templateUrl: './apple-form.component.html',
  styleUrls: ['./apple-form.component.scss'],
})

export class AppleFormComponent implements OnInit {
  overrideMsgFormControl: FormBuilder;
  errorSet: AtlasFormFieldErrors;

  profile = this.fb.group({
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
  }


  ngOnInit(): void {
  }

}
