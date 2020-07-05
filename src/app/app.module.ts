import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AtlasTodoListComponent } from './atlas-todo-list/atlas-todo-list.component';
import { AtlasInputModule } from '@wellsky/atlas-ui/input';
import { AtlasButtonModule } from '@wellsky/atlas-ui/button';

@NgModule({
  declarations: [
    AppComponent,
    AtlasTodoListComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AtlasInputModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
