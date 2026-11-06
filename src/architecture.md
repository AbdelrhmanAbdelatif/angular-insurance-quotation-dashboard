# Insurance Quotation Dashboard Architecture

## Scope

This document defines the project structure for the insurance quotation dashboard. It is intentionally limited to architecture and boundaries; it does not implement UI or business logic.

## Proposed structure

```text
src/
├── app/
│   ├── app.ts
│   ├── app.html
│   ├── app.scss
│   ├── app.config.ts
│   ├── app.routes.ts
│   │
│   ├── core/
│   │   └── i18n/
│   │       └── language.service.ts
│   ├── shared/
│   │   └── components/
│   │       └── footer/
│   │           ├── footer.component.ts
│   │           ├── footer.component.html
│   │           ├── footer.component.scss
│   │           └── footer.component.spec.ts
│   │       └── header/
│   │           ├── header.component.ts
│   │           ├── header.component.html
│   │           ├── header.component.scss
│   │           └── header.component.spec.ts
│   │
│   └── features/
│       └── quotations/
│           ├── models/
│           │   ├── quotation.model.ts
│           │   ├── quotation-query.model.ts
│           │   └── quotation-request-state.model.ts
│           │
│           ├── data-access/
│           │   ├── quotations-api.service.ts
│           │   └── mock-quotations-api.service.ts
│           │
│           ├── state/
│           │   ├── quotations.store.ts
│           │   └── quotations.store.spec.ts
│           │
│           ├── pages/
│           │   └── quotations-page.component.ts
│           │
│           ├── components/
│           │   ├── quotation-search/
│           │   │   ├── quotation-search.component.ts
│           │   │   ├── quotation-search.component.html
│           │   │   ├── quotation-search.component.scss
│           │   │   └── quotation-search.component.spec.ts
│           │   ├── quotation-filters/
│           │   ├── quotation-list/
│           │   ├── quotation-list-item/
│           │   ├── quotation-details/
│           │   └── quotation-request-state/
│           │
│           └── quotations.routes.ts
│
├── main.scss
├── requirements.md
└── architecture.md
```

`core/` and `shared/` are intentionally not included yet. The assessment does not require authentication, interceptors, global services, or domain-independent reusable components. They should be introduced only when a concrete cross-feature requirement exists.

## Responsibilities

### Application shell

- `app.config.ts`: application-wide providers and Angular configuration.
- `app.routes.ts`: top-level routing and lazy loading of the quotations feature.
- `app.ts`, `app.html`, and `app.scss`: application shell only; no quotation business logic.

### `features/quotations/models/`

Owns quotation domain types, query/filter/sort types, and the single request-state contract. These types must not depend on Angular components or the store.

### `features/quotations/data-access/`

Owns the quotation API boundary. `quotations-api.service.ts` defines the feature data-access contract, while `mock-quotations-api.service.ts` supplies approximately eight records, variable latency, keyword filtering, and deterministic error behavior through RxJS Observables.

### `features/quotations/state/`

Owns feature-scoped orchestration. The store coordinates query changes, API calls, retry, selected quotation state, Signals, computed view state, and the single request-state source of truth. It must not contain template markup.

### `features/quotations/pages/`

Owns route-level composition. `quotations-page.component.ts` connects the store to presentational components and provides feature-level providers. It should remain thin and use a standalone component with `OnPush` change detection.

### `features/quotations/components/`

Contains presentational standalone components. Components receive typed inputs and emit typed user events. They do not call the API or own duplicated loading, error, or empty flags.

### Tests

`quotations.store.spec.ts` will contain deterministic tests for:

1. stale-response prevention when search terms change rapidly;
2. retry recovery or another critical behavior such as filtering/sorting or API errors.

## Dependency direction

```text
Application routes
        ↓
Quotations page
        ↓
Presentational components ← typed inputs/events → page/store
        ↓
Quotations store
        ↓
Quotation API contract
        ↓
Mock API implementation
```

The dependency rule is one-way: presentation depends on state, state depends on data access, and data access depends on models. The API implementation must not depend on pages or components.

## State ownership and request strategy

- The quotations store owns the current search term, status filter, premium sort order, selected quotation, result collection, and request state.
- Signals represent synchronous state exposed to the view.
- Computed Signals derive filtered/sorted display state and selected quotation details.
- RxJS handles asynchronous search input, debouncing, request cancellation, API errors, and retry.
- Search requests use `debounceTime` followed by `switchMap`. A newer query cancels the previous inner observable, preventing an older response from replacing newer results.
- Retry is scoped to the failed request and preserves one request-state object rather than introducing separate loading/error/empty flags.
- The page consumes store state and event methods; it does not manually subscribe to API calls.

## Assessment requirement mapping

| Requirement | Architectural location |
| --- | --- |
| Reactive search and debounce | `state/quotations.store.ts` |
| Stale-response prevention | `switchMap` in the store and concurrency test |
| Mock API and latency | `data-access/mock-quotations-api.service.ts` |
| Quotation domain typing | `models/` |
| Loading, empty, and error states | `quotation-request-state.model.ts` and store |
| Standalone presentation | `pages/` and `components/` |
| Lazy loading | `quotations.routes.ts` and `app.routes.ts` |
| Strict TypeScript/templates | `tsconfig.json` |
| Stable list rendering | quotation list component |
| Retry/error recovery test | `quotations.store.spec.ts` |

## Assumptions and tradeoffs

- The feature uses Angular Signals and RxJS directly; no external state library is justified for one screen.
- The mock API remains inside the quotations feature because it is quotation-specific and is not a generic repository.
- Feature-scoped state is provided at the quotations route/page boundary so it is created and destroyed with the feature.
- `core/` and `shared/` are deferred to avoid empty folders and premature abstractions.
- The requested single-screen scope does not justify microfrontends or monorepo tooling.

## Files planned for a later implementation phase

The structure above is the implementation plan. Creating the Angular services, components, state logic, tests, and routing changes requires a separate implementation approval because the requirements explicitly prohibit implementation during the architecture phase.

## Sass organization

`src/main.scss` is the single global entry point for reset, typography, and layout styles. Sass design tokens and mixins are centralized under `src/styles/abstracts` and exposed with `@forward`. Page and component SCSS files remain colocated with their Angular components and use the modular partials under `src/styles/pages` and `src/styles/components`.
