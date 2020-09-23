import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppleFormComponent } from './apple-form/apple-form.component';

const routes: Routes = [
  {
    path: 'apple',
    component: AppleFormComponent,
    data: { title: 'apple' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }
