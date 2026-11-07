import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Quotation } from '../models/quotation.model';
import { QuotationQuery } from '../models/quotation-query.model';

// Defines the contract that all quotation API implementations must follow.
// This keeps components independent of the actual data source.
export interface QuotationsApi {

  // Accepts search parameters and returns matching quotation records.
  search(query: QuotationQuery): Observable<readonly Quotation[]>;}

// Angular cannot inject TypeScript interfaces directly because
// interfaces do not exist at runtime.
// InjectionToken provides a runtime identifier for the interface.
// A provider connects this token to a concrete implementation.
export const QUOTATIONS_API = new InjectionToken<QuotationsApi>('QUOTATIONS_API');
