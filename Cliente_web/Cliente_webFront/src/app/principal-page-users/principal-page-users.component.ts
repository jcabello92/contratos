import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-principal-page-users',
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    RouterOutlet
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


  constructor(private router: Router) {
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
        this.adjustDashboardHeight();
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


  adjustDashboardHeight(): void {
    const dashboard = document.querySelector('.dashboard') as HTMLElement;
    const content = document.querySelector('.dynamic-content') as HTMLElement;
    const footer = document.querySelector('.footer') as HTMLElement;

    const routeHeights: { [key: string]: number } = {
      "/principalPage/Contratos": 788,
      "/principalPage/Proveedores": 788,
      "/principalPage/Documentos": 788,
      "/principalPage/OIT": 788,
      "/principalPage/Representantes": 788,
    };

    if (dashboard && content && footer) {
      const totalContentHeight = content.offsetHeight + footer.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Lógica para la primera ejecución
      if (this.isFirstTime) {
        // @ts-ignore
        const additionalHeight = routeHeights[this.currentRoute] || 0;
        dashboard.style.height = `${Math.max(totalContentHeight, viewportHeight) + additionalHeight}px`;
        this.isFirstTime = false; // Cambiar a false después de la primera ejecución
      } else {
        dashboard.style.height = `${Math.max(totalContentHeight, viewportHeight)+67}px`;
      }
    }
  }


}
