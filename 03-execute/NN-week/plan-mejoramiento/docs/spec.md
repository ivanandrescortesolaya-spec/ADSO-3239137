
# Requirements Specification — Music School

**Identifier:** music-school  
**Project:** Musical Instrument Loan Management System  
**Training Group:** ADSO 3239137  
**Version:** 1.3
**Status:** Under Review

---

## 1. Purpose

This document establishes the functional requirements, business rules, non-functional requirements, and acceptance criteria for the Music School system.

The system is intended to manage the musical instrument catalog, control available inventory units, manage loans and returns, and generate reports on the most requested instruments.

This specification serves as the main reference for the design, development, implementation, and validation of the product.

## 2. System Scope

Music School shall allow users to:

- Manage the musical instrument catalog.
- Organize instruments into five categories.
- Manage logical category activation and deactivation as a scope extension.
- View the total and available units of each instrument.
- Manage student information.
- Register instrument loans.
- Register instrument returns.
- Control loan return deadlines.
- Identify overdue loans.
- Preserve transaction history.
- Generate reports on the most requested instruments.
- Prevent inventory inconsistencies during simultaneous operations.

### 2.1 Instrument Categories

The system must include five initial categories:

| Code | Category |
|---|---|
| CAT-01 | Strings |
| CAT-02 | Wind Instruments |
| CAT-03 | Percussion |
| CAT-04 | Keyboards |
| CAT-05 | Electronic Instruments |

These categories must be available through the data seeding tool.
As a scope extension, the system supports logical category activation and deactivation. Categories are active by default. A category cannot be deactivated while any of its instruments has a pending loan. Inactive categories can be reactivated without deleting their records.

The category activation and deactivation scope extension remains under review. This status does not indicate formal instructor approval.

### 2.2 Instrument Models and Physical Units

The system shall distinguish between an instrument model and its physical units.

- **Model:** Represents an instrument type and is identified by a unique model code.
- **Physical units:** Represent the physical units belonging to an instrument model.
- **Total units:** Total number of registered physical units.
- **Available units:** Number of physical units currently available for lending.

Availability must be updated whenever loans and returns are registered.

### 2.3 Project Technologies

| Component | Technology |
|---|---|
| Frontend | React |
| Backend | PHP with Laravel |
| Database | MySQL |
| Communication | REST API |
| Data Exchange | JSON |
| Infrastructure | Docker |

## 3. System Actors

### 3.1 Student

A person who requests musical instruments on loan.

Responsibilities and needs:

- View available instruments.
- View instrument information.
- Request an instrument loan.
- Return an instrument through the monitor.
- Know the due dates of their loans.

### 3.2 Monitor or Operator

The person responsible for managing loan and return operations.

Responsibilities:

- View the instrument catalog.
- View student information.
- Register loans.
- Register returns.
- Check transaction status.
- Verify instrument availability.

The system must prevent two operators from simultaneously lending the last available unit.

## 4. User Stories

### HU-01. Instrument Management

**As a** monitor,  
**I want to** register musical instrument models and their physical units,  
**so that** I can keep the catalog organized and control inventory.

**Acceptance Criteria:**

- The system must allow instrument models to be registered.
- Each model must have a unique identification code.
- Each model must belong to a category.
- Each model must record its total and available units.
- Negative quantities must not be accepted.
- Available units must not exceed total units.
- Categories must support logical activation and deactivation.
- Categories with pending instrument loans cannot be deactivated.
- Inactive categories can be reactivated.
- Instruments belonging to inactive categories cannot be borrowed.

### HU-02. Catalog Consultation

**As a** student,  
**I want to** view the musical instrument catalog,  
**so that** I can identify instruments and their available units.

**Acceptance Criteria:**

- The system must display active instruments.
- The corresponding category must be displayed.
- Available units must be displayed.
- Deactivated instruments must not appear as available for new loans, and new loans involving them must not be permitted.

### HU-03. Student Management

**As a** monitor,  
**I want to** register and view student information,  
**so that** I can correctly identify people requesting instruments.

**Acceptance Criteria:**

- The system must allow students to be registered.
- Each student must have an identifier.
- The system must allow registered information to be viewed.
- Loans must be associated with an existing student.

### HU-04. Loan Registration

**As a** monitor,  
**I want to** register an instrument loan for a student,  
**so that** I can control the distribution of musical instruments.

**Acceptance Criteria:**

- The loan must be associated with a student.
- The instrument model must have available units.
- The instrument must belong to an active category.
- The student must not have another unreturned instrument.
- The system must record the loan date.
- The due date must be set to 21 days after loan registration.
- The operation must update available units.
- The operation must preserve the original instrument information.
- The system must reject a loan when the student has an overdue, unreturned loan.

### HU-05. Return Registration

**As a** monitor,  
**I want to** register the return of an instrument,  
**so that** I can update its availability and preserve transaction history.

**Acceptance Criteria:**

- The system must identify the corresponding loan.
- Two returns must not be registered for the same loan.
- The return must record its date and time in UTC.
- Available units must increase correctly when the return is registered.
- Available units must never exceed total units.
- The return must be preserved as a historical record.
- The original loan information must remain unchanged.
- The system must identify a loan as returned through the associated record in the `returns` table, without modifying the original loan information.

### HU-06. Overdue Loan Control

**As a** monitor,  
**I want to** identify overdue loans,  
**so that** I can prevent new loans to students who have unreturned instruments past their due dates.

**Acceptance Criteria:**

- The system must calculate the due date from the loan registration date.
- Each loan must have a 21-day period.
- Loans must be considered overdue when their due dates have passed and no return has been registered.
- The system must allow overdue and unreturned loans to be viewed.
- Students with overdue and unreturned loans must not receive new instruments.
- The restriction must remain until the corresponding return is registered.
- Dates and times used to determine overdue status must be handled in UTC.

### HU-07. Inventory Control

**As a** monitor,  
**I want to** view and maintain available instrument quantities,  
**so that** I can prevent inventory inconsistencies.

**Acceptance Criteria:**

- Available units must never be less than zero.
- Available units must never exceed total units.
- Each loan must decrease available units by one.
- Each return must increase available units by one.
- The system must not allow loans when no units are available.
- Operations that modify inventory must maintain data integrity.
- When simultaneous operations attempt to lend the last available unit, only one may succeed, and the other must receive HTTP `409 Conflict`.

### HU-08. Historical Record Preservation

**As a** monitor,  
**I want to** preserve loan and return records,  
**so that** I can review completed transactions without losing historical information.

**Acceptance Criteria:**

- Loan records must not be physically deleted.
- Return records must not be physically deleted.
- Snapshot data for each operation must preserve the original instrument and student information.
- Subsequent catalog changes must not modify historical loan and return information.
- Instruments removed from the catalog must be managed through logical deactivation.
- Deactivated instruments must not be available for new loans.
- Logical deactivation must not delete or modify associated historical records.

### HU-09. Most Requested Instruments Report

**As a** monitor,  
**I want to** view a report of the most requested instruments,  
**so that** I can identify which instruments have the highest demand.

**Acceptance Criteria:**

- The report must use historical information from registered loans.
- The system must calculate the request frequency of each instrument model.
- Results must be ordered from the most requested to the least requested.
- Each result must identify the instrument and the number of registered loans.
- Results must correspond to transactions registered in the system.
- The report must include historical loans even when an instrument has been removed from the catalog.
- Viewing the report must not modify or delete historical data.

### HU-10. Loan Concurrency Control

**As a** monitor,  
**I want** the system to control simultaneous loan operations,  
**so that** the same available unit cannot be lent to two students.

**Acceptance Criteria:**

- The system must control simultaneous operations that modify available units.
- If two operators attempt to register a loan when only one unit remains available, only one operation may succeed.
- The operation that fails to reserve the last available unit must receive HTTP `409 Conflict`.
- The system must prevent available units from becoming negative.
- Inventory must remain consistent after both requests have completed.
- The successful operation must register the loan and update available units.
- The rejected operation must not create a loan or modify available units.

## 5. Business Rules

The following six business rules define the conditions established for the Music School domain.

### RN-01. Loan Limit per Student

Each student may have a maximum of one unreturned instrument.

A new loan must not be registered while another instrument remains unreturned.

### RN-02. Loan Period and Overdue Status

Each loan shall have a 21-day period calculated from its registration date.

Students with overdue and unreturned loans must not receive new instruments until the corresponding return has been registered.

### RN-03. Inventory Availability and Integrity

Available units for each instrument must always remain within the following range:

**0 ≤ available units ≤ total units**

Loans shall decrease available units, while returns shall increase them.

### RN-04. Historical Preservation and Logical Deactivation

Loan and return records must not be physically deleted.

Snapshot data stored for each operation must preserve the original instrument and student information at the time of the transaction.

Subsequent catalog changes must not modify historical loan and return information.

Instruments removed from the catalog must be managed through logical deactivation without deleting associated historical records.

Logical deactivation also applies to instrument categories as a scope extension.

A category cannot be deactivated while any associated instrument has a pending loan.

Inactive categories cannot be used for new instrument loans and can be reactivated without deleting their records.

### RN-05. Concurrency Control

When two operators simultaneously attempt to lend the last available unit of an instrument, only one operation may succeed.

The operation that fails due to insufficient availability must return HTTP `409 Conflict`.

### RN-06. Date Management and User Communication

Operation dates and times must be stored and processed in UTC.

Messages and text displayed to users must be written in Spanish.

## 6. Functional Requirements

The following functional requirements describe the operations supported by the Music School system. Each requirement is associated with a user story and must comply with the established business rules.

| Code | Functional Requirement | Related User Story |
|---|---|---|
| RF-01 | Register instrument models with a unique code, category, total units, and available units. Support logical category activation and deactivation as a scope extension, subject to pending loan restrictions. | HU-01 |
| RF-02 | View the catalog of active instruments, including their categories and available units. | HU-02 |
| RF-03 | Register and view student information. | HU-03 |
| RF-04 | Register loans associated with students and instruments, validating availability, active category status, pending loan limits, and the 21-day period. | HU-04 |
| RF-05 | Register loan returns, update availability, and preserve transaction history. | HU-05 |
| RF-06 | Identify and view overdue loans that remain unreturned. | HU-06 |
| RF-07 | View and control the total and available units of each instrument model while maintaining inventory integrity. | HU-07 |
| RF-08 | View and preserve loan and return history while maintaining the original information for each operation. | HU-08 |
| RF-09 | Generate a report of the most requested instrument models, ordered by the number of registered loans. | HU-09 |
| RF-10 | Control simultaneous loan requests, preventing inventory inconsistencies and returning HTTP `409 Conflict` when no units are available. | HU-10 |

## 7. Non-Functional Requirements

The following requirements establish quality, security, integrity, maintainability, deployment, and verifiability conditions for the Music School system.

### RNF-01. Security

The system must validate operations in the backend to prevent unauthorized modifications or inconsistent data.

Credentials and secrets must be managed through environment variables. Passwords, when applicable, must be stored using secure hashing mechanisms.

**Verification:**

- Confirm that operation validations are executed in Laravel.
- Verify that secrets are not hardcoded in the source code.
- Confirm that passwords are not stored in plain text.
- Confirm that operations rejected by validation do not modify stored data.

### RNF-02. Data Integrity

The database must maintain referential integrity and the constraints defined for inventory and loans.

Operations that modify available units must execute consistently, including when simultaneous requests occur.

**Verification:**

- Confirm that available units never fall below zero.
- Confirm that available units never exceed total units.
- Verify that loans and returns update inventory correctly.
- Execute concurrency tests to confirm that only one operation can lend the last available unit.
- Verify that an operation rejected due to insufficient availability does not create a loan or modify inventory.

### RNF-03. Maintainability

The code must maintain a separation of responsibilities between the frontend, backend, and persistence layers.

Identifiers for classes, methods, variables, and other code elements must be written in English. User-facing messages must be written in Spanish.

**Verification:**

- Review source code organization.
- Confirm the separation of responsibilities between React and Laravel.
- Review class, method, variable, and table names.
- Verify that user-facing messages are written in Spanish.

### RNF-04. Portability and Deployment

Project services must be executable using Docker containers.

The infrastructure must allow the required services to be started with a single command.

**Verification:**

- Run the project from a clean configuration.
- Confirm that containers start correctly.
- Verify the connection between the backend and the database.
- Confirm that deployment can be performed with a single command.

### RNF-05. Verifiability

The project must include automated tests to verify the features and business rules defined in this specification.

The deliverable must contain at least 15 automated test files.

**Verification:**

- Check that the test files exist.
- Execute the automated tests.
- Confirm that tests validate expected behavior and error scenarios.
- Verify that at least 15 automated test files exist.
- Confirm that tests cover all ten user stories and six business rules.

## 8. System Constraints

1. The frontend must be developed using React.
2. The backend must be developed using PHP and Laravel.
3. Data persistence must use MySQL.
4. Communication between the frontend and backend must use a REST API.
5. Data exchanged through the API must use JSON.
6. The system must run using Docker containers.
7. Code identifiers must be written in English.
8. User-facing messages must be written in Spanish.
9. Dates and times must be handled in UTC.
10. Features outside the specification must not be developed.

## 9. General Acceptance Criteria

The Music School system shall be considered functionally acceptable when the following conditions have been verified:

- Instrument models can be registered and viewed with their respective codes, categories, and units.
- The five initial categories are available: strings, wind instruments, percussion, keyboards, and electronic instruments.
- Students can be registered and viewed.
- Loans can be registered for existing students and instruments.
- Returns can be registered and available units are updated correctly.
- The maximum limit of one unreturned instrument per student is enforced.
- A 21-day period is established for each loan.
- Overdue loans are identified, and new loans are blocked for students with overdue and unreturned instruments.
- Available units always remain between zero and total units.
- Loan and return history is preserved without physical deletion or modification of snapshot data.
- Instruments removed from the catalog use logical deactivation.
- Categories can be logically activated and deactivated without deleting their records.
- Categories with pending instrument loans cannot be deactivated.
- Instruments belonging to inactive categories cannot be borrowed.
- A report of the most requested instrument models is generated, ordered by the number of registered loans.
- Concurrency is controlled when two operators attempt to lend the last available unit: one operation succeeds and the other receives HTTP `409 Conflict`.
- Operation dates and times are stored and processed in UTC.
- User-facing messages and text are displayed in Spanish.
- The project can run using Docker containers with a single command.
- At least 15 automated test files are available to verify the ten user stories and six business rules.

## 10. Requirements Traceability

The following matrix links user stories to their functional requirements, business rules, and applicable non-functional requirements. It also identifies cross-cutting requirements that affect system development and validation.

| User Story | Functional Requirement | Business Rules | Non-Functional Requirements |
|---|---|---|---|
| HU-01 | RF-01 | RN-03, RN-04 | RNF-01, RNF-02 |
| HU-02 | RF-02 | RN-04 | RNF-01 |
| HU-03 | RF-03 | None directly | RNF-01 |
| HU-04 | RF-04 | RN-01, RN-02, RN-03, RN-04, RN-05, RN-06 | RNF-01, RNF-02 |
| HU-05 | RF-05 | RN-03, RN-04, RN-06 | RNF-01, RNF-02 |
| HU-06 | RF-06 | RN-02, RN-06 | RNF-01, RNF-02 |
| HU-07 | RF-07 | RN-03, RN-05 | RNF-01, RNF-02 |
| HU-08 | RF-08 | RN-04 | RNF-01, RNF-02 |
| HU-09 | RF-09 | RN-04 | RNF-01, RNF-02 |
| HU-10 | RF-10 | RN-03, RN-05 | RNF-01, RNF-02 |

### 10.1 Cross-Cutting Requirements

The following non-functional requirements apply to the project as a whole and are not limited to a specific user story.

| Requirement | Related User Stories and Scope |
|---|---|
| RNF-03. Maintainability | All user stories and system components. |
| RNF-04. Portability and Deployment | Entire project: frontend, backend, and database. |
| RNF-05. Verifiability | All ten user stories and six business rules. |

## 11. Relationship with Other Documents

This specification serves as a reference for creating the following project artifacts. All documents must remain consistent with the functional requirements, business rules, non-functional requirements, and constraints established here.

| Document | Relationship |
|---|---|
| constitution.md | Establishes the project's general principles, guidelines, and constraints. |
| plan.md | Defines the planning and organization of development activities. |
| architecture.md | Describes the technical architecture and distribution of system responsibilities. |
| data-model.md | Defines the data model, entities, attributes, and relationships. |
| api-contract.md | Specifies API endpoints, HTTP methods, JSON structures, and responses. |
| tasks.md | Breaks down implementation work into the 23 established tasks. |
| adr/ | Contains at least three architectural decision records and their justifications. |

All artifacts must respect the scope defined in this specification and maintain traceability between user stories, functional requirements, business rules, and non-functional requirements.

Features not included in this specification must not be introduced.

## 12. Change Log

| Version | Date | Description | Status |
|---|---|---|---|
| 1.0 | 07/11/2026 | Initial creation of the Music School requirements specification. | Draft |
| 1.1 | 07/11/2026 | Adjustments to the acceptance criteria of user stories HU-02 and HU-05 to improve consistency with the data model. | Draft for Validation |
| 1.2 | 24/11/2026 | Document category activation and deactivation as a scope extension aligned with the current implementation. | Under Review |
| 1.3 | 25/11/2026 | Unified the current document status with the existing review state and retained the category lifecycle scope extension as under review. | Under Review |
