import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {PrincipalPageComponent} from './principal-page/principal-page.component';
import {ContratosComponent} from './contratos/contratos.component';
import {ProveedoresComponent} from './proveedores/proveedores.component';
import {DocumentosComponent} from './documentos/documentos.component';
import {OITsComponent} from './oits/oits.component';
import {RepresentantesComponent} from './representantes/representantes.component'
import {Option6Component} from './option6/option6.component';
import {Option7Component} from './option7/option7.component';
import {UsuarioComponent} from './usuario/usuario.component';
import {AjustesComponent} from './ajustes/ajustes.component';
import {NotificacionesComponent} from './notificaciones/notificaciones.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'principalPage', component: PrincipalPageComponent, children: [
      { path: '', redirectTo: 'principalPage', pathMatch: 'full' },
      { path: 'Contratos', component: ContratosComponent },
      { path: 'Proveedores', component: ProveedoresComponent },
      { path: 'Documentos', component: DocumentosComponent },
      { path: 'OIT', component: OITsComponent },
      { path: 'Representantes', component: RepresentantesComponent },
      { path: 'Opcion6', component: Option6Component },
      { path: 'Opcion7', component: Option7Component }
    ]
  },
  { path: 'Usuario', component: UsuarioComponent },
  { path: 'Ajustes', component: AjustesComponent },
  { path: 'Notificaciones', component: NotificacionesComponent },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
