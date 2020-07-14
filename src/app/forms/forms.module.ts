import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsRoutingModule } from './forms-routing.module';
import { AppleFormComponent } from './apple-form/apple-form.component';
import { AtlasInputModule } from './input/input.module';
import { AtlasButtonModule } from '@wellsky/atlas-ui/button';


@NgModule({
  declarations: [
    AppleFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AtlasButtonModule,
    AtlasInputModule,
    FormsRoutingModule,
  ]
})
export class FormsModule { }
