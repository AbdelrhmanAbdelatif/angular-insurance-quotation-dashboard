import { TestBed } from '@angular/core/testing';
import { Subject, Observable, defer, of, throwError } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { QuotationsApi, QUOTATIONS_API } from '../data-access/quotations-api.service';
import { Quotation } from '../models/quotation.model';
import { QuotationsStore } from './quotations.store';

const quote = (id: string): Quotation => ({
  id,
  customerName: 'Test Customer',
  customerNameAr: 'عميل تجريبي',
  insuranceCompany: 'Test Insurer',
  premiumSar: 1000,
  deductibleSar: 500,
  status: 'Available',
  vehicle: 'Test vehicle',
  coverage: 'Comprehensive',
  issuedOn: '01 Jan 2026',
});

class ControlledApi implements QuotationsApi {
  readonly requests = new Map<string, Subject<readonly Quotation[]>>();

  search(query: { readonly searchTerm: string }): Observable<readonly Quotation[]> {
    const request = new Subject<readonly Quotation[]>();
    this.requests.set(query.searchTerm, request);
    return request.asObservable();
  }
}

class RetryApi implements QuotationsApi {
  attempts = 0;

  search(): Observable<readonly Quotation[]> {
    return defer(() => {
      this.attempts += 1;
      return this.attempts < 3
        ? throwError(() => new Error('Temporary outage'))
        : of([quote('QT-RECOVERED')]);
    });
  }
}

describe('QuotationsStore', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('cancels during debounce and prevents an older response replacing a newer result', async () => {
    vi.useFakeTimers();
    const api = new ControlledApi();
    TestBed.configureTestingModule({ providers: [{ provide: QUOTATIONS_API, useValue: api }, QuotationsStore] });
    const store = TestBed.inject(QuotationsStore);

    store.search('slow');
    await vi.advanceTimersByTimeAsync(100);
    store.search('fast');
    await vi.advanceTimersByTimeAsync(300);

    expect(api.requests.has('slow')).toBe(false);

    store.search('slow');
    await vi.advanceTimersByTimeAsync(300);

    api.requests.get('fast')?.next([quote('QT-FAST')]);
    api.requests.get('slow')?.next([quote('QT-SLOW')]);

    expect(store.quotations().map(({ id }) => id)).toEqual(['QT-SLOW']);
  });

  it('recovers through the retry action after a transient API failure', async () => {
    vi.useFakeTimers();
    const api = new RetryApi();
    TestBed.configureTestingModule({ providers: [{ provide: QUOTATIONS_API, useValue: api }, QuotationsStore] });
    const store = TestBed.inject(QuotationsStore);

    store.search('retry');
    await vi.advanceTimersByTimeAsync(450);
    expect(store.requestState().status).toBe('error');

    store.retry();
    await vi.advanceTimersByTimeAsync(350);
    await vi.runAllTimersAsync();

    expect(store.requestState()).toEqual({ status: 'success' });
    expect(store.quotations()[0]?.id).toBe('QT-RECOVERED');
  });
});
