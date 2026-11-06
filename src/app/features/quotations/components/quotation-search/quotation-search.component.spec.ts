import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { QuotationSearchComponent } from './quotation-search.component';

describe('QuotationSearchComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({ imports: [QuotationSearchComponent] }).compileComponents();
    expect(TestBed.createComponent(QuotationSearchComponent).componentInstance).toBeTruthy();
  });
});
