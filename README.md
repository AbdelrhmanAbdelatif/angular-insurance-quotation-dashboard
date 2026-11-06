# BCare Quotation Dashboard

A focused Angular 22 quotation-management dashboard for customer support representatives. It demonstrates reliable reactive search, feature-scoped state, API failure handling, and an accessible responsive workflow.

## Setup

Requirements: Node.js 20+ and npm 11+.

```bash
npm install
npm start
```

Open `http://localhost:4200/quotations`.

## Commands

```bash
npm start                 # development server
npm run build             # production build
npm test -- --watch=false
```

## Architecture

The application follows a feature-first boundary:

```text
src/app/
├── app.config.ts
├── app.routes.ts
├── core/i18n/
│   └── language.service.ts
├── shared/components/footer/
│   ├── footer.component.ts
│   ├── footer.component.html
│   ├── footer.component.scss
│   └── footer.component.spec.ts
├── shared/components/header/
│   ├── header.component.ts
│   ├── header.component.html
│   ├── header.component.scss
│   └── header.component.spec.ts
└── features/quotations/
    ├── models/
    ├── data-access/
    ├── state/
    ├── pages/
    ├── components/
    └── quotations.routes.ts
```

Each presentational component lives in its own folder with `.ts`, `.html`, `.scss`, and `.spec.ts` files. The application-wide language service belongs in `core/i18n`, while the reusable translated header and footer belong in `shared/components` and have no quotation-specific dependency.

The page composes presentational components. The store owns feature state and asynchronous orchestration. The mock API is behind the `QuotationsApi` token, so data access can be replaced without changing the page or components.

## State ownership

`QuotationsStore` owns:

- search query, status filter, and premium sort order;
- the API result collection and selected quotation ID;
- one authoritative request state: `idle`, `loading`, `success`, or `error`.

Signals expose synchronous view state. Computed Signals derive the displayed filtered/sorted list, selected quotation, and empty state. Components receive typed inputs and emit typed events; they do not call the API or duplicate request flags.

## Search cancellation and retry

Search terms enter an RxJS Subject. Every input marks the request as loading immediately, then `debounceTime(300)` prevents unnecessary calls. `switchMap` cancels the previous API Observable when a newer debounced term arrives, so an older response cannot replace the latest result. `takeUntilDestroyed` manages the store subscription lifecycle.

The request retries once after a short delay. A failed retry becomes the single error state and exposes a retry action. The retry action replays the current query.

## Mock API scenarios

The injectable mock service contains eight quotation records and simulates latency:

- normal searches wait 320 ms;
- terms containing `slow` wait 900 ms;
- terms containing `fast` wait 120 ms;
- searching `error` produces a reproducible service error;
- searching `retry` fails once, then succeeds through the store retry flow;
- customer names and quotation IDs are matched case-insensitively.

## Testing

The store tests use controlled Observables and virtual time. They verify:

1. an older `slow` response cannot overwrite a newer `fast` response;
2. a transient failure recovers after the explicit retry action.

## Interviewer verification walkthrough

### 1. Start and validate the application

```bash
npm install
npm start
```

Open `http://localhost:4200/quotations`. The page should load the Bcare hero, summary indicators, quotation workspace, reusable header, and reusable footer.

### 2. Verify language and direction

1. Click the language switcher in the header.
2. Confirm all visible copy changes between English and Arabic without a reload.
3. Open browser DevTools and check that `<html lang="ar" dir="rtl">` is present in Arabic.
4. Switch back to English and confirm `<html lang="en" dir="ltr">`.
5. Reload the page and confirm the selected language persists.

### 3. Verify search and stale-response protection

1. Search for `Sarah` and confirm the matching customer quotation appears.
2. Search for `QT-10482` and confirm quotation-ID search works.
3. Switch to Arabic and search for `عبدالرحمن`; the Arabic customer record should be returned and displayed in Arabic.
4. Type `slow`, then quickly replace it with `fast`; the final result must correspond to the latest query.
5. Inspect `quotations.store.spec.ts` and `mock-quotations-api.service.spec.ts` to see the deterministic virtual-time versions of these scenarios.

### 4. Verify filtering, sorting, selection, and details

1. Use the status control to show only Available or Expired quotations.
2. Change Premium between Lowest first and Highest first; the list order must change without another API request.
3. Select a quotation and confirm the details panel updates with customer, insurer, premium, deductible, vehicle, and coverage.
4. Search for a different customer and confirm a selected quotation that is no longer in the result set is cleared.

### 5. Verify loading, empty, error, and retry states

1. Search for `slow` and observe the loading state.
2. Search for an unmatched term such as `zzzz` and confirm the empty state.
3. Search for `error` and confirm the translated API-error state.
4. Click Try again and confirm the request is retried while the error state remains consistent.
5. Search for `retry` to exercise the mock transient-failure scenario.

### 6. Run deterministic automated verification

```bash

npm test --watch
npm run build
```

The meaningful assessment tests are in `src/app/features/quotations/state/quotations.store.spec.ts`: concurrency/stale-response prevention and retry recovery.

## Assessment coverage matrix

| Requirements area | Implementation/evidence |
| --- | --- |
| Customer name and quotation-ID search | Reactive search input and `QuotationsStore.search()` |
| Debounce and stale-response prevention | `debounceTime(300)` and `switchMap` in `quotations.store.ts` |
| Cancellation during debounce | Store concurrency test with virtual timers |
| Quotation fields and SAR values | Typed `Quotation` model, list item, and details component |
| Status filter and premium sort | Store computed view state and filter controls |
| Selectable detail panel | `selectQuotation()` and `QuotationDetailsComponent` |
| Injectable mock API | `MockQuotationsApiService` behind `QUOTATIONS_API` |
| Approximately eight records | Eight deterministic in-memory quotations |
| Variable latency and overlapping requests | `slow`/`fast` scenarios in the mock API |
| Keyword filtering and reproducible error | Case-insensitive matching plus `error` scenario |
| Loading, empty, error, and retry | Single `QuotationRequestState` and request-state component |
| Standalone and strict Angular | Standalone components, strict TypeScript/template configuration |
| Presentation/state/data-access separation | `components`, `pages`, `state`, and `data-access` boundaries |
| Signals and computed state | Store query, results, selection, summaries, and derived list Signals |
| RxJS lifecycle safety | `takeUntilDestroyed`, no nested subscriptions |
| OnPush and stable rendering | `ChangeDetectionStrategy.OnPush` and `track quotation.id` |
| Automated testing | Store concurrency and retry tests plus component smoke tests |
| Lazy routing | `app.routes.ts` lazy-loads `quotations.routes.ts` |
| Arabic/English and RTL/LTR | `LanguageService`, persisted language, document `lang`/`dir` updates |
| Shared architecture | Reusable `HeaderComponent` and `FooterComponent` under `shared/` |
| Leadership questions | Scaling, performance, and federation answers below |

The repository does not currently define an npm `lint` script; TypeScript checks, tests, production build, and `git diff --check` are the available automated validation commands.

## Visual direction

The visual treatment is a restrained approximation of BCare’s official site: deep navy, teal, and lime accents, rounded surfaces, generous whitespace, and modern sans-serif typography. The official site presents BCare as an insurance comparison platform and uses a clean contemporary product layout; exact public brand tokens and typography specifications were not exposed, so the implementation uses system/Inter-style fallbacks rather than adding a heavy styling dependency.

## Arabic and English localization

`LanguageService` in `src/app/core/i18n/` is the single owner of the active language and translation dictionary. It uses an Angular Signal so every translated template expression updates immediately without a page reload. The service persists the selected language in `localStorage` and updates the document’s `lang` and `dir` attributes (`en`/`ltr` or `ar`/`rtl`) through an effect.

The switcher is available in the top bar. All dashboard copy, controls, status labels, empty/loading/error messages, hero content, and accessibility labels are translated. Layouts use direction-aware flex/grid behavior and RTL-specific spacing adjustments without duplicating the page.

## Sass architecture

`src/main.scss` is the only global stylesheet entry point and loads the reset, typography, and layout layers. Design tokens and mixins live in `src/styles/abstracts` and are exposed through Sass `@forward`. Feature/page and shared-component styles remain colocated with their Angular components as `.component.scss` entry points; each delegates to the corresponding modular partial under `src/styles/components` or `src/styles/pages` with `@use`.

## Assumptions and limitations

- The API is intentionally local and in-memory; no backend or persistence is required.
- Search is server-shaped through the data-access contract, while status and premium sort are client-side view transformations for this small dataset.
- The UI is responsive for desktop and mobile widths; automated browser screenshots are not included in this repository.

## Technical leadership answers

### Scaling to 20 features

Keep each business capability inside its own lazy-loaded feature boundary with local models, data access, state, pages, and components. Put only genuinely domain-independent primitives in a separately governed shared library. Keep application-wide concerns such as authentication, telemetry, HTTP policy, and runtime configuration in core infrastructure. Assign ownership per feature, enforce import direction with lint rules, and expose stable public APIs rather than deep-linking across feature internals.

### Scaling to 100,000 records

Move search, filtering, sorting, and pagination to the server and request only the current page. Use cursor pagination or a carefully indexed query API, cache stable queries where useful, and keep state normalized around IDs. Render with virtual scrolling or paginated rows, stable tracking, and OnPush components. Avoid storing or recomputing the entire dataset in a component; keep derived view state bounded to the visible window.

### Module Federation, Native Federation, or neither

For this application, neither is appropriate: it is a small cohesive feature and federation would add deployment, versioning, runtime-integrity, and shared-dependency complexity. Consider Module Federation when independently deployed teams need mature Webpack-based runtime composition. Consider Native Federation when standards-based ESM delivery and modern Angular tooling are strategic requirements. In either case, the organizational need for independent release ownership should come before the technical mechanism.
