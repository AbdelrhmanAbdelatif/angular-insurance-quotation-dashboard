import { Routes } from '@angular/router';

// The business feature stays lazy so the application shell remains small and ownership stays local.
export const routes: Routes = [
  {
    path: 'quotations',
    loadChildren: () =>
      import('./features/quotations/quotations.routes').then(
        ({ QUOTATIONS_ROUTES }) => QUOTATIONS_ROUTES,
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: 'quotations' },
  { path: '**', redirectTo: 'quotations' },
];
