
# Project Constitution — Music School

**Identifier:** music-school  
**Project:** Musical Instrument Loan Management System  
**Training Group:** ADSO 3239137  
**Version:** 1.1
**Apprentice Code:** A12

## 1. Purpose

This document establishes the fundamental principles, constraints, and technical rules that must be followed during the design, development, implementation, and maintenance of the Music School system.

Every component, feature, and change must comply with this constitution and the requirements defined in the project specification.

## 2. Fundamental Principles

### Article I. Business Rule Integrity

Business rules must be implemented in the backend using Laravel.

The frontend shall not be responsible for enforcing system constraints, since every operation must be validated again on the server.

**Verification:** Send requests directly to the API to confirm that business rules are enforced even when the graphical user interface is not used.

### Article II. Separation of Responsibilities

The system must maintain clearly separated responsibilities:

- React: presentation and user interaction.
- Laravel: business logic, validation, and REST API.
- Database: data persistence, relationships, and constraints.
- Docker: service execution and communication.

**Verification:** Confirm that the frontend consumes the API and that business rules do not depend exclusively on React.

### Article III. Communication Contract

Communication between React and Laravel shall be performed through HTTP endpoints and JSON responses.

All operations must comply with the contract defined in `api-contract.md`.

**Verification:** Execute endpoint tests and verify their requests, responses, and HTTP status codes.

### Article IV. Inventory Control

The available units of each instrument must always remain between zero and the registered total number of units.

No loan may result in negative inventory quantities or exceed the existing number of units.

**Verification:** Perform loan, return, and inventory update tests.

### Article V. Loan Restrictions

Each student may have a maximum of one unreturned instrument.

The loan period shall be 21 days.

Students with overdue loans shall not receive additional instruments until the corresponding instrument has been returned.

**Verification:** Execute tests involving students without loans, students with active loans, and students with overdue loans.

### Article VI. Historical Data Protection

Loans and returns are historical records and must not be deleted.

The snapshot data stored for each operation must preserve the original information recorded when the operation was performed and must not change when catalog information is updated.

The instrument catalog shall use logical deactivation instead of physical deletion.

### Article VII. Concurrency Control

When two operators simultaneously attempt to lend the last available unit of an instrument, only one operation may succeed.

The operation that fails due to insufficient availability must receive an HTTP `409 Conflict` response.

**Verification:** Execute an automated concurrency test using two simultaneous requests.

### Article VIII. Time Management

Operation dates and times shall be stored and processed in UTC.

The return deadline shall be calculated from the time the loan is registered.

**Verification:** Check stored dates, due dates, and their representation in API responses.

### Article IX. Security and Secret Protection

Credentials and configuration secrets must not be stored directly in the repository.

Environment variables and a `.env.example` file without sensitive information shall be used.

Passwords must be stored using secure hashing mechanisms.

**Verification:** Review version-controlled files, HTTP responses, and execution logs to ensure that secrets are not exposed.

### Article X. Migration Management

The database structure must be maintained through version-controlled Laravel migrations.

Relationships, keys, indexes, and constraints must correspond to the model defined in `data-model.md`.

**Verification:** Execute migrations against an empty database and confirm that the expected schema is created.

### Article XI. Language Conventions

Code identifiers, variables, classes, methods, tables, and columns shall be written in English.

Messages, notifications, and text displayed to users shall be written in Spanish.

**Verification:** Review the source code and user interface.

### Article XII. Specification-Driven Development

No functionality may be developed unless it is associated with a documented requirement, user story, or task.

Features outside the defined scope must not be added.

Each task shall be considered completed when verifiable evidence of its implementation exists.

**Verification:** Trace the tasks defined in `tasks.md` to their corresponding requirements, tests, and results.

### Article XIII. Report Generation

The system must provide a report of the most requested instruments using historical information from registered loans.

**Verification:** Register loans for different instruments and confirm that the report correctly reflects their request frequency.

## 3. Required Technologies

| Component | Technology |
|---|---|
| Frontend | React |
| Backend | PHP with Laravel |
| Communication | REST API |
| Data Exchange Format | JSON |
| Containers | Docker |
| Database | MySQL |

## 4. Domain-Specific Rules

The system must comply with the following conditions:

1. A maximum of one unreturned instrument per student.
2. A loan period of 21 days.
3. New loans must be blocked when overdue instruments have not been returned.
4. Continuous control of available units and total units.
5. Preservation of historical data for each operation.
6. Logical deactivation of instruments.
7. Storage of dates and times in UTC.
8. User-facing messages in Spanish.
9. A report of the most requested instruments.
10. Concurrency control to prevent the last available unit from being lent twice.

## 5. Compliance with the Constitution

All team members or individuals responsible for development must follow these principles.

Any change affecting a business rule, technical decision, or system scope must be documented and justified.

Important architectural decisions shall be recorded in Architectural Decision Records (ADRs).

## 6. Acceptance Criteria

The constitution shall be considered implemented when:

- Business rules are implemented in the backend.
- The architecture respects the separation of responsibilities.
- The data model maintains data integrity.
- Concurrency is properly controlled.
- Secrets are protected.
- Automated tests demonstrate compliance with the established principles.
- Implemented features correspond to the approved specification.

## 7. Change Log

| Version | Date | Description |
|---|---|---|
| 1.1 | 25/11/2026 | Removed the restriction on Spanish accent marks while retaining English code identifiers and Spanish user-facing text. |
