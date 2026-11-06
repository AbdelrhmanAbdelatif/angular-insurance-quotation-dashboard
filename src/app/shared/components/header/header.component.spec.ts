import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  it('creates the reusable header', async () => {
    await TestBed.configureTestingModule({ imports: [HeaderComponent] }).compileComponents();

    expect(TestBed.createComponent(HeaderComponent).componentInstance).toBeTruthy();
  });
});
