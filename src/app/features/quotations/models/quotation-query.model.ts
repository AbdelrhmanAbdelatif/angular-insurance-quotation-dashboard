// Query state describes user intent; it is separate from the returned quotation collection.

/**
 * Defines the user's quotation search criteria.
 * Keeps search filters and sorting preferences separate
 * from the quotation data returned by the API.
 */

import { QuotationStatus } from './quotation.model';

/**
 * Defines the available premium sorting directions.
 * asc  = Lowest premium first.
 * desc = Highest premium first.
 */
export type PremiumSort = 'asc' | 'desc';

/**
 * Defines the supported languages for customer name searching.
 */
export type SearchLanguage = 'en' | 'ar';

/**
 * Represents the filters and preferences used when searching quotations.
 */
export interface QuotationQuery {

  // Text used to search by quotation ID or customer name
  readonly searchTerm: string;

  // Filters quotations by their status, or 'all' to show every status
  readonly status: QuotationStatus | 'all';

  // Controls whether quotations are sorted by premium ascending or descending
  readonly premiumSort: PremiumSort;

  // Determines which customer name field is used for language based searching.
  readonly searchLanguage?: SearchLanguage;
}

