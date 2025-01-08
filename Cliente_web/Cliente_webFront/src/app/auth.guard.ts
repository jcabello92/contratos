import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const loggedInUser = localStorage.getItem('loggedInUser'); // usuario está logueado

    if (loggedInUser) {
      return true; // acceso si el usuario está logueado
    } else {
      this.router.navigate(['/login']); // login si no está autenticado
      return false;
    }
  }
}
