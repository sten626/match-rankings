import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'rankings',
    loadComponent: () => import('./rankings/rankings').then((m) => m.Rankings),
  },
];
