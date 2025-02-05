import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const loggedInUser = localStorage.getItem('loggedInUser'); // Obtiene el usuario del localStorage
    console.log('AuthGuard: Verificando autenticación...');
    console.log('Valor en localStorage:', loggedInUser);

    if (loggedInUser) {
      console.log('Usuario autenticado. Permitiendo acceso.');
      return true; // Permitir acceso si está autenticado
    } else {
      console.log('Usuario NO autenticado. Redirigiendo a login.');
      this.router.navigate(['/login']); // Redirigir al login si no está autenticado
      return false;
    }
  }



}
