
# Evidence Register — Music School

**Identifier:** music-school  
**Project:** Musical Instrument Loan Management System  
**Training Group:** ADSO 3239137  
**Version:** 1.0  
**Status:** Evidence Register  
**Date:** 10/11/2026

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

## 4. Technical Evidence

| ID | Evidence | Location |
|---|---|---|
| EVT-01 | Manual concurrency test for RN-05 | `docs/evidence/concurrency-test.md` |

## 5. Validation Criteria

- Each piece of evidence must correspond to an actual deliverable.
- File paths must match the repository structure.
- Test results must reflect actual executions.
- Commits must allow published changes to be identified.
- Components that have not yet been published shall not be considered delivered.

## 6. Change Log

| Version | Date | Description |
|---|---|---|
| 1.0 | 10/11/2026 | Initial creation of the general evidence register. |

---

**End of Document.**

## Final Validation — 13/11/2026

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

## Final Project Review — 15/11/2026

### Delivery Verification

- [x] All 23 tasks of the improvement plan are documented as completed.
- [x] Automated test results are recorded: 56 tests passed and 138 assertions.
- [x] The integration of Laravel, React, MySQL, and the public website through Docker Compose is documented.
- [x] The data initialization tool includes execution evidence.
- [x] The repository contains the project's technical documentation.

### Delivery Status

The Music School project includes the implementation, testing, and documentation of all 23 tasks established in the improvement plan.

The formal evaluation and technical presentation remain pending.
