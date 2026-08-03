import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-hero-navbar',
  imports: [MatToolbarModule, MatButton, RouterLink],
  templateUrl: './hero-navbar.html',
  styleUrl: './hero-navbar.scss',
})
export class HeroNavbar {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  pageTitle = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route = this.route.firstChild;

        while (route?.firstChild) {
          route = route.firstChild;
        }

        return route?.snapshot.title ?? 'Héroes';
      }),
    ),
    {
      initialValue: 'Héroes',
    },
  );

  routes = [
    {
      path: '/heroes',
      label: 'Listado',
    },
    {
      path: '/heroes/create',
      label: 'Crear',
    },
  ];
}
