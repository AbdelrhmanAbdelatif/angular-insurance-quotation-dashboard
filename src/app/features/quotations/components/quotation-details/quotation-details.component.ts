import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Quotation } from '../../models/quotation.model';
import { LanguageService } from '../../../../core/i18n/language.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
  selector: 'app-quotation-details',
  standalone: true,
  styleUrl: './quotation-details.component.scss',
  templateUrl: './quotation-details.component.html',
})
export class QuotationDetailsComponent {
  @Input() quotation: Quotation | null = null;

  constructor(protected readonly i18n: LanguageService) {}
}
