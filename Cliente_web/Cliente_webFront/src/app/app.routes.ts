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
import {PrincipalPageUsersComponent} from './principal-page-users/principal-page-users.component';
import { AuthGuard } from './auth.guard'
import {UsuarioUserComponent} from './usuario-user/usuario-user.component';
import {AjustesUserComponent} from './ajustes-user/ajustes-user.component';
import {NotificacionesUserComponent} from './notificaciones-user/notificaciones-user.component';
import {ManipularUsuariosComponent} from './manipular-usuarios/manipular-usuarios.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Ruta principal para administradores
  { path: 'principalPage', component: PrincipalPageComponent, children: [
      { path: 'Contratos', component: ContratosComponent },
      { path: 'Proveedores', component: ProveedoresComponent },
      { path: 'Documentos', component: DocumentosComponent },
      { path: 'OIT', component: OITsComponent },
      { path: 'Representantes', component: RepresentantesComponent },
      { path: 'ManipularUsuarios' , component: ManipularUsuariosComponent }
    ]
  },

  // Ruta principal para usuarios
  { path: 'principalPageUsers', component: PrincipalPageUsersComponent, children: [
      { path: 'Contratos', component: ContratosComponent},
      { path: 'Proveedores', component: ProveedoresComponent },
      { path: 'Documentos', component: DocumentosComponent },
      { path: 'OIT', component: OITsComponent },
      { path: 'Representantes', component: RepresentantesComponent },
    ]
  },

  { path: 'Usuario', component: UsuarioComponent },
  { path: 'Ajustes', component: AjustesComponent },
  { path: 'Notificaciones', component: NotificacionesComponent },
  { path: 'UsuarioUsers', component: UsuarioUserComponent },
  { path: 'AjustesUsers', component: AjustesUserComponent },
  { path: 'NotificacionesUsers', component: NotificacionesUserComponent },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
