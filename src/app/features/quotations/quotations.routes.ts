
import { Routes } from '@angular/router';

import { MockQuotationsApiService } from './data-access/mock-quotations-api.service';
import { QUOTATIONS_API } from './data-access/quotations-api.service';
import { QuotationsPageComponent } from './pages/quotations-page.component';

/**
 * Defines the routes and dependency providers for the quotations feature.
 */
export const QUOTATIONS_ROUTES: Routes = [
  {
    // Empty path means the default page of this feature.
    path: '',
    // Component displayed when this route is activated.
    component: QuotationsPageComponent,
    // Registers the mock API implementation for this route.
    // Components in this route can inject QUOTATIONS_API
    // and receive MockQuotationsApiService.
    providers: [
      {
        provide: QUOTATIONS_API,
        useClass: MockQuotationsApiService
      }
    ],
  },
];
