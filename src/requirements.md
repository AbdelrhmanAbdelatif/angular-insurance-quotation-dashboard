# Insurance Quotation Dashboard Requirements

## Technical Hiring Assessment — Angular Team Lead

### 01 | Project brief

Build a small insurance quotation management dashboard for customer support representatives. Users should be able to find quotations, review essential pricing details, and inspect an individual quotation. The quotation API may be slow or intermittently fail, so the interface must remain consistent and responsive.

Prioritize correctness, maintainability, and sound technical decisions over visual polish. The assessment is intentionally limited to a single screen.

### 02 | Functional requirements

#### A. Search and query handling

- Search by customer name or quotation ID using a reactive input.
- Debounce user input to avoid unnecessary requests.
- Ensure stale responses never replace newer search results, even during rapid input changes.
- Use a clear cancellation or concurrency strategy and be able to explain the choice.

#### B. Quotation list and details

- Display quotation ID, customer name, insurance company, premium amount (SAR), deductible amount (SAR), and status (Available / Expired).
- Allow filtering by status and sorting premium in ascending/descending order.
- Show a detail panel when a quotation is selected.

#### C. Mock API

- No backend is required. Create an injectable mock API service using RxJS Observables with approximately eight records.
- Simulate variable network latency, keyword filtering, and an error response.
- Make it possible to demonstrate overlapping requests and stale-response handling.

#### D. UI states

- Provide loading, empty-results, and API-error states, with a retry action.
- Avoid duplicated state and unnecessary manual subscriptions.

### 03 | Angular engineering expectations

- Use standalone components and strong TypeScript typing (strict mode).
- Separate presentation concerns from business logic; use logical, reusable components.
- Choose an appropriate approach using Angular Signals, computed state, and/or RxJS. Explain the ownership of each type of state.
- Demonstrate efficient change detection and stable list rendering.
- Handle observable lifecycles cleanly; avoid nested subscriptions and unmanaged side effects.

### 04 | Automated testing

Provide at least two meaningful automated tests:

- Concurrency: rapid search changes must not allow an earlier API response to overwrite the latest search results.
- One critical behavior of your choice: filtering, sorting, API error handling, or retry functionality.

Prioritize deterministic tests and clear assertions over test count.

### 05 | Technical leadership questions

Include short answers in the README:

1. **Scalable architecture.** If this application expanded into 20 feature areas maintained by several frontend teams, how would you structure feature boundaries, shared libraries, routing, and ownership?
2. **Performance at scale.** If the quotation view needed to support 100,000 records, what would you change regarding data access, rendering, and state management?
3. **Microfrontends.** When would you recommend Module Federation, Native Federation, or neither? Discuss the technical and organizational tradeoffs.

### 06 | Guidelines and deliverables

- Use a recent stable Angular release. No authentication, database, deployment, or complex styling is required.
- UI libraries, optional state-management libraries, and AI coding assistants are permitted, provided decisions are explained and defended.
- Provide a GitHub repository with the source code, tests, and a README explaining setup, execution, architecture decisions, assumptions, and known limitations.
- Keep the implementation focused; architectural choices will be discussed during the technical interview.

## Architecture task

Act as an Angular Team Lead with 9+ years of experience. Inspect the existing project and any `AGENTS.md` instructions before proposing changes.

The current task is **only to design the architecture and project structure** for the insurance quotation dashboard. Do not implement business logic or UI during the architecture phase.

Use a simple, scalable, feature-based architecture with these boundaries:

- `core/`: application-wide infrastructure only, such as authentication, HTTP interceptors, and global configuration.
- `features/`: business features that own their models, data access, state, pages, and feature-specific components.
- `shared/`: domain-independent presentation components, pipes, and utilities genuinely reused across features.

Create `core/` and `shared/` only when actual requirements justify their contents. Do not add empty folders or move quotation-specific code into them.

Organize the quotations feature around:

- `models/`
- `data-access/`
- `state/`
- `pages/`
- `components/`
- `quotations.routes.ts`

Architectural requirements:

- Standalone Angular components.
- Strict TypeScript and strict template checking.
- Lazy-loaded feature routing.
- Clear separation between presentation, state orchestration, and data access.
- Feature-scoped quotations state.
- RxJS for debounced search, request cancellation, API errors, and retry.
- Signals and computed state for synchronous view state.
- A single source of truth for request state; avoid duplicated loading/error/empty flags.
- Presentational components receive typed inputs and emit user events.
- OnPush change detection and stable list tracking.
- Deterministic tests for stale-response prevention and error/retry recovery.
- No external state library, generic repositories, base classes, microfrontends, or monorepo tooling unless a concrete requirement justifies them.

Before making implementation changes:

1. Summarize all assessment requirements.
2. Propose the folder and file tree.
3. Explain each area’s responsibilities and dependency direction.
4. Explain state ownership and the request-cancellation strategy.
5. Identify assumptions and architectural tradeoffs.
6. Explain which files would be created or changed.
7. Stop and wait for approval.

Do not install dependencies, implement UI or business logic, commit, or push anything to GitHub during the architecture phase.
