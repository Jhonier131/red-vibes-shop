import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',pathMatch: 'full', redirectTo: 'home'
  },
  {
    path: 'home', loadChildren: () =>
      import('./pages/home/home.module').then(mod => mod.HomeModule)
  },
  {
    path: 'shop', loadChildren: () =>
      import('./pages/sections/sections.module').then(mod => mod.SectionsModule)
  },
  {
    path: '**', redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
