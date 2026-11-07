import { DestroyRef, Inject, Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, of } from 'rxjs';
import { catchError, debounceTime, map, retry, switchMap, tap } from 'rxjs/operators';
import { QUOTATIONS_API, QuotationsApi } from '../data-access/quotations-api.service';
import { Quotation } from '../models/quotation.model';
import { QuotationQuery } from '../models/quotation-query.model';
import { QuotationRequestState } from '../models/quotation-request-state.model';
import { LanguageService } from '../../../core/i18n/language.service';

// Represents the possible outcomes of a quotation search
type SearchResult =
  | { readonly kind: 'success'; readonly quotations: readonly Quotation[] }
  | { readonly kind: 'error'; readonly message: string };

@Injectable()
export class QuotationsStore {
  // Signals hold synchronous UI state (the current search and filtering criteria)
  // They make template reads reactive without manual subscriptions
  private readonly queryState = signal<QuotationQuery>({
    searchTerm: '',
    status: 'all',
    premiumSort: 'asc',
  });
  // Stores the quotations returned by the API
  private readonly results = signal<readonly Quotation[]>([]);
  // Tracks the ID of the currently selected quotation
  private readonly selectedId = signal<string | null>(null);
  // Tracks the current API request status (idle, loading, success, or error)
  private readonly requestStateState = signal<QuotationRequestState>({ status: 'idle' });
  // Emits search terms to trigger API requests through the RxJS pipeline
  private readonly searchRequests = new Subject<string>();
  // Exposes the query as read-only state so consumers cannot modify it directly
  readonly query = this.queryState.asReadonly();
  // Exposes the selected quotation ID as read only state
  readonly selectedQuotationId = this.selectedId.asReadonly();
  // Exposes the current request status as read only state
  readonly requestState = this.requestStateState.asReadonly();
  // Returns quotations filtered by status and sorted by premium
  // Recalculates automatically whenever the query or API results change
  readonly quotations = computed(() => {
    const query = this.queryState();
    return [...this.results()]
      .filter((quotation) => query.status === 'all' || quotation.status === query.status)
      .sort((left, right) =>
        query.premiumSort === 'asc'
          ? left.premiumSar - right.premiumSar
          : right.premiumSar - left.premiumSar,
      );
  });
  // Returns the currently selected quotation, or null if none is selected
  // Automatically updates when the selection or filtered quotations change
  readonly selectedQuotation = computed(
    () => this.quotations().find((quotation) => quotation.id === this.selectedId()) ?? null,
  );
  // Returns the total number of quotations received from the API
  readonly totalCount = computed(() => this.results().length);
  // Returns the number of quotations currently marked as Available
  readonly availableCount = computed(
    () => this.results().filter(({ status }) => status === 'Available').length,
  );
  // Calculates the average premium across all retrieved quotations.
  // Returns zero when there are no quotations to avoid division by zero.
  readonly averagePremium = computed(() => {
    const quotations = this.results();
    return quotations.length === 0
      ? 0
      : Math.round(
          quotations.reduce((total, quotation) => total + quotation.premiumSar, 0) /
            quotations.length,
        );
  });
  // Indicates whether the search completed successfully but returned no results
  // after applying the current status filter
  readonly isEmpty = computed(
    () => this.requestState().status === 'success' && this.quotations().length === 0,
  );

  constructor(
    @Inject(QUOTATIONS_API) private readonly api: QuotationsApi,
    private readonly i18n: LanguageService,
    destroyRef: DestroyRef,
  ) {
    // RxJS is used for asynchronous work: Subject accepts events, debounceTime reduces traffic,
    // switchMap cancels stale requests, and catchError converts failures into one request state.
    // A BehaviorSubject is unnecessary because Signals already hold the current synchronous query.
    // distinctUntilChanged would skip duplicate terms, but retry intentionally replays the same term.
    // toSignal() is also unnecessary here: the store already exposes native Angular Signals.
    this.searchRequests
      .pipe(
        // Immediately update the request status when a new search is triggered
        tap(() => this.requestStateState.set({ status: 'loading' })),
        // Wait 300ms after the latest search event before calling the API
        // This prevents unnecessary requests while the user is typing
        debounceTime(300),
        // Switch to the latest search request and unsubscribe from any previous request
        // This prevents outdated responses from replacing newer search results
        switchMap((searchTerm) =>
          this.api.search({ ...this.queryState(), searchTerm }).pipe(
            // Retry the API request once after a 150ms delay if it fails
            retry({ count: 1, delay: 150 }),
            // Transform a successful API response into a consistent success result
            map((quotations): SearchResult => ({ kind: 'success', quotations })),
            // Handle API failures without terminating the entire search stream
            // Return a consistent error result that can be handled by the subscriber
            catchError((error: unknown) =>
              of<SearchResult>({
                kind: 'error',
                message: this.i18n.t('serviceUnavailable'),
              }),
            ),
          ),
        ),
        // Automatically unsubscribe when the store is destroyed,
        // preventing memory leaks from ongoing subscriptions
        takeUntilDestroyed(destroyRef),
      )
      .subscribe((result) => {
        // Update the quotation results and request status after a successful response
        if (result.kind === 'success') {
          this.results.set(result.quotations);
          this.requestStateState.set({ status: 'success' });
          return;
        }
        // Update the request status when the API request fails
        this.requestStateState.set({ status: 'error', message: result.message });
      });
    // Trigger the initial search when the store is created.
    this.searchRequests.next('');
  }
  // Updates the search term and triggers a new API request
  search(searchTerm: string): void {
    // Remove leading whitespace before storing and searching the term
    const normalizedTerm = searchTerm.trimStart();
    // Update the query state while preserving existing filters and sorting
    // Also include the currently selected language in the API query
    this.queryState.update((query) => ({
      ...query,
      searchTerm: normalizedTerm,
      searchLanguage: this.i18n.language(),
    }));
    // Emit the normalized search term to trigger the RxJS search pipeline
    this.searchRequests.next(normalizedTerm);
  }
  // Updates the quotation status filter without making another API request
  // The computed quotations automatically recalculate using the new filter
  setStatus(status: QuotationQuery['status']): void {
    this.queryState.update((query) => ({ ...query, status }));
  }
  // Updates the premium sorting direction without making another API request
  // The computed quotations automatically reorder themselves
  setPremiumSort(premiumSort: QuotationQuery['premiumSort']): void {
    this.queryState.update((query) => ({ ...query, premiumSort }));
  }
  // Selects a quotation by its ID
  // The selectedQuotation computed signal updates automatically
  selectQuotation(id: string): void {
    this.selectedId.set(id);
  }
  // Repeats the most recent search using the current search term
  // Useful when the user wants to retry a failed API request
  retry(): void {
    this.searchRequests.next(this.queryState().searchTerm);
  }
}
