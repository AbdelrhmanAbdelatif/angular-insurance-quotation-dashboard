// A discriminated union keeps loading, success, empty, and error rendering mutually consistent


/**
 * Represents the possible states of a quotation request.
 * Using a discriminated union ensures only one request state
 * can be active at a time and provides type safe error handling.
 */
export type QuotationRequestState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'success' }
  | { readonly status: 'empty' }
  | { readonly status: 'error'; readonly message: string };

