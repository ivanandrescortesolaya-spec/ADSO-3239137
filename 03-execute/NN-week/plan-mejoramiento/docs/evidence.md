
# Evidence Register — Music School

**Identifier:** music-school  
**Project:** Musical Instrument Loan Management System  
**Training Group:** ADSO 3239137  
**Version:** 1.1
**Status:** Evidence Register
**Date:** 24/11/2026

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

## 9. Change Log

| Version | Date | Description |
|---|---|---|
| 1.0 | 10/11/2026 | Initial creation of the general evidence register. |
| 1.1 | 24/11/2026 | Updated technical evidence, automated test results, category management validation, database migrations, inventory constraints, test database isolation, concurrency results, and Docker infrastructure verification. |

---

**End of Document.**