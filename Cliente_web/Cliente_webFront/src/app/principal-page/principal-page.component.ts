import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-principal-page',
  standalone: true,
  imports: [NgIf, NgForOf, RouterOutlet, RouterLink],
  templateUrl: './principal-page.component.html',
  styleUrls: ['./principal-page.component.css']
})
export class PrincipalPageComponent implements OnInit, OnDestroy {
  breadcrumb: string[] = [];
  currentRoute: string | undefined;
  private routerSubscription: Subscription | undefined;

  constructor(private router: Router) {
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

}
