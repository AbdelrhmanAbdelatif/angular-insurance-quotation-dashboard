import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LanguageService } from '../../../core/i18n/language.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-footer',
  standalone: true,
  styleUrl: './footer.component.scss',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  constructor(protected readonly i18n: LanguageService) {}
}
