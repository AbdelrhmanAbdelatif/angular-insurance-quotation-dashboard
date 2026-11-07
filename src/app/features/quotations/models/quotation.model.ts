// Domain data is kept framework-independent so the API, store, and components share one contract.

/**
 * Defines the possible statuses of an insurance quotation.
 * Using a union type prevents unsupported status values.
 */
export type QuotationStatus = 'Available' | 'Expired';

/**
 * Represents the structure of an insurance quotation.
 * Keeps the domain model independent of Angular and API implementation details.
 */
export interface Quotation {

  // Unique identifier assigned to each quotation
  readonly id: string;

  // Customer's name in English
  readonly customerName: string;

  // Customer's name in Arabic
  readonly customerNameAr: string;

  // Name of the insurance company providing the quotation
  readonly insuranceCompany: string;

  // Insurance premium amount in Saudi Riyals (SAR) القسط التأميني
  readonly premiumSar: number;

  // Customer's deductible amount in Saudi Riyals (SAR) مبلغ التحمّل
  readonly deductibleSar: number;

  // Current quotation status: Available or Expired
  readonly status: QuotationStatus;

  // Vehicle associated with the quotation
  readonly vehicle: string;

  // Type of insurance coverage provided
  readonly coverage: string;

  // Date when the quotation was issued
  readonly issuedOn: string;
}

