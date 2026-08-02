import { Routes } from '@angular/router';

export const heroRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/hero-layout/hero-layout'),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/hero-list-page/hero-list-page'),
      },
      {
        path: 'create',
        loadComponent: () => import('./pages/hero-create-page/hero-create-page'),
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./pages/hero-edit-page/hero-edit-page'),
      },
    ],
  },
];

export default heroRoutes;
