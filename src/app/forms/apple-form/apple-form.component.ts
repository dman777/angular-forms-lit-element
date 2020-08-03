import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { UserValidators } from './user-validator.service';
import { AtlasFormFieldErrors } from '@wellsky/atlas-ui/core';
import { AtlasSelectDataSource } from '../select';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { map, switchMap  } from 'rxjs/operators';


@Component({
  selector: 'app-apple-form',
  templateUrl: './apple-form.component.html',
  styleUrls: ['./apple-form.component.scss'],
})

export class AppleFormComponent implements OnInit {
  overrideMsgFormControl: FormBuilder;
  errorSet: AtlasFormFieldErrors;
  selectData: AtlasSelectDataSource[];

  public order = { status: 0};


  profile = this.fb.group({
    dropdown: [
    ],
  });

  runAjax() {
    this.http.get('https://api.npms.io/v2/search?q=scope:angular')
      .subscribe(res => {
        console.log('aaa');
        this.order = Object.assign({}, this.order, {status: 1})
      })
  }

  public chipRemoved(removedEvent: any): void {
    // Emitted event details can be fetched here
  }

  submit() {
    this.runAjax();
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {
  }


  ngOnInit(): void {
  }

}
