
import { Routes } from '@angular/router';

// The business feature stays lazy so the application shell remains small and ownership stays local.
/**
 * Defines the application's main routes.
 * Features are loaded lazily to keep the initial application bundle smaller.
 */
export const routes: Routes = [
  {
    // URL used to access the quotations feature
    path: 'quotations',
    // Load the quotations routes only when this feature is requested
    loadChildren: () =>
      import('./features/quotations/quotations.routes').then(
        ({ QUOTATIONS_ROUTES }) => QUOTATIONS_ROUTES,
      ),
  },

  {
    // Redirect the application root URL to the quotations page
    path: '',
    pathMatch: 'full',
    redirectTo: 'quotations',
  },

  {
    // Redirect any unknown URL to the quotations page
    // Must be the last route because it matches any unmatched path
    path: '**',
    redirectTo: 'quotations',
  },
];
