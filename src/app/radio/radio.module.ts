import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { AtlasRadioButton } from './radio-button.component';
import { AtlasRadioGroup } from './radio-group.component';



@NgModule({
  declarations: [
    AtlasRadioButton,
    AtlasRadioGroup
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRadioModule,
  ],
  exports: [
    AtlasRadioButton,
    AtlasRadioGroup
  ]
})
export class AtlasRadioModule { }
