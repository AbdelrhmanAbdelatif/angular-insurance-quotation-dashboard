import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { QuotationListItemComponent } from './quotation-list-item.component';

describe('QuotationListItemComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({ imports: [QuotationListItemComponent] }).compileComponents();
    expect(TestBed.createComponent(QuotationListItemComponent).componentInstance).toBeTruthy();
  });
});
