import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PremiumSort } from '../../models/quotation-query.model';
import { QuotationStatus } from '../../models/quotation.model';
import { LanguageService } from '../../../../core/i18n/language.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-quotation-filters',
  standalone: true,
  styleUrl: './quotation-filters.component.scss',
  templateUrl: './quotation-filters.component.html',
})
export class QuotationFiltersComponent {
  // Inputs are presentation-only values; outputs let the feature store remain the single owner.
  @Input() status: QuotationStatus | 'all' = 'all';
  @Input() premiumSort: PremiumSort = 'asc';
  @Output() readonly statusChange = new EventEmitter<QuotationStatus | 'all'>();
  @Output() readonly premiumSortChange = new EventEmitter<PremiumSort>();

  constructor(protected readonly i18n: LanguageService) {}
}
