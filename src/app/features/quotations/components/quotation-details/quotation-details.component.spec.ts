import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { QuotationDetailsComponent } from './quotation-details.component';

describe('QuotationDetailsComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({ imports: [QuotationDetailsComponent] }).compileComponents();
    expect(TestBed.createComponent(QuotationDetailsComponent).componentInstance).toBeTruthy();
  });
});
