import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Quotation } from '../../models/quotation.model';
import { QuotationListItemComponent } from '../quotation-list-item/quotation-list-item.component';
import { LanguageService } from '../../../../core/i18n/language.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QuotationListItemComponent],
  selector: 'app-quotation-list',
  standalone: true,
  styleUrl: './quotation-list.component.scss',
  templateUrl: './quotation-list.component.html',
})
export class QuotationListComponent {
  @Input() quotations: readonly Quotation[] = [];
  @Input() selectedId: string | null = null;
  @Output() readonly quotationSelected = new EventEmitter<string>();

  constructor(protected readonly i18n: LanguageService) {}
}
