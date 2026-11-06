import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { QuotationListComponent } from './quotation-list.component';

describe('QuotationListComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({ imports: [QuotationListComponent] }).compileComponents();
    expect(TestBed.createComponent(QuotationListComponent).componentInstance).toBeTruthy();
  });
});
