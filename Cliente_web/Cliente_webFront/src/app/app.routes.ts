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
  { path: 'principalPage', component: PrincipalPageComponent,canActivate:[AuthGuard], children: [
      { path: 'Contratos', component: ContratosComponent,canActivate:[AuthGuard] },
      { path: 'Proveedores', component: ProveedoresComponent,canActivate:[AuthGuard] },
      { path: 'Documentos', component: DocumentosComponent,canActivate:[AuthGuard] },
      { path: 'OIT', component: OITsComponent,canActivate:[AuthGuard] },
      { path: 'Representantes', component: RepresentantesComponent,canActivate:[AuthGuard] },
      { path: 'GestionarUsuarios' , component: ManipularUsuariosComponent,canActivate:[AuthGuard] }
    ]
  },

  // Ruta principal para usuarios
  { path: 'principalPageUsers', component: PrincipalPageUsersComponent,canActivate:[AuthGuard], children: [
      { path: 'Contratos', component: ContratosComponent,canActivate:[AuthGuard]},
      { path: 'Proveedores', component: ProveedoresComponent ,canActivate:[AuthGuard]},
      { path: 'Documentos', component: DocumentosComponent ,canActivate:[AuthGuard]},
      { path: 'OIT', component: OITsComponent ,canActivate:[AuthGuard]},
      { path: 'Representantes', component: RepresentantesComponent,canActivate:[AuthGuard] },
    ]
  },

  { path: 'Usuario', component: UsuarioComponent ,canActivate:[AuthGuard]},
  { path: 'Ajustes', component: AjustesComponent ,canActivate:[AuthGuard]},
  { path: 'Notificaciones', component: NotificacionesComponent ,canActivate:[AuthGuard]},
  { path: 'UsuarioUsers', component: UsuarioUserComponent,canActivate:[AuthGuard] },
  { path: 'AjustesUsers', component: AjustesUserComponent,canActivate:[AuthGuard] },
  { path: 'NotificacionesUsers', component: NotificacionesUserComponent ,canActivate:[AuthGuard]},
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
