import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {PrincipalPageComponent} from './principal-page/principal-page.component';
import {Option1Component} from './option1/option1.component';
import {Option2Component} from './option2/option2.component';
import {Option3Component} from './option3/option3.component';
import {Option4Component} from './option4/option4.component';
import {Option5Component} from './option5/option5.component';
import {Option6Component} from './option6/option6.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent }, { path: 'principalPage', component: PrincipalPageComponent, children: [
      { path: '', redirectTo: 'principalPage', pathMatch: 'full' },
      { path: 'opcion1', component: Option1Component },
      { path: 'opcion2', component: Option2Component },
      { path: 'opcion3', component: Option3Component },
      { path: 'opcion4', component: Option4Component },
      { path: 'opcion5', component: Option5Component },
      { path: 'opcion6', component: Option6Component }
    ]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
