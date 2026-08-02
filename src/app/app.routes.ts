import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'heroes',
    loadChildren: () => import('./features/superheroes/heroes.routes'),
  },
  {
    path: '**',
    redirectTo: 'heroes',
  },
];
