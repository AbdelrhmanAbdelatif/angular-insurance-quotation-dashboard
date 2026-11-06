// Domain data is kept framework-independent so the API, store, and components share one contract.
export type QuotationStatus = 'Available' | 'Expired';

export interface Quotation {
  readonly id: string;
  readonly customerName: string;
  readonly customerNameAr: string;
  readonly insuranceCompany: string;
  readonly premiumSar: number;
  readonly deductibleSar: number;
  readonly status: QuotationStatus;
  readonly vehicle: string;
  readonly coverage: string;
  readonly issuedOn: string;
}
