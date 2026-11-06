import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { QuotationsStore } from '../state/quotations.store';
import { QuotationDetailsComponent } from '../components/quotation-details/quotation-details.component';
import { QuotationFiltersComponent } from '../components/quotation-filters/quotation-filters.component';
import { QuotationListComponent } from '../components/quotation-list/quotation-list.component';
import { QuotationRequestStateComponent } from '../components/quotation-request-state/quotation-request-state.component';
import { QuotationSearchComponent } from '../components/quotation-search/quotation-search.component';
import { LanguageService } from '../../../core/i18n/language.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    FooterComponent,
    HeaderComponent,
    QuotationDetailsComponent,
    QuotationFiltersComponent,
    QuotationListComponent,
    QuotationRequestStateComponent,
    QuotationSearchComponent,
  ],
  providers: [QuotationsStore],
  selector: 'app-quotations-page',
  standalone: true,
  styleUrl: './quotations-page.component.scss',
  templateUrl: './quotations-page.component.html',
})
export class QuotationsPageComponent {
  constructor(
    protected readonly store: QuotationsStore,
    protected readonly i18n: LanguageService,
  ) {}

  // The hero action reuses the store API, keeping the page free of duplicate query state.
  clearSearch(): void {
    this.store.search('');
  }
}
