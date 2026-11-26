
# Development Plan — Music School

**Identifier:** music-school  
**Project:** Musical Instrument Loan Management System  
**Training Group:** ADSO 3239137  
**Apprentice Code:** A12  
**Version:** 1.2
**Status:** Draft for Validation

---

## 1. Purpose

This document establishes the development plan for the Music School project, a system designed to manage musical instrument loans and returns.

The plan organizes work activities into phases, defines their objectives, deliverables, and dependencies, and establishes an execution sequence that allows the system to be developed according to the functional requirements, business rules, and non-functional requirements defined in `spec.md`.

## 2. General Objective

Organize and control the activities required to design, implement, test, and deploy Music School, ensuring compliance with the requirements established in the project specification.

## 3. Specific Objectives

- Organize development activities into work phases.
- Establish the deliverables corresponding to each phase.
- Define dependencies between documentation artifacts and system components.
- Ensure traceability between requirements, design, implementation, and testing.
- Plan the integration of the frontend, backend, and database.
- Establish validation and deployment activities using Docker.

## 4. Planning Scope

The plan includes the following activities:

- Preparation and validation of technical documentation.
- Design of the system architecture.
- Definition of the API contract.
- Design and implementation of the data model.
- Backend development using PHP and Laravel.
- Frontend development using React.
- Infrastructure implementation using Docker.
- Creation of a static public website to present the product.
- Implementation of a data seeding mechanism through the API.
- Preparation and execution of automated tests.
- Validation of functional and non-functional requirements.

Development must comply with the ten user stories, six business rules, and five non-functional requirements established in `spec.md`.

The project also includes deliverables and support components documented in this plan and `tasks.md`: the static public website, API-based data initialization tool, Docker Compose environment, automated tests, and database backup utility. These components support delivery, verification, or maintenance and do not automatically create additional domain requirements. Dashboard indicators and local administrative searches and filters are presentation mechanisms. Category activation/deactivation remains a scope extension under review.

## 5. Development Phases

### Phase 1. Organization and Specification

**Objective:** Establish the guidelines, requirements, and constraints that will guide development.

**Activities:**

- Define the general principles of the project.
- Identify the system actors.
- Document the ten user stories.
- Define functional and non-functional requirements.
- Document the six business rules.
- Establish acceptance criteria.
- Prepare the traceability matrix.

**Deliverables:**

- `constitution.md`
- `spec.md`

### Phase 2. Planning and Solution Design

**Objective:** Define how the system will be organized and technically developed.

**Activities:**

- Organize development activities.
- Define the overall architecture.
- Establish the separation of responsibilities between the frontend, backend, and persistence layer.
- Document architectural decisions.
- Define the communication structure between components.

**Deliverables:**

- Validated development plan.
- `architecture.md`
- `adr/` directory containing at least three architectural decision records.

### Phase 3. Data Model and API Contract Design

**Objective:** Establish the persistence structure and communication rules between system components.

**Activities:**

- Elaborate the conceptual data model documented in `data-model.md` version 1.4, identifying the five domain entities: Category, Instrument, Student, Loan, and Return.
- Define and document the relationships between those entities, including minimum and maximum cardinalities, and provide the conceptual entity-relationship diagram.
- Map the conceptual model to the logical model and to the physical MySQL schema implemented through Laravel migrations.
- Identify entities and their attributes.
- Define primary and foreign keys.
- Establish relationships between entities.
- Define integrity constraints.
- Establish MySQL as the project's database management system.
- Define the correspondence between the data model and Laravel migrations.
- Document loan and return management.
- Define endpoints and HTTP methods.
- Specify JSON request and response structures.
- Document HTTP response codes.

**Deliverables:**

- `data-model.md` version 1.4, including the conceptual model, entities, relationships, cardinalities, and conceptual-to-logical-to-physical correspondence.
- `api-contract.md`

### Phase 4. Task Organization and Implementation

**Objective:** Develop the functional components of the system according to the requirements and approved design.

**Activities:**

- Break down the work into the 23 established tasks.
- Implement the backend structure using Laravel.
- Implement the frontend structure using React.
- Configure the database connection.
- Implement instrument and student management.
- Implement loan and return registration.
- Implement overdue loan control.
- Implement inventory management and historical records.
- Implement the most requested instruments report.
- Implement concurrency control.
- Build the static public website.
- Implement data seeding through the API.
- Implement the documented management views for instruments and students, including their existing update operations.
- Provide local searches and filters as React presentation mechanisms rather than independent business rules.
- Present the most requested instruments report and existing inventory and loan indicators through the Dashboard.

**Deliverables:**

- `tasks.md`
- Source code for the system components.
- React presentation components and views.

### Phase 5. Infrastructure and Integration

**Objective:** Integrate the components and prepare the project execution environment.

**Activities:**

- Configure services using Docker.
- Configure the database.
- Configure the backend and frontend.
- Establish communication between containers.
- Configure environment variables.
- Verify that services can be started with a single command.
- Confirm that the system runs from a clean configuration.

**Deliverables:**

- Infrastructure configuration in `infra/`.
- Integrated and executable application.
- `infra/backup.ps1` as a technical maintenance utility; it creates a SQL export and does not implement restoration.

### Phase 6. Testing and Validation

**Objective:** Verify that the system meets the defined requirements and business rules.

**Activities:**

- Develop automated tests for system features.
- Verify the ten user stories.
- Check the six business rules.
- Validate inventory constraints.
- Verify the loan limit per student.
- Check due date calculations.
- Test return registration.
- Execute concurrency tests.
- Verify expected HTTP responses.
- Verify UTC date and time handling.
- Confirm that user-facing messages are written in Spanish.
- Execute the complete automated test suite.

**Validation Criteria:**

- Include at least 15 automated test files.
- Verify coverage of the ten user stories and six business rules.
- Validate successful operations and error scenarios.
- Confirm that rejected operations do not cause unintended data modifications.

**Deliverables:**

- Automated test files.
- Test execution and validation results.

### Phase 7. Delivery Preparation

**Objective:** Organize and verify the final project artifacts for submission and technical presentation.

**Activities:**

- Review the repository structure.
- Verify technical documentation.
- Check Docker configuration.
- Verify system functionality.
- Review README files.
- Confirm that secrets and unnecessary dependencies are not included.
- Organize deliverables in the required directories.
- Prepare the technical explanation of the implemented decisions.

**Deliverables:**

- Project organized in the repository.
- Technical documentation.
- Executable application.
- Automated tests.
- Materials required for the technical presentation.

## 6. Dependencies Between Phases

Development shall follow a sequence of dependencies to prevent inconsistencies between requirements, design, and implementation.

| Phase | Depends On |
|---|---|
| Phase 1. Specification | Initial project guidelines |
| Phase 2. Design | Phase 1 |
| Phase 3. Data Model and API | Phases 1 and 2 |
| Phase 4. Implementation | Phases 1, 2, and 3 |
| Phase 5. Infrastructure | Component design and implementation |
| Phase 6. Testing | Implemented and integrated features |
| Phase 7. Delivery | Validation of previous deliverables |

Activities may be developed iteratively when their dependencies allow it, while maintaining consistency between artifacts.

## 7. Development Schedule and Milestones

Music School development shall be organized through milestones that allow progress to be monitored and deliverable completion to be verified.

| Milestone | Activity | Deliverable or Result |
|---|---|---|
| Milestone 1 | Completion of initial documentation. | `constitution.md` and `spec.md` |
| Milestone 2 | Preparation of the data model. | `data-model.md` |
| Milestone 3 | Definition of planning and architecture. | `plan.md`, `architecture.md`, and ADRs. |
| Milestone 4 | Definition of the communication contract. | `api-contract.md` |
| Milestone 5 | Organization of implementation activities. | `tasks.md` and 23 defined tasks. |
| Milestone 6 | Development and integration of components. | Backend, frontend, public website, and infrastructure. |
| Milestone 7 | Test execution and validation. | At least 15 automated test files. |
| Milestone 8 | Preparation for delivery and technical presentation. | Complete project and organized documentation. |

Specific execution and completion dates for each milestone shall be established according to actual project progress and the official deadlines of the improvement plan.

Progress shall be monitored by reviewing deliverables, task statuses, and change records in the repository.

## 8. General Monitoring Criteria

The following criteria shall be considered when monitoring project progress:

- Each phase must have its corresponding deliverables.
- Activities must remain aligned with the defined requirements.
- Changes must be recorded and documented.
- Components must comply with the established architecture.
- Tests must verify expected behavior.
- Identified errors must be corrected before validation is considered complete.
- Commits must represent real, small, and descriptive changes.

## 9. Risks and Control Measures

| Risk | Control Measure |
|---|---|
| Inconsistencies between documentation and implementation | Maintain traceability and update affected documents. |
| Errors in inventory operations | Implement transactions and integrity constraints. |
| Conflicts caused by simultaneous requests | Apply locking mechanisms and validate availability. |
| Communication problems between services | Verify Docker configuration and connectivity. |
| Insufficient test coverage | Verify the ten user stories and six business rules. |
| Exposure of sensitive information | Manage secrets through environment variables. |

## 10. Deliverable Structure

Project artifacts shall be organized according to the following structure:

```text
plan-mejoramiento/
│
├── docs/
│   ├── constitution.md
│   ├── spec.md
│   ├── plan.md
│   ├── architecture.md
│   ├── data-model.md
│   ├── api-contract.md
│   ├── tasks.md
│   │
│   └── adr/
│       ├── ADR-001.md
│       ├── ADR-002.md
│       └── ADR-003.md
│
├── api/
├── app/
├── page/
├── infra/
├── tool/
│
└── README.md
```

This structure represents the planned organization of deliverables and does not imply that all components have already been implemented.

## 11. Change Log

| Version | Date | Description | Status |
|---|---|---|---|
| 1.0 | 07/11/2026 | Initial creation of the Music School development plan. | Draft for Validation |
| 1.1 | 25/11/2026 | Updated Phase 3 to document the conceptual data model and its entity, relationship, cardinality, and model-correspondence deliverables, referencing data-model.md version 1.3. | Draft for Validation |
| 1.2 | 25/11/2026 | Updated current data-model references to version 1.4 and distinguished domain features, project deliverables, presentation mechanisms, and maintenance support components without changing the planned phases or milestones. | Draft for Validation |
