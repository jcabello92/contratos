import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('%c🔍 [AuthGuard] Verificando autenticación...', 'color: blue; font-weight: bold;');

    const loggedInUser = localStorage.getItem('loggedInUser');
    console.log('🔹 Usuario en localStorage:', loggedInUser);

    if (!loggedInUser) {
      console.log('%c⛔ Usuario NO autenticado. Redirigiendo a login.', 'color: red; font-weight: bold;');
      this.logoutAndRedirect();
      return false;
    }

    let userData;
    try {
      userData = JSON.parse(loggedInUser);
      console.log('🔑 Datos del usuario autenticado:', userData);

      // Verifica que los datos tengan un id y usuario válidos
      if (!userData.id || !userData.usuario) {
        console.warn('%c⚠️ Datos inválidos en localStorage. Cerrando sesión...', 'color: orange; font-weight: bold;');
        this.logoutAndRedirect();
        return false;
      }

    } catch (error) {
      console.error('⚠️ Error al parsear el usuario:', error);
      this.logoutAndRedirect();
      return false;
    }

    const requestedRoute = state.url;
    console.log('📌 Ruta solicitada:', requestedRoute);

    const isAllowed = this.isAllowedRoute(requestedRoute, userData);
    console.log('🔑 Validación de ruta permitida:', isAllowed);

    if (!isAllowed) {
      console.warn('%c🚫 Acceso no permitido. Cerrando sesión y redirigiendo al login.', 'color: orange; font-weight: bold;');
      this.logoutAndRedirect();
      return false;
    }

    console.log('%c✅ Usuario autenticado y autorizado. Acceso permitido.', 'color: green; font-weight: bold;');
    return true;
  }

  private isAllowedRoute(requestedRoute: string, userData: any): boolean {
    console.log('🔍 Validando acceso a la ruta:', requestedRoute);

    if (userData.rol === 1) {  // Administrador
      const allowedRoutesForAdmin = [
        '/principalPage',                    // Página principal del administrador
        '/principalPage/GestionarUsuarios',
        '/principalPage/Proveedores',
        '/principalPage/Contratos',
        '/Usuario',                          // Rutas de usuario, ajustes y notificaciones para admin
        '/Ajustes',
        '/Notificaciones'
      ];

      for (let allowed of allowedRoutesForAdmin) {
        if (requestedRoute === allowed || requestedRoute.startsWith(allowed + '/')) {
          console.log('%c✅ Ruta permitida para el administrador:', requestedRoute, 'color: green; font-weight: bold;');
          return true;
        }
      }
      console.log('%c🚫 Ruta no permitida para el administrador:', requestedRoute, 'color: red; font-weight: bold;');
      return false;
    }

    if (userData.rol === 2) {  // Usuario normal
      const allowedRoutesForUser = [
        '/principalPageUsers',               // Página principal para usuarios
        '/principalPageUsers/Contratos',
        '/principalPageUsers/Documentos',
        '/principalPageUsers/Itos',
        '/UsuarioUsers',                     // Rutas de usuario, ajustes y notificaciones para usuarios normales
        '/AjustesUsers',
        '/NotificacionesUsers'
      ];

      for (let allowed of allowedRoutesForUser) {
        if (requestedRoute === allowed || requestedRoute.startsWith(allowed + '/')) {
          console.log('%c✅ Ruta permitida para el usuario:', requestedRoute, 'color: green; font-weight: bold;');
          return true;
        }
      }
      console.log('%c🚫 Ruta no permitida para el usuario:', requestedRoute, 'color: red; font-weight: bold;');
      return false;
    }

    console.log('%c🚫 No hay acceso a la ruta:', requestedRoute, 'color: red; font-weight: bold;');
    return false;
  }



  private logoutAndRedirect(): void {
    console.log('%c🔒 Cerrando sesión y redirigiendo al login...', 'color: red; font-weight: bold;');
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }
}
