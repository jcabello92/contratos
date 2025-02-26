import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {Subscription} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-principal-page-users',
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    RouterOutlet,
    HttpClientModule
  ],
  templateUrl: './principal-page-users.component.html',
  standalone: true,
  styleUrl: './principal-page-users.component.css'
})
export class PrincipalPageUsersComponent implements OnInit, OnDestroy{
  breadcrumb: string[] = [];
  currentRoute: string | undefined;
  private routerSubscription: Subscription | undefined;
  isFirstTime: boolean = true;


  constructor(private router: Router, private http:HttpClient) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateBreadcrumb(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit() {
    // Establecemos el valor inicial de currentRoute con la ruta actual
    this.currentRoute = this.router.url;

    // Escuchamos los cambios de ruta
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects; // Actualizamos la ruta actual
      }
    });
  }

  ngOnDestroy() {
    // Desuscribirnos para evitar fugas de memoria
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }


  updateBreadcrumb(url: string) {
    const parts = url.split('/').filter(part => part);
    this.breadcrumb = parts.slice(1);
  }


  descargarManualUsuario() {
    console.log("Botón presionado"); // Verificar si la función se ejecuta

    const url = 'http://localhost:8000/api/descargas/manual_usuario';

    this.http.get(url, { responseType: 'blob' }).subscribe(
      (response: Blob) => {
        console.log("Solicitud exitosa");
        const blob = new Blob([response], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'manual_usuario.pdf';
        link.click();
        window.URL.revokeObjectURL(link.href);
      },
      error => {
        console.log("Solicitud fallida");
        console.error('Error al descargar el manual:', error);
        alert('Hubo un problema al descargar el manual.');
      }
    );
  }

}
