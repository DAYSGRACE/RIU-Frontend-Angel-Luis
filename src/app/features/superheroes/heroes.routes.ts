import { Routes } from '@angular/router';
import { heroResolver } from './resolvers/hero-resolver';

export const heroRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/hero-layout/hero-layout'),
    children: [
      {
        path: '',
        title: 'Listado',
        loadComponent: () => import('./pages/hero-list-page/hero-list-page'),
      },
      {
        path: 'create',
        title: 'Crear héroe',
        loadComponent: () => import('./pages/hero-create-page/hero-create-page'),
      },
      {
        path: 'edit/:id',
        title: 'Editar héroe',
        loadComponent: () => import('./pages/hero-edit-page/hero-edit-page'),
        resolve: {
          hero: heroResolver,
        },
      },
    ],
  },
];

export default heroRoutes;
