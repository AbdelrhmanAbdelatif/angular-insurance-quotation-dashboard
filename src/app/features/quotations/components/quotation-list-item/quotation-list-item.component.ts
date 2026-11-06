import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Quotation } from '../../models/quotation.model';
import { LanguageService } from '../../../../core/i18n/language.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
  selector: 'app-quotation-list-item',
  standalone: true,
  styleUrl: './quotation-list-item.component.scss',
  templateUrl: './quotation-list-item.component.html',
})
export class QuotationListItemComponent {
  @Input({ required: true }) quotation!: Quotation;
  @Input() selected = false;
  @Output() readonly selectedChange = new EventEmitter<string>();

  constructor(protected readonly i18n: LanguageService) {}
}
