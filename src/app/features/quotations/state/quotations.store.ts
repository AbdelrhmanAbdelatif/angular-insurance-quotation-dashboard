import { DestroyRef, Inject, Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, of } from 'rxjs';
import { catchError, debounceTime, map, retry, switchMap, tap } from 'rxjs/operators';
import { QUOTATIONS_API, QuotationsApi } from '../data-access/quotations-api.service';
import { Quotation } from '../models/quotation.model';
import { QuotationQuery } from '../models/quotation-query.model';
import { QuotationRequestState } from '../models/quotation-request-state.model';
import { LanguageService } from '../../../core/i18n/language.service';

type SearchResult =
  | { readonly kind: 'success'; readonly quotations: readonly Quotation[] }
  | { readonly kind: 'error'; readonly message: string };

@Injectable()
export class QuotationsStore {
  // Signals hold synchronous UI state. They make template reads reactive without manual subscriptions.
  private readonly queryState = signal<QuotationQuery>({
    searchTerm: '',
    status: 'all',
    premiumSort: 'asc',
  });
  private readonly results = signal<readonly Quotation[]>([]);
  private readonly selectedId = signal<string | null>(null);
  private readonly requestStateState = signal<QuotationRequestState>({ status: 'idle' });
  private readonly searchRequests = new Subject<string>();

  readonly query = this.queryState.asReadonly();
  readonly selectedQuotationId = this.selectedId.asReadonly();
  readonly requestState = this.requestStateState.asReadonly();
  readonly quotations = computed(() => {
    const query = this.queryState();
    return [...this.results()]
      .filter((quotation) => query.status === 'all' || quotation.status === query.status)
      .sort((left, right) => query.premiumSort === 'asc'
        ? left.premiumSar - right.premiumSar
        : right.premiumSar - left.premiumSar);
  });
  readonly selectedQuotation = computed(() =>
    this.quotations().find((quotation) => quotation.id === this.selectedId()) ?? null,
  );
  readonly totalCount = computed(() => this.results().length);
  readonly availableCount = computed(() => this.results().filter(({ status }) => status === 'Available').length);
  readonly averagePremium = computed(() => {
    const quotations = this.results();
    return quotations.length === 0
      ? 0
      : Math.round(quotations.reduce((total, quotation) => total + quotation.premiumSar, 0) / quotations.length);
  });
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
    this.searchRequests.pipe(
      tap(() => this.requestStateState.set({ status: 'loading' })),
      debounceTime(300),
      switchMap((searchTerm) => this.api.search({ ...this.queryState(), searchTerm }).pipe(
        retry({ count: 1, delay: 150 }),
        map((quotations): SearchResult => ({ kind: 'success', quotations })),
        catchError((error: unknown) => of<SearchResult>({
          kind: 'error',
          message: this.i18n.t('serviceUnavailable'),
        })),
      )),
      takeUntilDestroyed(destroyRef),
    ).subscribe((result) => {
      if (result.kind === 'success') {
        this.results.set(result.quotations);
        this.requestStateState.set({ status: 'success' });
        return;
      }

      this.requestStateState.set({ status: 'error', message: result.message });
    });

    this.searchRequests.next('');
  }

  search(searchTerm: string): void {
    const normalizedTerm = searchTerm.trimStart();
    this.queryState.update((query) => ({
      ...query,
      searchTerm: normalizedTerm,
      searchLanguage: this.i18n.language(),
    }));
    this.searchRequests.next(normalizedTerm);
  }

  setStatus(status: QuotationQuery['status']): void {
    this.queryState.update((query) => ({ ...query, status }));
  }

  setPremiumSort(premiumSort: QuotationQuery['premiumSort']): void {
    this.queryState.update((query) => ({ ...query, premiumSort }));
  }

  selectQuotation(id: string): void {
    this.selectedId.set(id);
  }

  retry(): void {
    this.searchRequests.next(this.queryState().searchTerm);
  }
}
