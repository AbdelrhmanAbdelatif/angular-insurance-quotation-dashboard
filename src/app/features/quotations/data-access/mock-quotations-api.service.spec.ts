import { afterEach, describe, expect, it, vi } from 'vitest';
import { MockQuotationsApiService } from './mock-quotations-api.service';

describe('MockQuotationsApiService', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('matches Arabic customer names', async () => {
    vi.useFakeTimers();
    const api = new MockQuotationsApiService();
    let result: readonly { readonly customerNameAr: string }[] = [];

    api.search({ searchTerm: 'عبدالرحمن', status: 'all', premiumSort: 'asc' }).subscribe((quotations) => {
      result = quotations;
    });
    await vi.advanceTimersByTimeAsync(320);

    expect(result.map(({ customerNameAr }) => customerNameAr)).toEqual(['عبدالرحمن الغامدي']);
  });
});
