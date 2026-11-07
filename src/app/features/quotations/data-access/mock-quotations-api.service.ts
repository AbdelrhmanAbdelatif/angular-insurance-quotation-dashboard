import { Injectable } from '@angular/core';
import { Observable, defer, of, throwError, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Quotation } from '../models/quotation.model';
import { QuotationQuery } from '../models/quotation-query.model';
import { QuotationsApi } from './quotations-api.service';

// Injectable allows Angular to create and inject this service.
@Injectable() 
export class MockQuotationsApiService implements QuotationsApi {
  // The in-memory records make the assessment deterministic and keep a backend out of scope.
  // Fake quotation records stored in memory.
  // readonly prevents reassignment of the array property.
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
  // Stores how many times a specific retry scenario has been attempted.
  // Used to simulate a failed first request and successful next request.
  private readonly retryAttempts = new Map<string, number>();

  // Accepts search parameters and returns an Observable of quotations.
  search(query: QuotationQuery): Observable<readonly Quotation[]> {
    // defer starts latency and scenario evaluation per subscription, which makes retry realistic.
    // Remove surrounding spaces and convert the search text to lowercase.
    const term = query.searchTerm.trim().toLowerCase();
     // Select the correct customer name property based on the language.
    const customerName = query.searchLanguage === 'ar' ? 'customerNameAr' : 'customerName';
    // Simulate different API response times for testing loading states.
    const latency = term.includes('slow') ? 900 : term.includes('fast') ? 120 : 320;
    // defer delays Observable creation until subscription.
    // Each subscription executes the request logic again.
    return defer(() => 
      // Simulate backend response time.
      timer(latency).pipe(
        // After the timer emits, execute the request logic.
      switchMap(() => {
        // Scenario 1: Always return an error for the word "error".
        if (term === 'error') {
          return throwError(() => new Error('The quotation service is temporarily unavailable.'));
        }
        // Scenario 2: Fail only the first request for "retry".
        if (term === 'retry' && (this.retryAttempts.get(term) ?? 0) === 0) {
          // Record that the first attempt has happened.
          this.retryAttempts.set(term, 1);
           // Simulate a failed API request.
          return throwError(() => new Error('The first retry scenario request failed.'));
        }
        // Convert the in-memory quotation array into an Observable.
        return of(this.quotations).pipe(
          // Transform the emitted array by filtering matching records.
          map((quotations) => quotations.filter((quotation) =>
            // Return all records if the search input is empty.
            term.length === 0 ||
             // Match the quotation ID.
            quotation.id.toLowerCase().includes(term) ||
            // Match the customer name in the selected language.
            quotation[customerName].toLowerCase().includes(term),
          )),
        );
      }),
    ));
  }
}
