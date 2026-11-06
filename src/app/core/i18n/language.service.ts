
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { effect, Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

// Supported application languages.
export type Language = 'en' | 'ar';

// All translation keys used throughout the application.
// Using a union type ensures that only valid translation keys can be used.
type TranslationKey =
  | 'brandName' | 'brandArabic' | 'supportWorkspace' | 'languageSwitch' | 'switchToArabic' | 'switchToEnglish'
  | 'customerSupport' | 'dashboardTitle' | 'dashboardDescription' | 'today' | 'date'
  | 'heroEyebrow' | 'heroTitle' | 'heroDescription' | 'heroPrimaryAction' | 'heroSecondaryAction'
  | 'heroStatQuotations' | 'heroStatAvailable' | 'heroStatAvgPremium' | 'heroStatSubtitle'
  | 'findQuotation' | 'findQuotationDescription' | 'searchLabel' | 'searchHint' | 'searchPlaceholder'
  | 'refineResults' | 'status' | 'allStatuses' | 'available' | 'expired' | 'premium' | 'lowestFirst' | 'highestFirst'
  | 'quickTip' | 'quickTipText' | 'matchingRecords' | 'quotations' | 'result' | 'results'
  | 'selectedQuotation' | 'selectQuotation' | 'selectionHint' | 'insurer' | 'deductible' | 'vehicle' | 'coverage'
  | 'readyForDiscussion' | 'loadingTitle' | 'loadingMessage' | 'errorTitle' | 'tryAgain' | 'emptyTitle' | 'emptyMessage'
  | 'footerDisclaimer' | 'lastSynced' | 'premiumValue' | 'comprehensive' | 'thirdParty' | 'serviceUnavailable';

// Translation dictionary.
// Each language must provide a translation for every TranslationKey.
const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    brandName: 'BCare', brandArabic: 'بي كير', supportWorkspace: 'Customer support workspace', languageSwitch: 'Language', switchToArabic: 'العربية', switchToEnglish: 'English',
    customerSupport: 'Customer support', dashboardTitle: 'Quotation dashboard', dashboardDescription: 'Find, compare, and review insurance offers in one place.', today: 'Today', date: '06 November 2026',
    heroEyebrow: 'Insurance, made clearer', heroTitle: 'Welcome to your smarter quotation workspace', heroDescription: 'Compare customer offers, understand the price at a glance, and help every customer choose with confidence.', heroPrimaryAction: 'Explore quotations', heroSecondaryAction: 'Clear search',
    heroStatQuotations: 'Quotations', heroStatAvailable: 'Available now', heroStatAvgPremium: 'Average premium', heroStatSubtitle: 'Live workspace summary',
    findQuotation: 'Find a quotation', findQuotationDescription: 'Search the latest customer offers.', searchLabel: 'Search quotations', searchHint: 'Customer name or quotation ID', searchPlaceholder: 'e.g. Abdulrahman or QT-1',
    refineResults: 'Refine results', status: 'Status', allStatuses: 'All statuses', available: 'Available', expired: 'Expired', premium: 'Premium', lowestFirst: 'Lowest first', highestFirst: 'Highest first',
    quickTip: 'Quick tip', quickTipText: 'Search with a quotation ID for an exact match.', matchingRecords: 'Matching records', quotations: 'Quotations', result: 'result', results: 'results',
    selectedQuotation: 'Selected quotation', selectQuotation: 'Select a quotation', selectionHint: 'Choose a record from the list to review its pricing and coverage details.', insurer: 'Insurer', deductible: 'Deductible', vehicle: 'Vehicle', coverage: 'Coverage', readyForDiscussion: 'Ready for customer discussion',
    loadingTitle: 'Loading quotations', loadingMessage: 'Checking the latest offers for you…', errorTitle: 'We couldn’t load quotations', tryAgain: 'Try again', emptyTitle: 'No quotations found', emptyMessage: 'Try a different customer name or quotation ID.',
    footerDisclaimer: 'Offers are indicative and subject to insurer approval.', lastSynced: 'Last synced just now', premiumValue: 'Premium', comprehensive: 'Comprehensive', thirdParty: 'Third party', serviceUnavailable: 'The quotation service is temporarily unavailable.',
  },

  ar: {
    brandName: 'بي كير', brandArabic: 'BCare', supportWorkspace: 'مساحة عمل دعم العملاء', languageSwitch: 'اللغة', switchToArabic: 'العربية', switchToEnglish: 'English',
    customerSupport: 'دعم العملاء', dashboardTitle: 'لوحة عروض التأمين', dashboardDescription: 'ابحث عن عروض التأمين وقارنها وراجعها من مكان واحد.', today: 'اليوم', date: '06 نوفمبر 2026',
    heroEyebrow: 'التأمين أصبح أوضح', heroTitle: 'مرحباً بك في مساحة عروض التأمين الذكية', heroDescription: 'قارن عروض العملاء وافهم السعر بسرعة وساعد كل عميل على الاختيار بثقة.', heroPrimaryAction: 'استكشف العروض', heroSecondaryAction: 'مسح البحث',
    heroStatQuotations: 'العروض', heroStatAvailable: 'متاحة الآن', heroStatAvgPremium: 'متوسط القسط', heroStatSubtitle: 'ملخص مساحة العمل المباشر',
    findQuotation: 'البحث عن عرض', findQuotationDescription: 'ابحث في أحدث عروض العملاء.', searchLabel: 'البحث في العروض', searchHint: 'اسم العميل أو رقم العرض', searchPlaceholder: 'مثال: عبدالرحمن أو QT-1',
    refineResults: 'تصفية النتائج', status: 'الحالة', allStatuses: 'كل الحالات', available: 'متاح', expired: 'منتهي', premium: 'القسط', lowestFirst: 'الأقل أولاً', highestFirst: 'الأعلى أولاً',
    quickTip: 'نصيحة سريعة', quickTipText: 'استخدم رقم العرض للوصول إلى نتيجة دقيقة.', matchingRecords: 'السجلات المطابقة', quotations: 'العروض', result: 'نتيجة', results: 'نتائج',
    selectedQuotation: 'العرض المحدد', selectQuotation: 'اختر عرضاً', selectionHint: 'اختر سجلاً من القائمة لمراجعة تفاصيل السعر والتغطية.', insurer: 'شركة التأمين', deductible: 'مبلغ التحمل', vehicle: 'المركبة', coverage: 'التغطية', readyForDiscussion: 'جاهز لمناقشة العميل',
    loadingTitle: 'جاري تحميل العروض', loadingMessage: 'نبحث عن أحدث العروض لك…', errorTitle: 'تعذر تحميل العروض', tryAgain: 'حاول مرة أخرى', emptyTitle: 'لم يتم العثور على عروض', emptyMessage: 'جرّب اسم عميل أو رقم عرض مختلفاً.',
    footerDisclaimer: 'العروض إرشادية وتخضع لموافقة شركة التأمين.', lastSynced: 'تمت المزامنة الآن', premiumValue: 'القسط', comprehensive: 'شامل', thirdParty: 'ضد الغير', serviceUnavailable: 'خدمة عروض التأمين غير متاحة مؤقتاً.',
  },
};

@Injectable({ providedIn: 'root' })
export class LanguageService {

  // Key used to save and retrieve the selected language from browser storage.
  private readonly storageKey = 'bcare-dashboard-language';

  // Reactive language state.
  // The initial language is determined by readStoredLanguage().
  // Arabic is used when no language preference has been saved.
  /**
   *  For BCare dashboard, signal() is a good choice because:
      we have one current language at a time.
      Language changes should immediately update the UI.
      we don't need RxJS subscriptions for simple language state.
      It works naturally with Angular's effect().
   */
  readonly language = signal<Language>(this.readStoredLanguage());

  constructor(
    // DOCUMENT allows us to update the HTML document's language and direction.
    @Inject(DOCUMENT) private readonly document: Document,

    // PLATFORM_ID helps us distinguish browser execution from server-side rendering.
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {

    // An Angular effect automatically runs whenever the language signal changes.
    // It keeps the HTML document and browser storage synchronized with the selected language.
    effect(() => {

      // Read the current language from the signal.
      const language = this.language();

      // Update the HTML lang attribute for accessibility and language recognition.
      // Example: <html lang="ar">
      this.document.documentElement.lang = language;

      // Arabic uses right-to-left (RTL).
      // English uses left-to-right (LTR).
      this.document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

      // Access localStorage only in the browser.
      // This prevents errors during server-side rendering (SSR).
      if (isPlatformBrowser(this.platformId)) {
        window.localStorage.setItem(this.storageKey, language);
      }
    });
  }

  // Returns the translated text for a given key.
  // Example: t('dashboardTitle') returns the title in the currently selected language.
  t(key: TranslationKey): string {
    return translations[this.language()][key];
  }

  // Changes the current language.
  // Updating the signal automatically triggers the effect above.
  setLanguage(language: Language): void {
    this.language.set(language);
  }

  // Switches between Arabic and English.
  // If the current language is English, switch to Arabic, and vice versa.
  toggle(): void {
    this.setLanguage(this.language() === 'en' ? 'ar' : 'en');
  }

  // Reads the previously selected language from localStorage.
  // If no valid English preference exists, Arabic is the default.
  private readStoredLanguage(): Language {

    // localStorage is available only in the browser.
    if (isPlatformBrowser(this.platformId)) {

      // Keep English only if the user explicitly selected English.
      // Otherwise, use Arabic as the default.
      return window.localStorage.getItem(this.storageKey) === 'en' ? 'en' : 'ar';
    }

    // Use Arabic during server-side rendering as well.
    return 'ar';
  }
}
