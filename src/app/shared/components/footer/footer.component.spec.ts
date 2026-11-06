import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  it('creates the reusable footer', async () => {
    await TestBed.configureTestingModule({ imports: [FooterComponent] }).compileComponents();

    expect(TestBed.createComponent(FooterComponent).componentInstance).toBeTruthy();
  });
});
