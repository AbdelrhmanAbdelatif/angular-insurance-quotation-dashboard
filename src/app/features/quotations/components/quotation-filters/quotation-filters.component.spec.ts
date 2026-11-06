import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { QuotationFiltersComponent } from './quotation-filters.component';

describe('QuotationFiltersComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({ imports: [QuotationFiltersComponent] }).compileComponents();
    expect(TestBed.createComponent(QuotationFiltersComponent).componentInstance).toBeTruthy();
  });
});
