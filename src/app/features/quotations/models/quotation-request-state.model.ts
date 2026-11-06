// A discriminated union keeps loading, success, empty, and error rendering mutually consistent.
export type QuotationRequestState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'success' }
  | { readonly status: 'error'; readonly message: string };
