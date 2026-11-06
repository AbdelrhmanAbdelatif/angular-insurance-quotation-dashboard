import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LanguageService } from '../../../core/i18n/language.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  standalone: true,
  styleUrl: './header.component.scss',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  constructor(protected readonly i18n: LanguageService) {}
}
