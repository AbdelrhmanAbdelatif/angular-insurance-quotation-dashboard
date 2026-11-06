import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LanguageService } from '../../../../core/i18n/language.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-quotation-search',
  standalone: true,
  styleUrl: './quotation-search.component.scss',
  templateUrl: './quotation-search.component.html',
})
export class QuotationSearchComponent {
  @Input() value = '';
  @Output() readonly valueChange = new EventEmitter<string>();

  constructor(protected readonly i18n: LanguageService) {}

  onInput(event: Event): void {
    // DOM events are converted to a typed output; the parent/store owns the actual search state.
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }
}
