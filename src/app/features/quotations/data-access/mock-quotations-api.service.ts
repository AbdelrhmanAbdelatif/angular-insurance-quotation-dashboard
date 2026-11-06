import { Injectable } from '@angular/core';
import { Observable, defer, of, throwError, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Quotation } from '../models/quotation.model';
import { QuotationQuery } from '../models/quotation-query.model';
import { QuotationsApi } from './quotations-api.service';

@Injectable()
export class MockQuotationsApiService implements QuotationsApi {
  // The in-memory records make the assessment deterministic and keep a backend out of scope.
  private readonly quotations: readonly Quotation[] = [
    {
      id: 'QT-1',
      customerName: 'Abdulrahman Al-Ghamdi',
      customerNameAr: 'عبدالرحمن الغامدي',
      insuranceCompany: 'Tawuniya',
      premiumSar: 2480,
      deductibleSar: 750,
      status: 'Available',
      vehicle: '2023 Toyota Camry',
      coverage: 'Comprehensive',
      issuedOn: '12 Sep 2025',
    },
    {
      id: 'QT-2',
      customerName: 'Mohamed Al-Ghamdi',
      customerNameAr: 'محمد الغامدي',
      insuranceCompany: 'Bupa Arabia',
      premiumSar: 3180,
      deductibleSar: 1000,
      status: 'Available',
      vehicle: '2024 Hyundai Tucson',
      coverage: 'Comprehensive',
      issuedOn: '11 Sep 2025',
    },
    {
      id: 'QT-3',
      customerName: 'Abdelatif Al-Ghamdi',
      customerNameAr: 'عبداللطيف الغامدي',
      insuranceCompany: 'MedGulf',
      premiumSar: 1725,
      deductibleSar: 500,
      status: 'Available',
      vehicle: '2022 Kia Sportage',
      coverage: 'Third party',
      issuedOn: '08 Sep 2025',
    },
    {
      id: 'QT-4',
      customerName: 'Eslam Al-Ghamdi',
      customerNameAr: 'إسلام الغامدي',
      insuranceCompany: 'Malath',
      premiumSar: 4260,
      deductibleSar: 1500,
      status: 'Expired',
      vehicle: '2021 Ford Explorer',
      coverage: 'Comprehensive',
      issuedOn: '04 Sep 2025',
    },
    {
      id: 'QT-5',
      customerName: 'Noura Al-Ghamdi',
      customerNameAr: 'نورة الغامدي',
      insuranceCompany: 'Al Rajhi Takaful',
      premiumSar: 2190,
      deductibleSar: 750,
      status: 'Available',
      vehicle: '2023 Honda Accord',
      coverage: 'Comprehensive',
      issuedOn: '28 Aug 2025',
    },
    {
      id: 'QT-6',
      customerName: 'Ahmed Al-Ghamdi',
      customerNameAr: 'أحمد الغامدي',
      insuranceCompany: 'Walaa',
      premiumSar: 2890,
      deductibleSar: 1000,
      status: 'Expired',
      vehicle: '2020 Nissan Patrol',
      coverage: 'Third party',
      issuedOn: '24 Aug 2025',
    },
    {
      id: 'QT-7',
      customerName: 'Rahaf Al-Ghamdi',
      customerNameAr: 'رهف الغامدي',
      insuranceCompany: 'ACIG',
      premiumSar: 3650,
      deductibleSar: 1250,
      status: 'Available',
      vehicle: '2024 Mazda CX-5',
      coverage: 'Comprehensive',
      issuedOn: '18 Aug 2025',
    },
    {
      id: 'QT-8',
      customerName: 'Yousef Al-Ghamdi',
      customerNameAr: 'يوسف الغامدي',
      insuranceCompany: 'SAB Insurance',
      premiumSar: 1980,
      deductibleSar: 500,
      status: 'Expired',
      vehicle: '2022 Chevrolet Tahoe',
      coverage: 'Third party',
      issuedOn: '10 Aug 2025',
    },
  ];
  private readonly retryAttempts = new Map<string, number>();

  search(query: QuotationQuery): Observable<readonly Quotation[]> {
    // defer starts latency and scenario evaluation per subscription, which makes retry realistic.
    const term = query.searchTerm.trim().toLowerCase();
    const latency = term.includes('slow') ? 900 : term.includes('fast') ? 120 : 320;

    return defer(() => timer(latency).pipe(
      switchMap(() => {
        if (term === 'error') {
          return throwError(() => new Error('The quotation service is temporarily unavailable.'));
        }

        if (term === 'retry' && (this.retryAttempts.get(term) ?? 0) === 0) {
          this.retryAttempts.set(term, 1);
          return throwError(() => new Error('The first retry scenario request failed.'));
        }

        return of(this.quotations).pipe(
          map((quotations) => quotations.filter((quotation) =>
            term.length === 0 ||
            quotation.id.toLowerCase().includes(term) ||
            quotation.customerName.toLowerCase().includes(term) ||
            quotation.customerNameAr.toLowerCase().includes(term),
          )),
        );
      }),
    ));
  }
}
