import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AtlasTimepicker } from './timepicker.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IMaskModule } from 'angular-imask';
import { MatSelectModule } from '@angular/material/select';
import { ObserversModule } from '@angular/cdk/observers';

@NgModule({
  declarations: [AtlasTimepicker],
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    IMaskModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    ObserversModule
  ],
  exports: [AtlasTimepicker]
})
export class AtlasTimepickerModule { }
