import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { QuotationRequestState } from '../../models/quotation-request-state.model';
import { LanguageService } from '../../../../core/i18n/language.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './quotation-request-state.component.scss',
  selector: 'app-quotation-request-state',
  standalone: true,
  templateUrl: './quotation-request-state.component.html',
})
export class QuotationRequestStateComponent {
  @Input({ required: true }) state!: QuotationRequestState;
  @Input() empty = false;
  @Output() readonly retry = new EventEmitter<void>();

  constructor(protected readonly i18n: LanguageService) {}
}
