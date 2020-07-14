import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AtlasInput } from './input.component';
import { IMaskModule } from 'angular-imask';
import { ObserversModule } from '@angular/cdk/observers';

@NgModule({
  declarations: [
    AtlasInput
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    IMaskModule,
    ObserversModule
  ],
  exports: [
    AtlasInput
  ]
})
export class AtlasInputModule { }
