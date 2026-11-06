// Query state describes user intent; it is separate from the returned quotation collection.
import { QuotationStatus } from './quotation.model';

export type PremiumSort = 'asc' | 'desc';

export interface QuotationQuery {
  readonly searchTerm: string;
  readonly status: QuotationStatus | 'all';
  readonly premiumSort: PremiumSort;
}
