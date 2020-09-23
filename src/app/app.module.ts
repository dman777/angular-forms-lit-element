import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AtlasInputModule } from '@wellsky/atlas-ui/input';
import { HttpClientModule }    from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AtlasSelectModule } from './select';
import { AtlasButtonModule } from '@wellsky/atlas-ui/button';
import { AtlasChipsModule } from './chips';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AtlasInputModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    AtlasSelectModule,
    AtlasButtonModule,
    AtlasChipsModule,
    MatChipsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
