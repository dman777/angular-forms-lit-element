import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'forms',
    loadChildren: () => import('./forms/forms.module').then(m => m.FormsModule),
  },
  {
    path: '**',
    redirectTo: 'forms/apple',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
