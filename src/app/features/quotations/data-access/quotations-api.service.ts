import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Quotation } from '../models/quotation.model';
import { QuotationQuery } from '../models/quotation-query.model';

// The InjectionToken separates the state layer from the mock implementation.
export interface QuotationsApi {
  search(query: QuotationQuery): Observable<readonly Quotation[]>;
}

export const QUOTATIONS_API = new InjectionToken<QuotationsApi>('QUOTATIONS_API');
