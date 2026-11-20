
# Task Plan — Music School

**Project Identifier:** music-school  
**Project:** Musical Instrument Loan Management System  
**Training Group:** 3239137  
**Apprentice Identification:** A12  
**Version:** 1.3  
**Status:** Completed  
**Update Date:** 13/11/2026

---

## 1. Purpose

This document establishes the planning of the tasks required to develop the Music School project as part of the improvement plan.

Its purpose is to organize development work, establish dependencies, define acceptance criteria, and facilitate the tracking of progress and results obtained.

Each task will have a unique identifier, a description, an associated component, related requirements, dependencies, acceptance criteria, and corresponding evidence.

## 2. Scope

The plan covers the activities required to build a musical instrument loan management system, including:

- Backend developed with PHP and Laravel.
- Frontend developed with React.
- MySQL database.
- Infrastructure using Docker Compose.
- Static public website.
- Data seeding tool using the API.
- Automated tests.
- Technical and architectural documentation.

The system will support the management of categories, instruments, students, loans, returns, and reports.

## 3. Task Organization

Tasks are organized according to their execution order and dependencies between components. Exactly 23 tasks are established to manage development and verify compliance with the project's requirements.

### TASK-01 — Prepare the Project Structure

- **Description:** Create and organize the initial structure of the Music School project, separating documentation, backend, frontend, public website, infrastructure, and auxiliary tools.
- **Component:** Repository structure.
- **Related Requirements:** Project organization and separation of responsibilities.
- **Dependencies:** None.
- **Acceptance Criteria:**
  1. The folder structure defined for the project exists.
  2. The `docs`, `api`, `app`, `page`, `infra`, and `tool` folders are correctly located.
  3. The improvement plan documentation is located inside `docs`.
  4. Sensitive files such as `.env` and installed dependencies such as `node_modules` are not included.
- **Deliverable or Evidence:** Organized repository folder structure visible in Git.

### TASK-02 — Configure the Development Environment

- **Description:** Prepare the tools and configurations required to develop and run the system components.
- **Component:** Development environment.
- **Related Requirements:** Non-functional requirements for project configuration, execution, and maintainability.
- **Dependencies:** TASK-01.
- **Acceptance Criteria:**
  1. The tools required for the backend, frontend, and database are defined.
  2. Development configurations are documented.
  3. Versions and execution requirements are identified.
  4. Credentials and sensitive information are not exposed.
- **Deliverable or Evidence:** Initial configuration and environment documentation.

### TASK-03 — Implement the Data Model

- **Description:** Create the logical database structure to store categories, instruments, students, loans, and returns.
- **Component:** MySQL database.
- **Related Requirements:** Functional requirements for category, instrument, student, loan, and return management; integrity rules.
- **Dependencies:** TASK-01.
- **Acceptance Criteria:**
  1. The five main entities are defined.
  2. Relationships and foreign keys correspond to the data model.
  3. Integrity constraints are applied.
  4. Loans and returns preserve their historical records.
- **Deliverable or Evidence:** Data model and table structure.

### TASK-04 — Configure Laravel Migrations

- **Description:** Implement the migrations required to create and maintain the database structure through Laravel.
- **Component:** Backend and persistence.
- **Related Requirements:** Data model and data integrity.
- **Dependencies:** TASK-03.
- **Acceptance Criteria:**
  1. Migrations exist for the tables defined in the data model.
  2. Primary and foreign keys are configured.
  3. Required constraints are applied.
  4. Migrations can be executed successfully.
- **Deliverable or Evidence:** Migration files and successful execution.

### TASK-05 — Configure the MySQL Connection

- **Description:** Configure the connection between Laravel and the MySQL database using environment variables and connection parameters.
- **Component:** Backend and database.
- **Related Requirements:** Data persistence and availability.
- **Dependencies:** TASK-02, TASK-04.
- **Acceptance Criteria:**
  1. Laravel establishes a connection to MySQL.
  2. Credentials are managed through environment variables.
  3. Credentials are not published in the repository.
  4. The application can query the database.
- **Deliverable or Evidence:** Connection configuration and MySQL access test.

### TASK-06 — Implement Category Management

- **Description:** Develop the operations required to retrieve and manage musical instrument categories.
- **Component:** Laravel API.
- **Related Requirements:** Category management and initial categories CAT-01 through CAT-05.
- **Dependencies:** TASK-04, TASK-05.
- **Acceptance Criteria:**
  1. Registered categories can be retrieved.
  2. The five initial categories are identified by their codes.
  3. Category codes cannot be duplicated.
  4. API responses use the established JSON format.
- **Deliverable or Evidence:** Category endpoints and corresponding tests.

### TASK-07 — Implement Instrument Management

- **Description:** Develop operations to register, retrieve, update, and logically deactivate musical instruments.
- **Component:** Laravel API.
- **Related Requirements:** Catalog management, availability, and logical deactivation of instruments.
- **Dependencies:** TASK-04, TASK-05, TASK-06.
- **Acceptance Criteria:**
  1. Instruments associated with a category can be registered.
  2. Registered instruments can be retrieved.
  3. Permitted data can be updated.
  4. Instrument deactivation is performed logically.
  5. Deactivated instruments cannot be lent.
  6. Available units cannot be negative or exceed the total number of units.
- **Deliverable or Evidence:** Instrument endpoints and corresponding tests.

### TASK-08 — Implement Available Unit Control

- **Description:** Develop the logic that maintains instrument availability according to the total number of units and active loans.
- **Component:** Backend business logic.
- **Related Requirements:** Inventory control and unit integrity rules.
- **Dependencies:** TASK-07.
- **Acceptance Criteria:**
  1. Available quantities remain within the permitted range.
  2. When the total number of units is modified, currently lent units are considered.
  3. The backend calculates availability and does not depend on a value submitted by the client.
  4. The total number of units cannot be reduced below the number of units currently lent.
- **Deliverable or Evidence:** Inventory control service and automated tests.

### TASK-09 — Implement Student Management

- **Description:** Develop operations to register, retrieve, and update information about students who use the system.
- **Component:** Laravel API.
- **Related Requirements:** Student management.
- **Dependencies:** TASK-04, TASK-05.
- **Acceptance Criteria:**
  1. Students can be registered.
  2. Registered students can be retrieved.
  3. Permitted data can be updated.
  4. Required field validations are applied.
  5. Duplicate values are prevented for the defined identifiers.
- **Deliverable or Evidence:** Student endpoints and corresponding tests.

### TASK-10 — Implement Loan Registration

- **Description:** Develop the operation required to register instrument loans associated with students.
- **Component:** Laravel API and business logic.
- **Related Requirements:** Loan management, availability, and the 21-day loan period.
- **Dependencies:** TASK-07, TASK-08, TASK-09.
- **Acceptance Criteria:**
  1. A loan can be registered for a student and an instrument.
  2. The system verifies that the instrument is active and has available units.
  3. The system verifies that the student does not have another instrument pending return.
  4. The due date is calculated using a 21-day period.
  5. Historical operation data is preserved.
- **Deliverable or Evidence:** Loan creation endpoint and automated tests.

### TASK-11 — Implement Loan Queries

- **Description:** Develop operations to retrieve registered loans, their details, and loans associated with each student.
- **Component:** Laravel API.
- **Related Requirements:** Loan retrieval and tracking.
- **Dependencies:** TASK-10.
- **Acceptance Criteria:**
  1. Registered loans can be retrieved.
  2. The details of a loan can be retrieved.
  3. A student's loans can be retrieved.
  4. Historical information about operations is preserved.
  5. Loan status is determined by the existence of a return and the due date.
- **Deliverable or Evidence:** Loan query endpoints and corresponding tests.

### TASK-12 — Implement Overdue Loan Control

- **Description:** Develop the logic required to identify loans whose due dates have passed and for which no return has been registered.
- **Component:** Backend business logic.
- **Related Requirements:** Overdue loan control and restrictions on new loans.
- **Dependencies:** TASK-10, TASK-11.
- **Acceptance Criteria:**
  1. Loans that have exceeded their due dates are identified.
  2. Returned loans are not considered overdue.
  3. A student with an overdue loan cannot register another loan.
  4. Date comparisons use UTC.
- **Deliverable or Evidence:** Overdue loan query and automated tests.

### TASK-13 — Implement Return Registration

- **Description:** Develop the operation required to register the return of a borrowed instrument and update its availability.
- **Component:** Laravel API and business logic.
- **Related Requirements:** Return management, historical records, and inventory control.
- **Dependencies:** TASK-08, TASK-10.
- **Acceptance Criteria:**
  1. A return can be registered for an existing loan.
  2. Two returns cannot be registered for the same loan.
  3. Availability is increased correctly.
  4. Return registration and the inventory update are executed within the same transaction.
  5. The return history is preserved.
- **Deliverable or Evidence:** Return endpoint and automated tests.

### TASK-14 — Implement Transactions and Concurrency Control

- **Description:** Ensure operation integrity when multiple operators attempt to lend or return instruments simultaneously.
- **Component:** Backend and database.
- **Related Requirements:** Concurrency, inventory integrity, and HTTP 409 responses.
- **Dependencies:** TASK-10, TASK-13.
- **Acceptance Criteria:**
  1. Critical operations use transactions.
  2. Row-level locks are applied when necessary.
  3. Availability is checked again after acquiring the lock.
  4. When two operators attempt to lend the last available unit, only one completes the operation.
  5. The operation that cannot be completed receives HTTP 409.
  6. Errors cause the corresponding transaction to be rolled back.

  **Status:** Under Review.

**Recorded Evidence:**

- Implementation of transactions in loan and return operations.
- Row-level locking using `lockForUpdate()`.
- Availability revalidation after acquiring the lock.
- Manual test with two independent requests.
- First request: HTTP 201 Created.
- Second request: HTTP 409 Conflict.
- Final instrument availability: 0 units.
- **Deliverable or Evidence:** Transactional implementation and concurrency tests.

### TASK-15 — Implement the Most Requested Instruments Report

- **Description:** Develop a query to identify instruments with the highest number of requests or registered loans.
- **Component:** Laravel API and reporting.
- **Related Requirements:** Most requested instruments report.
- **Dependencies:** TASK-10, TASK-11.
- **Acceptance Criteria:**
  1. Registered loans are counted for each instrument.
  2. Results are sorted from the highest to the lowest number of requests.
  3. The information required to identify each instrument is displayed.
  4. The query uses information persisted in the database.
- **Deliverable or Evidence:** Report endpoint and corresponding tests.

### TASK-16 — Implement API Validation and Error Handling

- **Description:** Standardize input validation and error responses across the system's endpoints.
- **Component:** Laravel API.
- **Related Requirements:** API contract, validation, and error handling.
- **Dependencies:** TASK-06, TASK-07, TASK-09, TASK-10, TASK-13.
- **Acceptance Criteria:**
  1. Required fields and their formats are validated.
  2. HTTP status codes defined in the contract are used.
  3. Validation errors use HTTP 422.
  4. Nonexistent resources use HTTP 404.
  5. Business conflicts use HTTP 409.
  6. User-facing messages are in Spanish.
- **Deliverable or Evidence:** Validations, standardized responses, and error tests.

### TASK-17 — Implement the React Frontend

- **Description:** Create the frontend application that allows operators to interact with the system's features.
- **Component:** React application.
- **Related Requirements:** User interface and API consumption.
- **Dependencies:** TASK-01, TASK-02, TASK-16.
- **Acceptance Criteria:**
  1. The React application starts correctly.
  2. It is organized into components and views.
  3. A connection to the Laravel API is established.
  4. Loading, error, and response states are handled.
  5. The interface displays understandable messages in Spanish.
- **Deliverable or Evidence:** Executable frontend application.

### TASK-18 — Implement Administration Views

- **Description:** Build frontend interfaces to manage categories, instruments, and students.
- **Component:** React application.
- **Related Requirements:** Catalog and student management.
- **Dependencies:** TASK-06, TASK-07, TASK-09, TASK-17.
- **Acceptance Criteria:**
  1. A view exists for retrieving categories.
  2. A view exists for retrieving and managing instruments.
  3. A view exists for retrieving and managing students.
  4. Forms validate data before submission.
  5. Changes are reflected through API responses.
- **Deliverable or Evidence:** Functional administration views.

### TASK-19 — Implement Loan and Return Views

- **Description:** Build interfaces that allow operators to register, retrieve, and manage instrument loans and returns.
- **Component:** React application.
- **Related Requirements:** Loan, return, and overdue loan management.
- **Dependencies:** TASK-10, TASK-11, TASK-12, TASK-13, TASK-17.
- **Acceptance Criteria:**
  1. Loans can be retrieved.
  2. New loans can be registered.
  3. Overdue loans can be retrieved.
  4. Returns can be registered.
  5. Confirmation and error messages are displayed.
- **Deliverable or Evidence:** Functional loan and return views.

### TASK-20 — Implement the Static Public Website

- **Description:** Build the Music School project's static public website to present general information about the system.
- **Component:** Public website.
- **Related Requirements:** Project public website and separation from the administrative frontend.
- **Dependencies:** TASK-01, TASK-02.
- **Acceptance Criteria:**
  1. A public page exists independently of the administrative application.
  2. General information about Music School is presented.
  3. Static resources load correctly.
  4. The website can run using the defined infrastructure.
- **Deliverable or Evidence:** Functional static public website.

### TASK-21 — Implement the API-Based Data Seeding Tool

- **Description:** Create a tool that loads the system's initial data through API endpoints without directly accessing MySQL.
- **Component:** Auxiliary tool.
- **Related Requirements:** Data initialization and categories CAT-01 through CAT-05.
- **Dependencies:** TASK-06, TASK-07, TASK-09, TASK-16.
- **Acceptance Criteria:**
  1. The tool uses the HTTP API.
  2. It does not execute direct SQL queries against MySQL.
  3. It registers the five initial categories.
  4. It prevents duplicate records when executed more than once.
  5. It reports execution results and errors.
- **Deliverable or Evidence:** Data seeding tool and execution evidence.

### TASK-22 — Configure Docker Compose and Integrated Execution

- **Description:** Configure the services required to run the system using Docker Compose, including the database, backend, frontend, and public website.
- **Component:** Infrastructure.
- **Related Requirements:** Local deployment and integrated project execution.
- **Dependencies:** TASK-05, TASK-17, TASK-20.
- **Acceptance Criteria:**
  1. A Docker Compose file exists with the required services.
  2. Services can be started using a single command.
  3. The backend can connect to MySQL within the container environment.
  4. The frontend and public website can be accessed from the local environment.
  5. The configuration does not expose sensitive credentials.
- **Deliverable or Evidence:** Docker Compose configuration and integrated execution test.

### TASK-23 — Execute Tests, Document Results, and Prepare Delivery

- **Description:** Verify system functionality through automated tests, review compliance with requirements, and prepare evidence for delivery and project presentation.
- **Component:** Quality, documentation, and delivery.
- **Related Requirements:** User stories, business rules, functional requirements, non-functional requirements, and API contract.
- **Dependencies:** TASK-01 through TASK-22.
- **Acceptance Criteria:**
  1. Automated tests are executed for the main features.
  2. At least 15 automated test files are available.
  3. Business rules for loans and returns are verified.
  4. Concurrency control and HTTP 409 conflicts are verified.
  5. Consistency between requirements, implementation, and tests is reviewed.
  6. Results and evidence are documented.
  7. The project can be executed for its presentation.
- **Deliverable or Evidence:** Automated tests, results, technical documentation, and delivery evidence.

### 3.1 Task Traceability Matrix

The following matrix links technical tasks to the user stories and functional requirements defined in `spec.md`. Applicable business rules and non-functional requirements are referenced in that document's traceability matrix.

| Task | Related User Story | Related Functional Requirement |
|---|---|---|
| TASK-01 | Cross-cutting | Project organization |
| TASK-02 | Cross-cutting | Environment preparation |
| TASK-03 | HU-01 to HU-08 | RF-01 to RF-08 |
| TASK-04 | HU-01 to HU-08 | RF-01 to RF-08 |
| TASK-05 | Cross-cutting | Data persistence |
| TASK-06 | HU-01 | RF-01 |
| TASK-07 | HU-01, HU-02 | RF-01, RF-02 |
| TASK-08 | HU-01, HU-07 | RF-01, RF-07 |
| TASK-09 | HU-03 | RF-03 |
| TASK-10 | HU-04 | RF-04 |
| TASK-11 | HU-04, HU-06, HU-08 | RF-04, RF-06, RF-08 |
| TASK-12 | HU-04, HU-06 | RF-04, RF-06 |
| TASK-13 | HU-05 | RF-05 |
| TASK-14 | HU-04, HU-07, HU-10 | RF-04, RF-07, RF-10 |
| TASK-15 | HU-09 | RF-09 |
| TASK-16 | HU-01 to HU-10 | RF-01 to RF-10 |
| TASK-17 | Cross-cutting | Interface and API consumption |
| TASK-18 | HU-01, HU-02, HU-03 | RF-01, RF-02, RF-03 |
| TASK-19 | HU-04, HU-05, HU-06, HU-08 | RF-04, RF-05, RF-06, RF-08 |
| TASK-20 | Cross-cutting | Public website |
| TASK-21 | Cross-cutting | API-based data initialization |
| TASK-22 | Cross-cutting | Infrastructure and deployment |
| TASK-23 | HU-01 to HU-10 | RF-01 to RF-10 |

**Traceability Note:** Cross-cutting tasks support the project's structure, infrastructure, interface, data initialization, and overall verification. Business rules RN-01 through RN-06 and non-functional requirements RNF-01 through RNF-05 must be verified according to their relationships defined in `spec.md`. This matrix represents planned coverage and does not constitute evidence of implementation or executed tests.

### 3.2 Execution Order and Technical Dependencies

Tasks will be executed according to their technical and functional dependencies. The following organization establishes a reference sequence; activities may be developed in parallel when their dependencies have been satisfied.

| Stage | Tasks | Description |
|---|---|---|
| 1. Preparation | TASK-01, TASK-02 | Repository organization and environment configuration. |
| 2. Data Design | TASK-03 | Definition of the data model and its relationships. |
| 3. Persistence | TASK-04, TASK-05 | Creation of migrations and configuration of the MySQL connection. TASK-05 requires TASK-04 to be completed. |
| 4. Basic Backend | TASK-06, TASK-07, TASK-09 | Category, instrument, and student management, respecting their dependencies. |
| 5. Inventory Rules | TASK-08 | Control of total and available units after implementing instrument management. |
| 6. Main Operations | TASK-10, TASK-11, TASK-12, TASK-13 | Loan registration and queries, overdue loan control, and returns, respecting dependencies between operations. |
| 7. Integrity and Reporting | TASK-14, TASK-15, TASK-16 | Concurrency control, report generation, validation, and error handling. |
| 8. Interface and Complementary Components | TASK-17, TASK-18, TASK-19, TASK-20, TASK-21 | Development of the React application, its views, the public website, and the API-based data seeding tool. |
| 9. Integration and Delivery | TASK-22, TASK-23 | Integration using Docker Compose, test execution, and delivery preparation. |

**Dependency Considerations**

1. TASK-01 must be completed before organizing the environment and project components.
2. TASK-03 defines the model used as a reference for TASK-04.
3. TASK-05 requires the migrations from TASK-04 and the environment configuration from TASK-02.
4. TASK-06, TASK-07, and TASK-09 can be developed independently once persistence and the MySQL connection are available, respecting each task's specific dependencies.
5. TASK-08 requires TASK-07, while TASK-10 requires instrument management, availability control, and student management.
6. Queries, overdue loan control, and returns depend on loan operations and the components specified in their respective tasks.
7. React views can be developed progressively using the API contract as a reference, but their functional integration requires the corresponding endpoints.
8. The public website and data seeding tool can be developed independently when their respective components and dependencies are available.
9. Docker Compose must integrate the required services and be verified before final validation.
10. TASK-23 depends on the availability of the components that will undergo testing and validation.

**Note:** This sequence represents technical planning. Parallel execution is permitted when individual dependencies are respected. No task will be considered completed without verifying its acceptance criteria and preserving the corresponding evidence.

## 4. Task Registration and Tracking

Tracking will make it possible to monitor the progress of the 23 tasks defined in this document. Each activity must be updated according to its actual status and supported by evidence that allows its completion to be verified.

### 4.1 Task Statuses

The following statuses will be used:

- **Pending:** The task has not started yet.
- **In Progress:** The task is currently being developed.
- **Under Review:** The task is finished and awaiting validation.
- **Completed:** The task meets all its acceptance criteria and has verifiable evidence.
- **Blocked:** The task cannot continue because of an identified dependency or issue.

### 4.2 Tracking Matrix

The following matrix allows the activities of the Music School project to be tracked. Each task's status will be updated as its deliverables are published in the GitHub repository.

**Publication Summary**

| Indicator | Quantity |
|:---|---:|
| Total Tasks | 23 |
| Completed | 23 |
| Pending | 0 |

**Activity Details**

| ID | Activity | Status | Evidence |
|:---|:---|:---:|:---|
| TASK-01 | Project structure preparation | Completed | `docs/` |
| TASK-02 | Environment configuration | Completed | `infra/, api/, app/` |
| TASK-03 | Data model design | Completed | `docs/data-model.md` |
| TASK-04 | Migration creation | Completed | `api/database/migrations/` |
| TASK-05 | MySQL connection | Completed | `infra/docker-compose.yml` |
| TASK-06 | Category API | Completed | `api/tests/Feature/CategoryTest.php` |
| TASK-07 | Instrument API | Completed | `api/tests/Feature/InstrumentTest.php` |
| TASK-08 | Inventory control | Completed | `api/tests/Feature/InstrumentManagementTest.php` |
| TASK-09 | Student API | Completed | `api/tests/Feature/StudentTest.php` |
| TASK-10 | Loan registration | Completed | `api/tests/Feature/LoanTest.php` |
| TASK-11 | Loan queries | Completed | `api/tests/Feature/LoanQueryTest.php, api/tests/Feature/StudentLoanHistoryTest.php` |
| TASK-12 | Overdue loan query | Completed | `api/tests/Feature/OverdueLoanTest.php` |
| TASK-13 | Return registration | Completed | `api/tests/Feature/ReturnEndpointTest.php` |
| TASK-14 | Concurrency control | Completed | `docs/tasks.md, docs/evidence.md` |
| TASK-15 | Most requested instruments report | Completed | `api/tests/Feature/ReportTest.php` |
| TASK-16 | Validation and error handling | Completed | `api/tests/Feature/, docs/api-contract.md` |
| TASK-17 | React frontend development | Completed | `app/` |
| TASK-18 | Administration views | Completed | `app/` |
| TASK-19 | Visual loan and return management | Completed | `app/` |
| TASK-20 | Public website | Completed | `page/, infra/docker-compose.yml` |
| TASK-21 | Data initialization tool | Completed | `tool/, docs/evidence.md` |
| TASK-22 | Docker Compose integration | Completed | `infra/docker-compose.yml` |
| TASK-23 | Testing, documentation, and delivery | Completed | `api/tests/, docs/evidence.md` |

**Responsible:** Apprentice A12.

**Update Criterion:** A task will change to Completed when its corresponding files and deliverables have been published on GitHub and their contents have been verified.

### 4.3 Rules for Updating Task Tracking

1. A task will change status only when actual progress has been made.
2. The start date will correspond to the day its execution begins.
3. The completion date will correspond to the day its acceptance criteria are verified.
4. Evidence must make it possible to identify the task's result.
5. If a task becomes blocked, the reason and the dependency preventing progress must be documented.
6. Status changes must remain consistent with the repository's work history.

### 4.4 Progress Review

Overall progress will be calculated based on the number of completed tasks and the total number of planned tasks.

**Formula:**

Progress Percentage = (Number of Completed Tasks / 23) × 100

A task will only count as completed when it meets its acceptance criteria and has verifiable evidence.

## 5. Compliance Evidence

Evidence may include:

- Source code files.
- Configuration files.
- Migrations and data models.
- API endpoints and responses.
- Execution screenshots.
- Automated test results.
- Repository commits.
- Technical documentation.
- Project execution using Docker Compose.

Evidence must correspond to the completed task and allow its fulfillment to be verified.

## 6. Dependencies and Execution Order

Tasks will be developed according to their technical dependencies. An activity that requires a previous feature that is not yet available should not be started, unless it involves independent work that does not compromise its validation.

The proposed organization allows progress from repository preparation and database development to backend, frontend, infrastructure, testing, and delivery.

## 7. Change Control

| Version | Date | Description |
|---|---|---|
| 1.0 | 08/11/2026 | Initial creation of the task plan with 23 activities and their acceptance criteria. |
| 1.2 | 09/11/2026 | Update of the actual repository structure and logical architecture diagram, including Dashboard, services, and the initialization tool. Under review. |

---

| 1.3 | 13/11/2026 | Completion of the 23 tasks, validation of automated tests, and update of evidence. |

---

**End of Document.**
