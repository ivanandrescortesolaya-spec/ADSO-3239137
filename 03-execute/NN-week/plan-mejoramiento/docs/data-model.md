
# Data Model — Music School

**Identifier:** music-school  
**Project:** Musical Instrument Loan Management System  
**Training Group:** ADSO 3239137  
**Apprentice Code:** A12  
**Version:** 1.2
**Status:** Draft for Validation

---

## 1. Purpose

This document defines the logical database structure of the Music School system, including its entities, attributes, data types, primary keys, foreign keys, constraints, and indexes.

The data model will serve as a reference for implementing data persistence using MySQL and Laravel.

Its design must ensure information integrity, inventory control, preservation of transaction history, and consistency of loans and returns.

## 2. Persistence Technology

| Element | Technology |
|---|---|
| Database Engine | MySQL 8 |
| Persistence Backend | PHP with Laravel |
| Identifiers | English |
| Dates and Times | UTC |
| Referential Integrity | Foreign Keys |
| Operation Control | Database Transactions |

## 3. Main Entities

The model includes the following entities:

- `categories`: Stores instrument categories.
- `instruments`: Stores instrument models and their quantities.
- `students`: Stores student information.
- `loans`: Records completed loans and preserves historical data.
- `returns`: Records returns associated with loans.

## 4. Entity Definitions

### 4.1. `categories` Table

Stores musical instrument categories.

| Field | Data Type | Constraint | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Category identifier. |
| code | VARCHAR(20) | UNIQUE, NOT NULL | Category code. |
| name | VARCHAR(100) | NOT NULL | Category name. |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Category status for logical activation and deactivation. |
| created_at | TIMESTAMP | NULLABLE | Creation date in UTC. |
| updated_at | TIMESTAMP | NULLABLE | Last update date in UTC. |

Constraints:

- Categories must be active by default.
- Category codes must be unique.
- Categories must support logical activation and deactivation using the `is_active` field.
- Categories with instruments associated with pending loans cannot be deactivated.
- Inactive categories cannot be used for new instrument registrations or loans.
- Inactive categories cannot be assigned during instrument updates.
- Categories can be reactivated without creating new records.
- Logical deactivation must preserve existing relationships and historical records.

Initial categories:

| Code | Category |
|---|---|
| CAT-01 | Cuerdas |
| CAT-02 | Vientos |
| CAT-03 | Percusion |
| CAT-04 | Teclados |
| CAT-05 | Electronicos |

### 4.2. `instruments` Table

Stores musical instrument models and their quantities.

| Field | Data Type | Constraint | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Instrument identifier. |
| category_id | BIGINT UNSIGNED | FK, NOT NULL | Associated category. |
| code | VARCHAR(30) | UNIQUE, NOT NULL | Unique model code. |
| name | VARCHAR(150) | NOT NULL | Instrument name. |
| total_units | INT UNSIGNED | NOT NULL | Total number of units. |
| available_units | INT UNSIGNED | NOT NULL | Number of available units. |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Instrument status for logical deactivation. |
| created_at | TIMESTAMP | NULLABLE | Creation date in UTC. |
| updated_at | TIMESTAMP | NULLABLE | Last update date in UTC. |

Constraints:

- `total_units` must be greater than or equal to zero.
- `available_units` must be greater than or equal to zero.
- `available_units` must not exceed `total_units`.
- Inactive instruments cannot be included in new loans.
- Deactivated instruments must preserve their historical records.
- Deactivating an instrument must not physically delete its record.
- Instruments must belong to an active category when registered or updated.
- Instruments belonging to inactive categories cannot be included in new loans.
- Category activation or deactivation must not modify the individual `is_active` status of associated instruments.

### 4.3. `students` Table

Stores student information.

| Field | Data Type | Constraint | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Student identifier. |
| student_code | VARCHAR(30) | UNIQUE, NOT NULL | Student code. |
| full_name | VARCHAR(150) | NOT NULL | Full name. |
| email | VARCHAR(150) | UNIQUE, NOT NULL | Email address. |
| created_at | TIMESTAMP | NULLABLE | Creation date in UTC. |
| updated_at | TIMESTAMP | NULLABLE | Last update date in UTC. |

Constraints:

- Each student must have a unique identifier.
- Student codes must not be duplicated.
- Student information associated with historical loans must be preserved through snapshot data recorded for each operation.

### 4.4. `loans` Table

Stores registered loans and preserves the original student and instrument information at the time of each operation.

| Field | Data Type | Constraint | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Loan identifier. |
| student_id | BIGINT UNSIGNED | FK, NOT NULL | Associated student. |
| instrument_id | BIGINT UNSIGNED | FK, NOT NULL | Associated instrument model. |
| student_code | VARCHAR(30) | NOT NULL | Student code at the time of the loan. |
| student_name | VARCHAR(150) | NOT NULL | Student name at the time of the loan. |
| instrument_code | VARCHAR(30) | NOT NULL | Instrument code at the time of the loan. |
| instrument_name | VARCHAR(150) | NOT NULL | Instrument name at the time of the loan. |
| loaned_at | DATETIME | NOT NULL | Loan date and time in UTC. |
| due_at | DATETIME | NOT NULL | Due date and time in UTC. |
| created_at | TIMESTAMP | NULLABLE | Record creation date in UTC. |
| updated_at | TIMESTAMP | NULLABLE | Last update date in UTC. |

Constraints:

- Each loan must belong to an existing student.
- Each loan must correspond to an existing instrument.
- Each loan represents one unit of an instrument model.
- The due date must be set to 21 days after the loan registration date.
- A student cannot have more than one loan pending return.
- Students with overdue and unreturned loans cannot receive new instruments.
- Snapshot data must preserve the original student and instrument information.
- Loans must not be physically deleted.
- Historical records must not be modified by subsequent changes to the catalog or student information.
- New loans require an active instrument belonging to an active category.

**Loan Status Identification:**

Loan status shall be determined by the existence of a related record in the `returns` table.

- If no associated return exists, the loan remains pending.
- If an associated return exists, the loan is considered returned.
- If no return exists and `due_at` has passed, the loan is considered overdue.

This mechanism avoids maintaining a duplicated status field that could cause inconsistencies with return records.

### 4.5. `returns` Table

Stores instrument returns.

| Field | Data Type | Constraint | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Return identifier. |
| loan_id | BIGINT UNSIGNED | FK, UNIQUE, NOT NULL | Returned loan. |
| returned_at | DATETIME | NOT NULL | Return date and time in UTC. |
| created_at | TIMESTAMP | NULLABLE | Record creation date in UTC. |
| updated_at | TIMESTAMP | NULLABLE | Last update date in UTC. |

Constraints:

- Each return must be associated with an existing loan.
- Each loan may have at most one return.
- Duplicate returns are not allowed.
- Returns must not be physically deleted.
- A return must increase the available units of the corresponding instrument.
- Available units must never exceed total units.
- The return must preserve the historical information of its associated loan.

## 5. Relationships Between Entities

| Main Entity | Relationship | Related Entity |
|---|---|---|
| categories | 1:N | instruments |
| instruments | 1:N | loans |
| students | 1:N | loans |
| loans | 1:0..1 | returns |

Relationship descriptions:

- A category may contain multiple instrument models.
- An instrument may be associated with multiple historical loans.
- A student may have multiple loans over time while respecting the limit of one pending loan.
- A loan may have zero or one registered return.

## 6. Integrity Rules

1. Foreign keys must ensure referential integrity.
2. Available units must remain between zero and total units.
3. A student cannot have more than one loan pending return.
4. A student with an overdue and unreturned loan cannot receive another instrument.
5. Each loan must have a 21-day period.
6. A return must be associated with an existing loan.
7. A loan cannot have more than one return.
8. Loans and returns must be preserved as historical records.
9. Snapshot data must preserve the original information of each operation.
10. Instruments removed from the catalog must use logical deactivation.
11. Simultaneous operations must protect inventory availability.
12. Dates and times must be stored and processed in UTC.
13. Categories must support logical activation and deactivation.
14. Categories with instruments associated with pending loans cannot be deactivated.
15. Instruments belonging to inactive categories cannot be included in new loans.
16. Category activation and deactivation must preserve existing relationships and historical records.

## 7. Implemented Indexes

| Table | Index | Purpose |
|---|---|---|
| categories | UNIQUE(code) | Retrieve categories by code. |
| instruments | UNIQUE(code) | Identify instrument models. |
| instruments | category_id, is_active | Retrieve instruments by category and active status. |
| students | UNIQUE(student_code) | Search students by code. |
| students | UNIQUE(email) | Prevent duplicate email addresses. |
| loans | student_id, due_at | Retrieve student loans and support overdue validations. |
| loans | instrument_id, loaned_at | Retrieve historical instrument loans. |
| returns | UNIQUE(loan_id) | Prevent duplicate returns. |

Primary keys, UNIQUE constraints, and foreign keys also generate or require indexes according to MySQL rules.

## 8. Implementation Considerations

### 8.1. Loan Control

Loan registration must be executed within a database transaction.

The following steps must be performed within the transaction:

1. Verify that the student exists.
2. Lock the student row during loan validation to prevent two simultaneous requests from registering pending loans for the same student.
3. Verify that the student has no other pending loan.
4. Verify that the student has no overdue and unreturned loans.
5. Lock the row of the instrument to be lent.
6. Verify that the instrument is active and belongs to an active category.
7. Verify that available units exist.
8. Register the loan and its snapshot data.
9. Decrease available units by one.
10. Commit the transaction.

Pending loan validation must be performed within the same transaction that registers the new loan.

To accomplish this, Laravel must lock the student row using pessimistic locking (`lockForUpdate()`), check whether the student has a loan without a registered return, and, if none exists, register the new loan and update inventory.

The lock must remain active until the transaction ends through a commit or rollback.

This prevents two simultaneous requests from creating pending loans for the same student.

### 8.2. Return Control

Returns must be executed within a database transaction.

The following steps must be performed within the transaction:

1. Identify the loan.
2. Lock the loan row during the return operation.
3. Verify that no return has already been registered.
4. Register the return.
5. Increase the available units of the instrument associated with the loan by one.
6. Verify that available units do not exceed total units.
7. Commit the transaction.

### 8.3. Concurrency Control

To prevent two operators from simultaneously lending the last available unit of an instrument:

- Database transactions must be used.
- The instrument row must be locked during the loan operation.
- Availability must be verified within the transaction.
- Updating available units and registering the loan must occur within the same transaction.
- If another operator has already registered the loan for the last available unit, the operation must be rejected.
- The rejected operation must return HTTP `409 Conflict`.
- When an operation is rejected, no loan must be created and available units must remain unchanged.
- If an error occurs during the operation, a `ROLLBACK` must be executed to prevent partial changes.
- If the operation completes successfully, a `COMMIT` must be executed.

### 8.4. Referential Integrity and Record Deletion

To ensure information integrity and preserve loan history:

- Relationships between tables must be implemented using foreign keys.
- Physical deletion of students with registered loans must not be allowed.
- Physical deletion of instruments with associated loans must not be allowed.
- Foreign keys must use the `ON DELETE RESTRICT` constraint when appropriate.
- Instruments must be removed from the catalog through logical deactivation using the `is_active` field.
- Loans and returns must be permanently preserved to maintain transaction traceability.
- Categories must support logical activation and deactivation using the `is_active` field.
- Categories with associated pending instrument loans cannot be deactivated.
- Category deactivation must preserve existing instruments, relationships, and historical loan records.
- Reactivating a category must not create duplicate records or modify the individual active status of its instruments.

### 8.5. Inventory Integrity Constraints

The database must ensure that the quantities recorded for each instrument maintain inventory consistency.

The following constraints must be applied:

- `total_units` must be greater than or equal to zero.
- `available_units` must be greater than or equal to zero.
- `available_units` must not exceed `total_units`.
- Available units must decrease when a loan is successfully registered.
- Available units must increase when a return is successfully registered.
- Operations that modify quantities must be executed within transactions.
- Constraints must be validated in both Laravel and the database.

In MySQL 8, `CHECK` constraints must be used to reinforce inventory conditions:

```sql
ALTER TABLE instruments
ADD CONSTRAINT chk_instruments_inventory
CHECK (available_units <= total_units);
```

The `total_units` and `available_units` columns use unsigned integers to prevent negative values.

The `chk_instruments_inventory` constraint is added through a dedicated Laravel migration using an `ALTER TABLE` statement.

These database constraints reinforce inventory integrity and complement backend validations.

## 9. Data Model Acceptance Criteria

The data model shall be considered acceptable when it meets the following conditions:

1. The five main entities exist: `categories`, `instruments`, `students`, `loans`, and `returns`.
2. Relationships between entities are defined using primary and foreign keys.
3. The initial categories correspond to the five categories established for the project.
4. Available units remain between zero and total units.
5. Loans preserve historical student and instrument data.
6. Each loan has a 21-day period.
7. Each loan may have at most one registered return.
8. Loans and returns preserve their historical information.
9. Instruments removed from the catalog are managed through logical deactivation.
10. Loan and return operations use transactions to maintain inventory integrity.
11. Concurrency control prevents the last available unit from being lent to two operators and returns HTTP `409 Conflict` when applicable.
12. Dates and times are stored and processed in UTC.
13. Defined indexes and constraints maintain consistency and facilitate system queries.
14. Categories support logical activation and deactivation through the `is_active` field.
15. Categories with pending instrument loans cannot be deactivated.
16. Instruments belonging to inactive categories cannot be included in new loans.
17. Category activation and deactivation preserve existing relationships and historical records.

## 10. Change Log

| Version | Date | Description |
|---|---|---|
| 1.0 | 07/11/2026 | Initial creation of the data model, including entity, attribute, and relationship definitions. |
| 1.1 | 07/11/2026 | Added implementation considerations, referential integrity, concurrency control, inventory constraints, and acceptance criteria. |
| 1.2 | 24/11/2026 | Documented logical category activation and deactivation, aligned historical field names, data types, indexes, and inventory constraints with Laravel migrations. |

**Current Status:** Draft for Validation.
