import { Routes } from '@angular/router';
import { MockQuotationsApiService } from './data-access/mock-quotations-api.service';
import { QUOTATIONS_API } from './data-access/quotations-api.service';
import { QuotationsPageComponent } from './pages/quotations-page.component';

export const QUOTATIONS_ROUTES: Routes = [
  {
    path: '',
    component: QuotationsPageComponent,
    providers: [{ provide: QUOTATIONS_API, useClass: MockQuotationsApiService }],
  },
];
