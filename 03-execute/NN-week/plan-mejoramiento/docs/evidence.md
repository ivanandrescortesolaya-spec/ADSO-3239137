
# Evidence Register — Music School

**Identifier:** music-school  
**Project:** Musical Instrument Loan Management System  
**Training Group:** ADSO 3239137  
**Version:** 1.3
**Status:** Evidence Register
**Date:** 26/11/2026

---

## 1. Objective

Record and organize the evidence used to verify the deliverables developed and published in the Music School project's GitHub repository.

## 2. Documentation Evidence

| ID | Deliverable | Location |
|---|---|---|
| EV-01 | Project principles and guidelines | `docs/constitution.md` |
| EV-02 | Requirements specification | `docs/spec.md` |
| EV-03 | Development plan | `docs/plan.md` |
| EV-04 | System architecture | `docs/architecture.md` |
| EV-05 | Data model | `docs/data-model.md` |
| EV-06 | API contract | `docs/api-contract.md` |
| EV-07 | Task tracking matrix | `docs/tasks.md` |
| EV-08 | Architectural decisions | `docs/adr/` |

## 3. Frontend Evidence

| ID | Deliverable | Location |
|---|---|---|
| EV-09 | React administrative application | `app/` |
| EV-10 | Category, instrument, and student management | `app/src/pages/` |
| EV-11 | Loan and return management | `app/src/pages/` |
| EV-12 | Dashboard and inventory indicators | `app/src/pages/Dashboard.jsx` |
| EV-13 | Logical category activation and deactivation | `app/src/pages/Categories.jsx` |
| EV-14 | Category API communication | `app/src/services/categoryService.js` |

## 4. Technical Evidence

| ID | Evidence | Location |
|---|---|---|
| EVT-01 | Manual concurrency test for RN-05 | `docs/evidence/concurrency-test.md` |
| EVT-02 | Automated feature tests | `api/tests/Feature/` |
| EVT-03 | Automated unit tests | `api/tests/Unit/` |
| EVT-04 | Database migrations and integrity constraints | `api/database/migrations/` |
| EVT-05 | Test database isolation | `api/tests/Feature/DatabaseIsolationTest.php` |
| EVT-06 | Category management tests | `api/tests/Feature/CategoryTest.php` |
| EVT-07 | Instrument management tests | `api/tests/Feature/InstrumentManagementTest.php` |
| EVT-08 | Loan business rules and category validation | `api/tests/Feature/LoanTest.php` |
| EVT-09 | Manual concurrency test script | `api/tests/concurrency.php` |
| EVT-10 | Docker service configuration | `infra/docker-compose.yml` |
| EVT-11 | API data initialization tool | `tool/` |
| EVT-12 | Static public website | `page/` |
| EVT-13 | Loan transaction implementation | `api/app/Services/LoanService.php` |
| EVT-14 | Return transaction implementation | `api/app/Services/ReturnService.php` |
| EVT-15 | Current isolated PHPUnit suite and endpoint snapshot verification | `api/tests/Feature/`, `api/tests/Unit/` |
| EVT-16 | Manual inventory availability and loan-selector validation | `docs/evidence/availability-validation.md` |
| EVT-17 | Spanish application localization and validation messages | `api/lang/es/`, `api/config/app.php`, `api/.env.example` |
| EVT-18 | Administrative interface localization and category statistics verification | `app/src/` |
| EVT-19 | Public website branding and visual verification | `page/` |

## 5. Validation Criteria

- Each piece of evidence must correspond to an actual deliverable.
- File paths must match the repository structure.
- Test results must reflect actual executions.
- Commits must allow published changes to be identified.
- Components that have not yet been published shall not be considered delivered.

## 6. Final Validation — 13/11/2026

### TASK-23 — Automated Tests

- Environment: Docker Compose, `api-test` service.
- Test database: `music_school_test`.
- PHPUnit result: 56 tests passed.
- Assertions: 138.
- Automated test files: 16.
- Errors: 0.
- Command: `docker compose --env-file infra/.env -f infra/docker-compose.yml --profile testing run --rm api-test php artisan test`

### Frontend Validation

- Framework: React and Vite.
- Command: `npm run build`.
- Result: Successful production build.

### Infrastructure Validation

- Laravel API: port 8000.
- React frontend: port 5173.
- MySQL: port 3308.
- Public website: port 8080.
- Public website: HTTP 200 response.

### Data Initialization Validation

- Existing categories: 5.
- Existing instruments: 10.
- New records on the second execution: 0.
- Errors: 0.
- Result: Idempotent data initialization through the API.

### Functional Validation

- Registration and retrieval of categories, instruments, and students.
- Loan registration and retrieval.
- Availability and inventory control.
- Retrieval of overdue loans.
- Return registration and rejection of duplicate returns.
- Loan history.
- Most requested instruments report.
- Validations and HTTP error responses.
- Test database isolation.

## 7. Final Project Review — 15/11/2026

### Delivery Verification

- [x] All 23 tasks of the improvement plan are documented as completed.
- [x] Automated test results are recorded: 56 tests passed and 138 assertions.
- [x] The integration of Laravel, React, MySQL, and the public website through Docker Compose is documented.
- [x] The data initialization tool includes execution evidence.
- [x] The repository contains the project's technical documentation.

### Delivery Status

The Music School project includes the implementation, testing, and documentation of all 23 tasks established in the improvement plan.

The formal evaluation and technical presentation remain pending.

## 8. Technical Revalidation — 24/11/2026

A technical revalidation was performed to verify the current implementation and its consistency with the updated project documentation.

### 8.1. Automated Test Validation

The automated test suite was executed using the independent Laravel testing service configured in Docker Compose.

**Execution Command:**
```bash
docker compose --env-file infra/.env -f infra/docker-compose.yml --profile testing run --rm api-test php artisan test
```

**Execution Results:**

| Indicator | Result |
|---|---|
| Database | `music_school_test` |
| Database engine | MySQL 8.4 |
| Feature test files | 15 |
| Unit test files | 1 |
| Total automated test files | 16 |
| Tests passed | 56 |
| Tests failed | 0 |
| Assertions | 138 |
| Execution time | 2.94 seconds |
| Result | PASS |

The automated test suite completed successfully without reported failures.

---

### 8.2. Category Management Validation

Logical category activation and deactivation are documented as a scope extension in version 1.2 of `spec.md`.

The following scenarios were verified through automated tests:

| Validation | Result |
|---|---|
| Category registration and retrieval | PASS |
| Category activation and deactivation | PASS |
| Category status changes preserve instrument status | PASS |
| Category deactivation without associated instruments | PASS |
| Category deactivation with instruments without pending loans | PASS |
| Category deactivation with pending loans is rejected | PASS |
| Category deactivation after loan returns | PASS |
| Duplicate category codes are rejected | PASS |
| Required category fields are validated | PASS |
| Nonexistent categories return HTTP 404 | PASS |
| Instrument registration with inactive categories is rejected | PASS |
| Instrument updates with inactive categories are rejected | PASS |
| Loan registration with inactive categories is rejected | PASS |
| Loan registration with active categories is allowed | PASS |
| Returns remain available when a category is inactive | PASS |

These results verify the tested behavior of the category management implementation.

Formal approval of the documented scope extension remains pending.
### 8.3. Database Migration Validation

The migration status was verified using the Laravel testing service.

**Execution Command:**
```bash
docker compose --env-file infra/.env -f infra/docker-compose.yml --profile testing run --rm api-test php artisan migrate:status
```

**Results:**

| Indicator | Result |
|---|---|
| Total migrations | 11 |
| Executed migrations | 11 |
| Pending migrations | 0 |
| Category activation migration | Executed |
| Inventory integrity constraint migration | Executed |
| Result | PASS |

### 8.4. Database Structure Validation

The physical database structure was inspected using Laravel database inspection commands.

The five main business tables were verified against `data-model.md`.

| Table | Columns | Result |
|---|---:|---|
| `categories` | 6 | PASS |
| `instruments` | 9 | PASS |
| `students` | 6 | PASS |
| `loans` | 11 | PASS |
| `returns` | 5 | PASS |
| Total | 37 | PASS |

The inspection confirmed:

- Primary keys and foreign keys.
- Unique constraints.
- Required indexes.
- Unsigned inventory quantities.
- Category and instrument activation fields.
- Historical loan information.
- Foreign key deletion restrictions.
- Unique return records associated with loans.

The inspected database structure is consistent with the updated data model.

### 8.5. Inventory Integrity Validation

The physical definition of the `instruments` table was inspected using the MySQL `SHOW CREATE TABLE` statement.

```sql
CONSTRAINT chk_instruments_inventory
CHECK (available_units <= total_units)
```

The database also defines inventory quantities as unsigned integers.

| Validation | Result |
|---|---|
| `total_units` uses an unsigned integer | PASS |
| `available_units` uses an unsigned integer | PASS |
| Inventory check constraint exists | PASS |
| Inventory constraint matches the data model | PASS |

The database schema includes the required inventory integrity mechanisms.

### 8.6. Test Database Isolation

The database connection used by the Laravel testing service was verified.

| Indicator | Result |
|---|---|
| Database connection | `mysql` |
| Database engine | MySQL 8.4.11 |
| Database host | `mysql` |
| Internal database port | 3306 |
| Main application database | `music_school` |
| Testing database | `music_school_test` |
| DatabaseIsolationTest | PASS |

The verification confirmed that the automated tests use the designated testing database rather than the main application database.

### 8.7. Concurrency Validation — RN-05

The manual concurrency test was executed using two independent HTTP requests attempting to register a loan for the last available unit of an instrument.

**Test Script:** `api/tests/concurrency.php`

**Execution Commands:**
```bash
docker compose --env-file infra/.env -f infra/docker-compose.yml --profile testing up -d api-test

docker compose --env-file infra/.env -f infra/docker-compose.yml --profile testing exec api-test php tests/concurrency.php
```

**Execution Results:**

| Indicator | Result |
|---|---|
| Database | `music_school_test` |
| Instrument ID | 47 |
| Initial available units | 1 |
| Request 1 | HTTP 201 Created |
| Request 2 | HTTP 409 Conflict |
| Loans created | 1 |
| Final available units | 0 |
| Test result | PASS |

The tested scenario confirmed that only one loan was registered and that inventory availability remained consistent.

Additional evidence is maintained in `docs/evidence/concurrency-test.md`.

### 8.8. Docker Infrastructure Validation

The main development environment was started using Docker Compose.

**Execution Commands:**
```bash
docker compose --env-file infra/.env -f infra/docker-compose.yml up -d

docker compose --env-file infra/.env -f infra/docker-compose.yml ps
```

**Service Status:**

| Service | Container | Host Port | Status |
|---|---|---:|---|
| MySQL | `music-school-db` | 3308 | Running and healthy |
| Laravel API | `music-school-api` | 8000 | Running |
| React frontend | `music-school-app` | 5173 | Running |
| Public website | `music-school-page` | 8080 | Running |

All four main services started successfully in the existing development environment.

The testing service was stopped after completing the technical validation.

### 8.9. Frontend and Public Website Validation

The administrative application and public website were accessed through their configured local addresses.

| Component | URL | Result |
|---|---|---|
| React administrative application | `http://localhost:5173` | Accessible |
| Static public website | `http://localhost:8080` | Accessible |

The accessibility of both components was confirmed by the project operator.

Individual frontend workflows require separate functional verification.

### 8.10. Technical Validation Summary

| Validation | Result |
|---|---|
| Automated tests | 56 of 56 passed |
| Assertions | 138 |
| Automated test files | 16 |
| Database migrations | 11 of 11 executed |
| Main business tables | 5 of 5 inspected |
| Inventory integrity constraint | Verified |
| Test database selection | Verified |
| Category management tests | PASS |
| Manual concurrency scenario | PASS |
| Main Docker services | 4 of 4 running |
| React accessibility | Confirmed |
| Public website accessibility | Confirmed |
| Documented implementation tasks | 23 of 23 completed |

The technical revalidation supports the implementation status recorded in `tasks.md`.

The updated documentation describes the existing implementation and its verified behavior.

Formal evaluation, technical presentation, and approval of the documented scope extension remain pending.

## 8.11. Current Automated and Manual Validation — 25/11/2026

This entry records the latest execution results and visual validation supplied for this review. It supplements, and does not replace, the historical 56-test/138-assertion execution recorded in Sections 6 and 8.1–8.10.

### Automated PHPUnit Validation

**Execution command:**

```bash
docker compose -p music-school-clean --env-file infra/.env -f infra/docker-compose.yml --profile testing run --rm --no-deps api-test php vendor/bin/phpunit --display-warnings
```

| Indicator | Result |
|---|---|
| PHP | 8.3.37 |
| PHPUnit | 12.5.43 |
| Isolated Docker project | `music-school-clean` |
| MySQL volume | `music-school-clean_music_school_data` |
| Effective test database | `music_school_test` |
| Database isolation test | 1 test, 1 assertion, passed |
| Loan snapshot test | 2 tests, 11 assertions, passed |
| Full suite | 57 tests, 148 assertions, passed |
| Failures, errors, PHPUnit warnings | 0 |
| Duration | 2.854 seconds |
| Memory | 54.50 MB |

The executed `LoanSnapshotTest.php` now includes endpoint-level updates using `PUT /students/{id}` and `PUT /instruments/{id}`. It verifies successful responses, changed current records, and preservation of the original `student_code`, `student_name`, `instrument_code`, and `instrument_name` in the loan snapshot.

### Frontend Build and Lint Validation

| Check | Result |
|---|---|
| React container rebuild | Successful |
| Oxlint files and rules | 15 files, 104 rules |
| Oxlint errors | 0 |
| Oxlint warnings | 9 pre-existing warnings |
| Vite | 8.3.7, successful production build |
| Modules transformed | 93 |
| Build duration | 290 ms |

The frontend is not described as warning-free.

### Manual Availability Validation

The React application was checked at `http://localhost:5174` against the isolated API. No loans were registered during this visual validation. The observed baseline, category deactivation, and reactivation results are recorded in [`availability-validation.md`](evidence/availability-validation.md). No screenshot is claimed as a repository artifact.

During one browser session, a 0% Instrument availability display was observed while Chrome translated the page. In an incognito session without automatic translation, the displayed value was 91%, consistent with the eligible-unit calculation. The code formula was inspected and judged correct; the browser's internal cause for the temporary display was not established. No source change was made to `Instruments.jsx` for this observation.

## 8.12. Localization and Interface Revalidation — 26/11/2026

This entry records the latest isolated regression execution, localization changes, interface corrections, and visual observations. Previous execution results in Sections 6 and 8.1–8.11 remain historical evidence.

### Backend Localization and Validation Messages

The application locale and fallback locale are configured for Spanish. The configuration is represented in `api/.env.example`, `api/config/app.php`, and `infra/docker-compose.yml`.

Spanish validation rules and attribute names are defined in `api/lang/es/validation.php`. General validation messages and singular/plural error summaries are defined in `api/lang/es.json`. The localization includes nine translated validation rules and ten translated attribute names. Technical identifiers remain in English.

HTTP 422 responses were manually verified in the isolated environment by submitting empty student and loan registration requests. The student response displayed two additional validation errors in Spanish, and the loan response displayed one additional validation error in Spanish. These observations verify the tested requests only; they do not establish that every possible Laravel error message has been translated.

### Automated Regression Validation

The latest isolated PHPUnit execution used the `music-school-clean` Docker project and the `music_school_test` database. Its MySQL volume was `music-school-clean_music_school_data`.

| Indicator | Result |
|---|---|
| PHP | 8.3.37 |
| PHPUnit | 12.5.43 |
| Tests passed | 57 |
| Assertions | 148 |
| Failures | 0 |
| Errors | 0 |
| PHPUnit warnings | 0 |
| Duration | 2.556 seconds |
| Memory | 54.50 MB |
| Database isolation test | PASS |

The isolated regression suite passed. These results supplement the previous executions, which remain preserved above.

### Administrative Interface

Visible Dashboard labels were replaced with “Panel de control”. The student management heading was changed from “CRUD” to “Gestión”. The application title is “Music School”, the HTML language is configured as Spanish, and a custom musical SVG favicon was added.

The category statistics indicator was corrected to use the existing categories and instruments API responses. In the isolated environment, the corrected indicator displayed five categories and five categories with associated instruments. It counts categories with associated instruments regardless of instrument activation status. This correction required no new API endpoints or database schema changes.

### Final Frontend Build and Lint

The Docker application image build and isolated React container recreation completed successfully. Vite 8.3.7 produced a successful production build.

| Check | Result |
|---|---|
| Modules transformed | 93 |
| Build duration | 265 ms |
| Oxlint files | 15 |
| Oxlint rules | 104 |
| Oxlint errors | 0 |
| Oxlint warnings | 9 |
| Lint duration | 36 ms |

The nine remaining lint warnings comprise one unused `StrictMode` import, two render purity warnings related to `Date`, and six state-update-in-effect warnings. The frontend is not warning-free.

### Public Website Visual Verification

Spanish orthography was improved and a custom musical SVG favicon was added to the public website. Desktop visual verification was performed. The initial mobile viewport was inspected at approximately 400 × 738 pixels, with no visible horizontal overflow in that viewport.

Complete mobile navigation and all anchor destinations were not independently verified. No screenshots are claimed as stored in the repository.

### Synchronization and Infrastructure Protection

Nine selected files were synchronized from the isolated environment to the original project. SHA-256 comparisons confirmed identical contents for all nine files.

The original Docker Compose configuration retained its existing ports and database connection settings. Only Spanish locale and fallback locale settings were added to the original API and testing services. The original Docker Compose configuration passed `config --quiet`.

No automated tests were executed against the original application database during this revalidation. The original containers were not rebuilt as part of the latest isolated frontend verification.

## 9. Change Log

| Version | Date | Description |
|---|---|---|
| 1.0 | 10/11/2026 | Initial creation of the general evidence register. |
| 1.1 | 24/11/2026 | Updated technical evidence, automated test results, category management validation, database migrations, inventory constraints, test database isolation, concurrency results, and Docker infrastructure verification. |
| 1.2 | 25/11/2026 | Added the current isolated PHPUnit execution, endpoint-level snapshot result, frontend build/lint results, and manual availability validation while retaining prior test results as historical evidence. |
| 1.3 | 26/11/2026 | Added Spanish backend localization and validation evidence, isolated regression results, administrative interface corrections, frontend build and remaining lint warnings, public website visual verification, and synchronization and infrastructure protection records. |

---

**End of Document.**
