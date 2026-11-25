
This project is the solution to the disciplinary notice issued to apprentice A12, training group 3239137, in the music-school domain.

# Music School

System for managing musical instruments, categories, students, loans, and returns.

The project has **23 tasks documented as completed**, integration through Docker Compose, passing automated tests, and technical evidence recorded in `docs/evidence.md`.

## Verified Technologies

| Component | Version or Requirement |
|---|---|
| PHP | `^8.3`, declared in `api/composer.json` |
| Laravel | `^13.17`, declared in `api/composer.json` |
| React | `^19.3.1`, declared in `app/package.json` |
| Vite | `^8.3.6`, declared in `app/package.json` |
| MySQL | `mysql:8.4` image |
| Node.js | `>=20`, required by `tool/package.json` |
| Docker | Docker Compose |
| Communication | HTTP API with JSON |

Composer and npm manage the dependencies declared in their manifests. The `api/` and `app/` components include lock files.

Docker Compose integrates MySQL, Laravel, React, and the static public website.

## Repository Structure

```text
.
|-- README.md
|-- api/
|   |-- app/
|   |   |-- Http/Controllers/Api/
|   |   |-- Models/
|   |   `-- Services/
|   |-- bootstrap/
|   |-- config/
|   |-- database/
|   |   |-- factories/
|   |   |-- migrations/
|   |   `-- seeders/
|   |-- public/
|   |-- resources/
|   |-- routes/
|   |-- tests/
|   |   |-- Feature/
|   |   `-- Unit/
|   |-- .env.example
|   |-- artisan
|   |-- composer.json
|   |-- composer.lock
|   `-- phpunit.xml
|-- app/
|   |-- public/
|   |-- src/
|   |   |-- pages/
|   |   `-- services/
|   |-- package.json
|   |-- package-lock.json
|   `-- vite.config.js
|-- docs/
|   |-- adr/
|   |   |-- ADR-001.md
|   |   |-- ADR-002.md
|   |   `-- ADR-003.md
|   |-- evidence/
|   |   `-- concurrency-test.md
|   |-- api-contract.md
|   |-- architecture.md
|   |-- constitution.md
|   |-- data-model.md
|   |-- evidence.md
|   |-- plan.md
|   |-- spec.md
|   `-- tasks.md
|-- infra/
|   |-- docker-compose.yml
|   |-- Dockerfile.api
|   |-- Dockerfile.app
|   `-- .env.example
|-- page/
|   |-- index.html
|   |-- script.js
|   `-- styles.css
`-- tool/
    |-- src/
    |-- categories.json
    |-- instruments.json
    |-- .env.example
    |-- package.json
    `-- README.md
```

## Implemented Features

The system allows users to:

- Retrieve and manage instrument categories.
- Activate and deactivate instrument categories without deleting their records.
- Prevent category deactivation when associated instruments have pending loans.
- Validate category activation status during instrument registration, instrument updates, and loan registration.
- Preserve existing instruments and historical records when category status changes.
- Register, retrieve, update, and deactivate instruments.
- Control available inventory units.
- Register and retrieve students.
- Register instrument loans.
- Retrieve active, overdue, and historical loans.
- Register returns.
- Retrieve the most requested instruments.
- Manage operations through a React interface.
- Present general information through an independent public website.
- Initialize categories and instruments using a tool that consumes the API.

## Business Rules

The system's business rules are documented in `docs/spec.md`.

### Loans

- A student cannot have more than one loan pending return.
- The return period is **21 days**.
- Loans of inactive instruments are not allowed.
- Loans of instruments belonging to inactive categories are not allowed.
- Loans are not allowed when no units are available.
- Overdue loans are identified by their due date and the absence of a registered return.
- Operation dates are managed in UTC.

### Inventory

- Available units cannot be negative.
- Available units cannot exceed the registered total.
- Inventory is updated when a loan or return is registered.
- Critical operations use database transactions.
- Inventory quantities are stored as unsigned integers.
- The database enforces inventory integrity through the `chk_instruments_inventory` check constraint.
- Instrument quantity updates must preserve the number of units currently on loan.

### Concurrency

The backend uses database transactions and row-level locking through `lockForUpdate()` to protect loan, return, and inventory operations.

The loan service locks the student and instrument records to prevent inconsistent inventory updates and multiple pending loans for the same student.

The return service locks the loan and instrument records to prevent duplicate returns and inconsistent inventory updates.

The manual concurrency test executed on 24/11/2026 produced the following results:

| Indicator | Result |
|---|---|
| Test database | `music_school_test` |
| Initial available units | 1 |
| First request | HTTP 201 Created |
| Second request | HTTP 409 Conflict |
| Loans created | 1 |
| Final available units | 0 |
| Test result | PASS |

The tested scenario confirmed that only one loan was registered for the last available unit.

The evidence is available in `docs/evidence.md`, `docs/evidence/concurrency-test.md`, and `docs/tasks.md`.

### Historical Records

Loans and returns are preserved in separate records to maintain the history of operations.

### Categories

Logical category activation and deactivation are documented as a scope extension in version 1.2 of `docs/spec.md`.

The following rules apply:

- Categories are active by default.
- Categories are managed through logical activation and deactivation.
- Categories with associated instruments that have pending loans cannot be deactivated.
- Inactive categories cannot be used for new instrument registrations, instrument updates, or loan registrations.
- Inactive categories can be reactivated.
- Category status changes do not modify the individual activation status of associated instruments.
- Existing relationships, loans, returns, and historical records are preserved.
- Returns remain available regardless of the current category status.

The implementation is documented in `docs/spec.md`, `docs/api-contract.md`, `docs/data-model.md`, `docs/architecture.md`, and `docs/tasks.md`.

The tested behavior is recorded in `docs/evidence.md`.

Formal approval of the documented scope extension remains pending.

## Execution Requirements

To run the project using Docker, the following are required:

- Docker Desktop or Docker Engine.
- Docker Compose.
- Available local ports: `8000`, `5173`, `3308`, and `8080`.
- Available local port `8001` when the independent testing service is enabled.
- Local environment configuration files for the main application and testing environment.

To run components manually, the following are required:

- PHP compatible with `^8.3`.
- Composer.
- Node.js and npm.
- A compatible MySQL instance.

## Configuration and Execution with Docker Compose

The following commands are prepared for PowerShell and must be executed from the project root.

### 1. Configure Environment Variables

Create the local infrastructure environment file if it does not already exist:

```powershell
if (-not (Test-Path infra/.env)) {
    Copy-Item infra/.env.example infra/.env
}
```

Edit `infra/.env` and set private passwords for the database variables, including:

- `DB_PASSWORD`
- `DB_ROOT_PASSWORD`

Create the Laravel environment file if it does not already exist:

```powershell
if (-not (Test-Path api/.env)) {
    Copy-Item api/.env.example api/.env
}
```

Configure the Laravel environment variables according to the Docker Compose configuration.

The main application uses the `music_school` database.

Inside Docker, the MySQL host is `mysql` and the internal database port is `3306`.

Database credentials must match the values configured in `infra/.env`.

The testing environment requires a separate `api/.env.testing` configuration file and the `music_school_test` database.

`.env` files contain private configuration and must not be published on GitHub.

### 2. Start the Services

```powershell
docker compose --env-file infra/.env -f infra/docker-compose.yml up -d
```

Docker Compose integrates four main services:

| Service | Local Address |
|---|---|
| Laravel API | `http://localhost:8000/api` |
| React Frontend | `http://localhost:5173` |
| Public Website | `http://localhost:8080` |
| MySQL | `127.0.0.1:3308` |

An independent Laravel testing service named `api-test` is also available through the `testing` profile.

| Testing Component | Configuration |
|---|---|
| Service | `api-test` |
| Docker Compose profile | `testing` |
| Host port | 8001 |
| Database | `music_school_test` |

The testing service is not required for normal application execution.

The main database is named `music_school`.

### 3. Check the Containers

```powershell
docker compose --env-file infra/.env -f infra/docker-compose.yml ps
```

The expected services are:

- `music-school-api`
- `music-school-app`
- `music-school-db`
- `music-school-page`

### 4. Run Migrations

With the services running and Laravel configuration prepared:

```powershell
docker compose --env-file infra/.env -f infra/docker-compose.yml exec -T api php artisan migrate --force
```

To check migration status:

```powershell
docker compose --env-file infra/.env -f infra/docker-compose.yml exec -T api php artisan migrate:status
```

### 5. Check the API

The API is available at:

`http://localhost:8000/api`

The Laravel health endpoint is available at:

`http://localhost:8000/up`

To check it from PowerShell:

```powershell
curl.exe -I http://localhost:8000/up
```

### 6. Stop the Services

```powershell
docker compose --env-file infra/.env -f infra/docker-compose.yml down
```

This command stops the services without requesting the deletion of persistent volumes.

## Running Laravel Manually

This option is an alternative to running the backend through Docker.

### 1. Prepare Laravel

```powershell
Copy-Item api/.env.example api/.env

Set-Location api

composer install

php artisan key:generate
```

Configure the MySQL connection details in `api/.env`.

If using MySQL exposed by Docker from Windows:

- Host: `127.0.0.1`
- Port: `3308`
- Database: `music_school`
- Username: The one configured in Docker Compose.
- Password: The one defined locally.

### 2. Run Migrations

```powershell
php artisan migrate
```

### 3. Start Laravel

```powershell
php artisan serve --host=0.0.0.0 --port=8000
```

API:

`http://localhost:8000/api`

## Running React Manually

This option is an alternative to running React through Docker.

From the project root:

```powershell
Set-Location app

npm install

npm run dev
```

The frontend uses the API available at:

`http://localhost:8000/api`

To generate the production build:

```powershell
npm run build
```

To run the linter:

```powershell
npm run lint
```

## Data Initialization Tool

The tool located in `tool/` registers initial information through HTTP requests to the API.

It does not execute direct SQL queries against MySQL.

### Initial Data

The defined categories are:

| Code | Category |
|---|---|
| CAT-01 | Cuerdas |
| CAT-02 | Vientos |
| CAT-03 | Percusión |
| CAT-04 | Teclados |
| CAT-05 | Electrónicos |

There are also **10 initial instruments** defined in `tool/instruments.json`.

### Execution

With the API running, from the repository root:

```powershell
Set-Location tool

Copy-Item .env.example .env

npm install

npm run seed
```

Verify that `API_BASE_URL` in `tool/.env` matches the API address.

The tool prevents duplicate records.

A verified repeated execution produced:

```text
CATEGORIAS:
Creadas: 0
Existentes: 5
Errores: 0

INSTRUMENTOS:
Creados: 0
Existentes: 10
Errores: 0
```

Execution evidence is recorded in `docs/evidence.md`.

## Automated Tests

The backend contains **16 automated test files**.

The latest verified execution was performed on 24/11/2026.

| Indicator | Result |
|---|---:|
| Passed Tests | 56 |
| Failed Tests | 0 |
| Assertions | 138 |
| Feature Test Files | 15 |
| Unit Test Files | 1 |
| Total Automated Test Files | 16 |
| Execution Time | 2.94 seconds |
| Success Rate | 100% |

### Run Tests Using Docker

From the project root:

```powershell
docker compose --env-file infra/.env -f infra/docker-compose.yml --profile testing run --rm api-test php artisan test
```

The `api-test` service uses the database:

`music_school_test`

The main API uses:

`music_school`

**Important:** Tests use operations that may reinitialize tables through `RefreshDatabase`. They must not be executed against the main database or against information that needs to be preserved.

The `DatabaseIsolationTest.php` test verifies that the automated test suite uses the designated `music_school_test` database.

Before running tests, the testing database must exist and the configured database user must have the required permissions.

### Verify the React Build

```powershell
docker compose --env-file infra/.env -f infra/docker-compose.yml exec -T app npm run build
```

The production build was successfully verified.

### Concurrency Test

The manual concurrency test is implemented in `api/tests/concurrency.php`.

The test must be executed against the designated `music_school_test` database.

Start the independent testing service:

```powershell
docker compose --env-file infra/.env -f infra/docker-compose.yml --profile testing up -d api-test
```

Execute the concurrency test:

```powershell
docker compose --env-file infra/.env -f infra/docker-compose.yml --profile testing exec api-test php tests/concurrency.php
```

The verified execution produced:

```text
Database: music_school_test
Instrument ID: 47
Initial available units: 1
Request 1: HTTP 201
Request 2: HTTP 409
Loans created: 1
Final available units: 0
Result: PASS
```

Stop the testing service after completing the validation:

```powershell
docker compose --env-file infra/.env -f infra/docker-compose.yml --profile testing stop api-test
```

The manual concurrency test is not included in the automated PHPUnit test count.

Detailed evidence is available in `docs/evidence.md` and `docs/evidence/concurrency-test.md`.

## Technical Documentation

| File | Content |
|---|---|
| `docs/constitution.md` | Project principles and constraints. |
| `docs/spec.md` | User stories, requirements, and business rules. |
| `docs/plan.md` | Implementation plan. |
| `docs/tasks.md` | Tracking of the 23 tasks. |
| `docs/architecture.md` | System architecture. |
| `docs/data-model.md` | Data model and relationships. |
| `docs/api-contract.md` | API contract. |
| `docs/evidence.md` | Technical evidence and test results. |
| `docs/evidence/concurrency-test.md` | Concurrency evidence. |
| `docs/adr/ADR-001.md` | Architectural Decision Record 001. |
| `docs/adr/ADR-002.md` | Architectural Decision Record 002. |
| `docs/adr/ADR-003.md` | Architectural Decision Record 003. |

Additional component-specific documentation is available in:

- `api/README.md`
- `app/README.md`
- `tool/README.md`

## Project Status

The work plan contains exactly 23 tasks.

| Indicator | Result |
|---|---:|
| Planned Tasks | 23 |
| Completed Tasks | 23 |
| Pending Tasks | 0 |
| Task Plan Progress | 100% |

The technical revalidation performed on 24/11/2026 confirmed the automated test results, database structure, migration status, inventory constraints, category management behavior, concurrency scenario, and availability of the main Docker services.

The documentation has been updated to reflect the current implementation.

Formal evaluation, technical presentation, and approval of the documented scope extension remain pending.

Implementation, tests, and evidence are recorded in the repository.

Task status does not replace the formal evaluation or grading of the improvement plan.

## Security

- `.env` files must remain outside version control.
- MySQL passwords must be configured through environment variables.
- Private keys and credentials must not be published.
- `.env.example` files serve as configuration templates.
- The test database `music_school_test` must remain separate from the main database `music_school`.
- Destructive tests must not be executed against information that needs to be preserved.
- Development ports must only be used in controlled environments.

## Validation Evidence

Technical evidence is recorded in `docs/evidence.md`.

### Previous Validation

The previous project validation recorded:

- Successful React production build.
- HTTP 200 response from the public website.
- API functionality.
- Successful and idempotent data initialization.
- Integration of the main Docker services.

### Technical Revalidation — 24/11/2026

| Validation | Result |
|---|---|
| Automated tests | 56 of 56 passed |
| Assertions | 138 |
| Automated test files | 16 |
| Database migrations | 11 of 11 executed |
| Main business tables | 5 of 5 inspected |
| Business table columns | 37 inspected |
| Inventory integrity constraint | Verified |
| Test database selection | Verified |
| Category management tests | PASS |
| Manual concurrency scenario | PASS |
| Main Docker services | 4 of 4 running |
| React frontend accessibility | Confirmed |
| Public website accessibility | Confirmed |
| Documented implementation tasks | 23 of 23 completed |

The results correspond to the verified execution in the existing development environment.

Detailed results and execution commands are available in `docs/evidence.md`.

## Documentation Updates

| Date | Description |
|---|---|
| 24/11/2026 | Updated the project documentation to describe logical category activation and deactivation, database integrity constraints, transaction flows, testing configuration, concurrency evidence, and technical revalidation results. |

The documented scope extension remains subject to formal validation.
