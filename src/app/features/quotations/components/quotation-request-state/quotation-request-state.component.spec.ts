import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { QuotationRequestStateComponent } from './quotation-request-state.component';

describe('QuotationRequestStateComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({ imports: [QuotationRequestStateComponent] }).compileComponents();
    expect(TestBed.createComponent(QuotationRequestStateComponent).componentInstance).toBeTruthy();
  });
});
