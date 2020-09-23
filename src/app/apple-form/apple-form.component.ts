import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AppleFormComponent implements OnInit {
  overrideMsgFormControl: FormBuilder;
  errorSet: AtlasFormFieldErrors;
  selectData: AtlasSelectDataSource[];

  public order = { status: 0};
  state1 = false;
  fruits = [
    {
      id: 1,
      name: "apple",
      selected: true,
    },
    {
      id: 2,
      name: "pear",
      selected: false,
    },
    {
      id: 3,
      name: "orange",
      selected: false,
    },
    {
      id: 4,
      name: "bannana",
      selected: false,
    },
  ];

  tar() {
    this.state1 = !this.state1;
  }


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
     console.log('chip removed chiplist');
     const fruits =  this.fruits.map((el) => {
      if (el.id !== 2) {
        return Object.assign({}, el);
      }
     });

    this.fruits = fruits.filter((el) => el);
    this.ref.markForCheck()
    console.log(this.fruits);
  }

  submit() {
    this.runAjax();
  }

  clickEvent(e) {
    console.log('clickEvent');
    this.fruits[2].selected = true;
    this.ref.markForCheck()
  }

  changeSelected(e) {
    console.log('selection changed');
    console.log(e);
  }


  remove(e) {
    console.log('removed');
     const fruits =  this.fruits.map((el) => {
      if (el.id !== 2) {
        return Object.assign({}, el);
      }
     });

    this.fruits = fruits.filter((el) => el);
    this.ref.markForCheck()
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private ref: ChangeDetectorRef,
  ) {
  }


  ngOnInit(): void {
    setTimeout(()=> {
    }, 1000);
  }

}


