import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { map, switchMap  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UserValidators {
  constructor(private http: HttpClient) {}

  searchUser(text) {
    // debounce
    return timer(200)
      .pipe(
        switchMap(() => {
          // Check if username is available
          return this.http.get<any>('api/data')
        })
      );
  }

  validateUser(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.searchUser(control.value)
        .pipe(
          map(res => {
            // if username is already taken
            if (res[0] === control.value) {
              // return error
              return { 'userNameExists': true};
            }
          })
        );
    };

  }

}


