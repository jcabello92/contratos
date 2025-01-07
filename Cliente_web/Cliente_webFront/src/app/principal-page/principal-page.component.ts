import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-principal-page',
  imports: [
    NgIf,
    NgForOf,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './principal-page.component.html',
  standalone: true,
  styleUrl: './principal-page.component.css'
})
export class PrincipalPageComponent {
  breadcrumb: string[] = [];

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateBreadcrumb(event.urlAfterRedirects);
      }
    });
  }

  updateBreadcrumb(url: string) {
    const parts = url.split('/').filter(part => part);
    this.breadcrumb = parts.slice(1); // Ignorar 'principalPage'
  }

}
