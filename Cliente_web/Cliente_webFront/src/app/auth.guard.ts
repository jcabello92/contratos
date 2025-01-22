import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const loggedInUser = localStorage.getItem('loggedInUser'); // Comprueba si el usuario está autenticado

    if (loggedInUser) {
      // Aquí podrías agregar validaciones adicionales si quisieras
      return true; // Permitir acceso si está autenticado
    } else {
      // Si no está autenticado, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
