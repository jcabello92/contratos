import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-principal-page',
  standalone: true,
  imports: [NgIf, NgForOf, RouterOutlet, RouterLink, HttpClientModule],
  templateUrl: './principal-page.component.html',
  styleUrls: ['./principal-page.component.css']
})
export class PrincipalPageComponent implements OnInit, OnDestroy {
  breadcrumb: string[] = [];
  currentRoute: string | undefined;
  private routerSubscription: Subscription | undefined;

  constructor(private router: Router, private http: HttpClient) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateBreadcrumb(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit() {
    this.currentRoute = this.router.url;

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        // Ya NO llamamos a adjustDashboardHeight();
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  updateBreadcrumb(url: string) {
    const parts = url.split('/').filter(part => part);
    this.breadcrumb = parts.slice(1);
  }

  descargarManualAdministrador() {
    console.log("Botón presionado"); // Verificar si la función se ejecuta

    const url = 'http://localhost:8000/api/descargas/manual_administrador';

    this.http.get(url, { responseType: 'blob' }).subscribe(
      (response: Blob) => {
        console.log("Solicitud exitosa");
        const blob = new Blob([response], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'manual_administrador.pdf';
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
