
# REST API Contract — Music School

**Identifier:** music-school  
**Project:** Musical Instrument Loan Management System  
**Training Group:** ADSO 3239137  
**Apprentice Code:** A12  
**Version:** 1.1  
**Status:** Draft for Validation

---

## 1. Purpose

This document establishes the communication contract between the frontend developed with React and the backend developed with PHP and Laravel for the Music School system.

It defines the endpoints, HTTP methods, parameters, request structures, responses, status codes, and validations required to ensure consistent communication between system components.

The contract must comply with the requirements established in `spec.md`, the data structures defined in `data-model.md`, and the architectural decisions documented in `architecture.md`.

## 2. Scope

The REST API will support the following operations:

- Retrieve instrument categories.
- Manage instruments.
- Retrieve and manage students.
- Register loans.
- Retrieve loans and historical records.
- Register returns.
- Retrieve overdue loans.
- Check available units.
- Generate the most requested instruments report.
- Initialize test data through API requests.

The API will serve as the communication mechanism between the frontend and backend. The frontend will not have direct access to the database.

### 2.1. Data Seeding Tool

The project will include a data seeding tool located in the `tool/` directory. Its responsibility will be to initialize test data through HTTP requests to REST API endpoints.

The tool must not connect directly to MySQL or execute SQL queries against the database.

The initial data must include the following five categories:

| Code | Category |
|---|---|
| CAT-01 | Cuerdas |
| CAT-02 | Vientos |
| CAT-03 | Percusion |
| CAT-04 | Teclados |
| CAT-05 | Electronicos |

The tool may use API endpoints to register the categories, instruments, and students required for system testing.

The process must comply with backend validations and the integrity constraints defined in `data-model.md`.

Data seeding must avoid creating duplicate records when executed more than once, using the unique codes defined to identify the initial data.

The tool must allow a test dataset to be prepared for validating catalog queries, loans, returns, and reports.

## 3. General Characteristics

| Characteristic | Definition |
|---|---|
| Communication Style | REST API |
| Protocol | HTTP |
| Data Exchange Format | JSON |
| Backend | PHP and Laravel |
| Frontend | React |
| Database | MySQL |
| Encoding | UTF-8 |
| Dates | UTC |
| Message Language | Spanish |
| Code Identifiers | English |

### 3.1. Base URL

During local development, the API will use the following base address:

`http://localhost:8000/api`

**Configuration Note:** Port `8000` is established as a provisional value for the local environment. It must be verified and adjusted according to the port mapping defined in `infra/docker-compose.yml` during infrastructure configuration.

### 3.2. HTTP Headers

Requests that send information in JSON format must use:

```http
Content-Type: application/json
Accept: application/json
```

## 4. Response Conventions

API responses must use consistent JSON structures.

### 4.1. Successful Response

Example:

```json
{
  "mensaje": "Operacion realizada correctamente.",
  "datos": {
    "id": 1
  }
}
```

### 4.2. Error Response

Example:

```json
{
  "mensaje": "No fue posible completar la operacion.",
  "errores": {}
}
```

### 4.3. Validation Response

Example:

```json
{
  "mensaje": "Los datos proporcionados no son validos.",
  "errores": {
    "student_id": [
      "El estudiante seleccionado no existe."
    ]
  }
}
```

## 5. HTTP Status Codes

| Code | Name | Usage |
|---|---|---|
| 200 | OK | Successful query or operation. |
| 201 | Created | Record successfully created. |
| 204 | No Content | Successful operation without response content. |
| 400 | Bad Request | Invalid request. |
| 404 | Not Found | Resource not found. |
| 409 | Conflict | Conflict with business rules or availability. |
| 422 | Unprocessable Entity | Data validation error. |
| 500 | Internal Server Error | Internal server error. |

The backend must use HTTP status codes according to the result of each operation.

## 6. Category Endpoints

### 6.1. Retrieve Categories

| Property | Definition |
|---|---|
| Method | GET |
| Endpoint | `/categories` |
| Description | Retrieve instrument categories. |
| Successful Response | 200 OK |

Example response:

```json
{
  "mensaje": "Categorias consultadas correctamente.",
  "datos": [
    {
      "id": 1,
      "code": "CAT-01",
      "name": "Cuerdas"
    },
    {
      "id": 2,
      "code": "CAT-02",
      "name": "Vientos"
    },
    {
      "id": 3,
      "code": "CAT-03",
      "name": "Percusion"
    },
    {
      "id": 4,
      "code": "CAT-04",
      "name": "Teclados"
    },
    {
      "id": 5,
      "code": "CAT-05",
      "name": "Electronicos"
    }
  ]
}
```

The five initial categories must be available for instrument classification.

### 6.2. Register a Category

**Endpoint:**

```http
POST /categories
```

**Description:**

Allows a new musical instrument category to be registered in the system catalog.

**Request Body:**

```json
{
  "code": "CAT-01",
  "name": "Cuerdas"
}
```

**Validations:**

- `code` is required.
- `code` must have a maximum length of 20 characters.
- `code` must be unique.
- `name` is required.
- `name` must have a maximum length of 100 characters.
- Categories with duplicate codes must not be registered.

**Successful Response:**

HTTP Status: `201 Created`

```json
{
  "mensaje": "Categoria registrada correctamente.",
  "datos": {
    "id": 1,
    "code": "CAT-01",
    "name": "Cuerdas"
  }
}
```

**Error Responses:**

- `409 Conflict`: When the category code already exists.
- `422 Unprocessable Entity`: When the submitted data does not meet validation rules.
- `500 Internal Server Error`: When an unexpected server error occurs.

## 7. Instrument Endpoints

### 7.1. Retrieve Instruments

| Property | Definition |
|---|---|
| Method | GET |
| Endpoint | `/instruments` |
| Description | Retrieve the instrument catalog. |
| Successful Response | 200 OK |

Example response:

```json
{
  "mensaje": "Instrumentos consultados correctamente.",
  "datos": [
    {
      "id": 1,
      "category_id": 1,
      "code": "GTR-001",
      "name": "Guitarra acustica",
      "total_units": 5,
      "available_units": 3,
      "is_active": true
    }
  ]
}
```

### 7.2. Retrieve an Instrument

| Property | Definition |
|---|---|
| Method | GET |
| Endpoint | `/instruments/{id}` |
| Description | Retrieve the details of an instrument. |
| Successful Response | 200 OK |
| Possible Error | 404 Not Found |

### 7.3. Register an Instrument

| Property | Definition |
|---|---|
| Method | POST |
| Endpoint | `/instruments` |
| Description | Register an instrument in the catalog. |
| Successful Response | 201 Created |

Example request:

```json
{
  "category_id": 1,
  "code": "GTR-002",
  "name": "Guitarra electrica",
  "total_units": 4
}
```

Validations:

- The category must exist.
- The code must be unique.
- The name is required.
- Total units must be an integer greater than or equal to zero.
- Initial available units must match the registered total units.

### 7.4. Update an Instrument

| Property | Definition |
|---|---|
| Method | PUT |
| Endpoint | `/instruments/{id}` |
| Description | Update instrument information. |
| Successful Response | 200 OK |

#### Example Request

```json
{
  "category_id": 1,
  "code": "GTR-001",
  "name": "Guitarra acustica profesional",
  "total_units": 6
}
```

#### Validations

- The instrument must exist.
- The specified category must exist.
- The code must be unique, excluding the record being updated.
- The name is required.
- `total_units` must be an integer greater than or equal to zero.
- The new `total_units` value cannot be lower than the number of units currently on loan.
- When `total_units` is updated, the backend must recalculate `available_units` while preserving the number of units on loan. The calculation is: `available_units = new_total_units - loaned_units`.
- The update must be performed within a database transaction to ensure inventory integrity.
- The number of units on loan is calculated as the difference between the current total units and current available units.
- `available_units` must not be modified directly through the client request; it must be updated by backend-managed loan and return operations.
- The system must preserve inventory integrity after any update.
- The update must not modify historical snapshot data stored in previous loans.

#### Successful Response

HTTP Status: `200 OK`.

The update must comply with inventory constraints and preserve the historical information of existing loans.

### 7.5. Deactivate an Instrument

| Property | Definition |
|---|---|
| Method | PATCH |
| Endpoint | `/instruments/{id}/deactivate` |
| Description | Logically deactivate an instrument. |
| Successful Response | 200 OK |

Logical deactivation must change the instrument's active status without physically deleting its record.

Inactive instruments must not appear as available or allow new loans.

## 8. Student Endpoints

### 8.1. Retrieve Students

| Property | Definition |
|---|---|
| Method | GET |
| Endpoint | `/students` |
| Description | Retrieve registered students. |
| Successful Response | 200 OK |

### 8.2. Retrieve a Student

| Property | Definition |
|---|---|
| Method | GET |
| Endpoint | `/students/{id}` |
| Description | Retrieve student information. |
| Successful Response | 200 OK |
| Possible Error | 404 Not Found |

### 8.3. Register a Student

| Property | Definition |
|---|---|
| Method | POST |
| Endpoint | `/students` |
| Description | Register a student. |
| Successful Response | 201 Created |

Example request:

```json
{
  "student_code": "EST-001",
  "full_name": "Estudiante de prueba",
  "email": "estudiante@example.com"
}
```

Validations:

- The student code is required and must be unique.
- The full name is required.
- The email address must have a valid format.

### 8.4. Update a Student

| Property | Definition |
|---|---|
| Method | PUT |
| Endpoint | `/students/{id}` |
| Description | Update student information. |
| Successful Response | 200 OK |

#### Example Request

```json
{
  "student_code": "EST-001",
  "full_name": "Estudiante de prueba actualizado",
  "email": "estudiante.actualizado@example.com"
}
```

#### Validations

- The student must exist.
- The student code is required and must be unique, excluding the record being updated.
- The full name is required.
- The email address must have a valid format.
- The email address must be unique, excluding the record being updated.
- The update must not modify historical snapshot data stored in previous loans.

#### Successful Response

HTTP Status: `200 OK`.

The update must not modify historical snapshot data stored in loan records.

## 9. Loan Endpoints

### 9.1. Retrieve Loans

| Property | Definition |
|---|---|
| Method | GET |
| Endpoint | `/loans` |
| Description | Retrieve registered loans. |
| Successful Response | 200 OK |

Loans must allow their status to be identified through associated return records and the corresponding dates.

### 9.2. Retrieve a Loan

| Property | Definition |
|---|---|
| Method | GET |
| Endpoint | `/loans/{id}` |
| Description | Retrieve loan details. |
| Successful Response | 200 OK |
| Possible Error | 404 Not Found |

### 9.3. Register a Loan

| Property | Definition |
|---|---|
| Method | POST |
| Endpoint | `/loans` |
| Description | Register an instrument loan for a student. |
| Successful Response | 201 Created |
| Possible Conflict | 409 Conflict |
| Validation Error | 422 Unprocessable Entity |

#### Successful Response

When the loan is successfully registered, the backend must return HTTP `201 Created`.

Example response:

```json
{
  "mensaje": "Prestamo registrado correctamente.",
  "datos": {
    "id": 1,
    "student_id": 1,
    "instrument_id": 1,
    "student_code_snapshot": "EST-001",
    "student_name_snapshot": "Estudiante de prueba",
    "instrument_code_snapshot": "GTR-001",
    "instrument_name_snapshot": "Guitarra acustica",
    "loaned_at": "2026-11-08T14:30:00Z",
    "due_at": "2026-11-29T14:30:00Z",
    "created_at": "2026-11-08T14:30:00Z"
  }
}
```

The fields `student_code_snapshot`, `student_name_snapshot`, `instrument_code_snapshot`, and `instrument_name_snapshot` must preserve student and instrument information at the time the loan is registered.

The dates `loaned_at`, `due_at`, and `created_at` must be handled in UTC.

Loan status will not be stored as an independent field. It will be determined by the existence of an associated return in the `returns` table, as established in `data-model.md`.

The backend must perform the following validations:

1. Verify that the student exists.
2. Verify that the instrument exists and is active.
3. Confirm that the student does not have another unreturned instrument.
4. Confirm that the student does not have overdue and unreturned loans.
5. Verify that available units exist.
6. Apply the 21-day loan period.
7. Record the corresponding historical information.
8. Update available units within a transaction.

Loan registration must preserve a copy of the historical data defined in `data-model.md`.

The loan date and return due date must be handled in UTC.

### 9.4. Retrieve a Student's Loans

| Property | Definition |
|---|---|
| Method | GET |
| Endpoint | `/students/{id}/loans` |
| Description | Retrieve loans associated with a student. |
| Successful Response | 200 OK |

### 9.5. Retrieve Overdue Loans

| Property | Definition |
|---|---|
| Method | GET |
| Endpoint | `/loans/overdue` |
| Description | Retrieve loans that have passed their due dates and have no registered return. |
| Successful Response | 200 OK |

Overdue status must be calculated using the due date and the absence of an associated record in `returns`.

## 10. Return Endpoints

### 10.1. Register a Return

| Property | Definition |
|---|---|
| Method | POST |
| Endpoint | `/loans/{id}/returns` |
| Description | Register the return of a borrowed instrument. |
| Successful Response | 201 Created |
| Possible Conflict | 409 Conflict |

Example request:

```json
{}
```

The loan identifier will be provided through the URL.

The backend must:

1. Verify that the loan exists.
2. Start a database transaction.
3. Lock the loan record using `lockForUpdate()`.
4. Verify again that the loan has no registered return.
5. Lock the associated instrument record using `lockForUpdate()`.
6. Register the return with the current date and time in UTC.
7. Increase the instrument's available units by exactly one.
8. Verify that available units do not exceed total units.
9. Commit the transaction using `COMMIT`.
10. If an error occurs, cancel the operation using `ROLLBACK`.

The creation of the return record and the increase in available units must be executed within the same database transaction.

If either operation fails, the backend must execute `ROLLBACK` to revert all changes.

This prevents a return from being registered without updating inventory or available units from increasing without the corresponding return record.

The original loan information must remain unchanged.

**Concurrency Control:**

If two operators simultaneously attempt to register the return of the same loan, the system must allow only one operation to succeed.

The second request must check the return record again after acquiring the lock and respond with `409 Conflict` if the loan has already been returned.

The `UNIQUE` constraint on the `loan_id` field in the `returns` table must provide additional protection against duplicate returns.

Duplicate conflicts must be handled and returned as `409 Conflict`, not as an internal `500` error.

If the loan has already been returned, the operation must be rejected and inventory must not be increased again.

### 10.2. Retrieve a Return

| Property | Definition |
|---|---|
| Method | GET |
| Endpoint | `/loans/{id}/returns` |
| Description | Retrieve the return associated with a loan. |
| Successful Response | 200 OK |
| Possible Error | 404 Not Found |

## 11. Most Requested Instruments Report Endpoint

### 11.1. Retrieve Most Requested Instruments

| Property | Definition |
|---|---|
| Method | GET |
| Endpoint | `/reports/most-requested-instruments` |
| Description | Retrieve the most requested instruments report. |
| Successful Response | 200 OK |

Example response:

```json
{
  "mensaje": "Reporte generado correctamente.",
  "datos": [
    {
      "instrument_id": 1,
      "instrument_name": "Guitarra acustica",
      "total_loans": 15
    },
    {
      "instrument_id": 2,
      "instrument_name": "Piano",
      "total_loans": 10
    }
  ]
}
```

The report must be based on historical loan records and display instruments ordered by the number of registered requests.

## 12. Business Rules Enforced by the API

The API must ensure compliance with the following rules:

| Code | Rule | Expected Behavior |
|---|---|---|
| RN-01 | Maximum of one unreturned instrument per student. | Reject new loans while another loan remains pending. |
| RN-02 | 21-day loan period. | Calculate the return due date. |
| RN-03 | Restriction due to overdue loans. | Reject new loans until the corresponding return is registered. |
| RN-04 | Inventory integrity. | Keep available units between zero and total units. |
| RN-05 | Historical preservation. | Do not modify snapshot data from previous operations. |
| RN-06 | Record preservation. | Do not physically delete loans or returns; use logical deactivation for instruments. |

### 12.1. Concurrency

Loan registration must be executed within a database transaction to ensure data integrity when multiple monitors perform operations simultaneously.

The procedure must follow this order:

1. Start a transaction.
2. Lock the student record using `lockForUpdate()`.
3. Verify that the student has no pending loan or overdue and unreturned loans.
4. Lock the instrument record using `lockForUpdate()`.
5. Verify that the instrument is active and has available units.
6. Register the loan and update available units within the same transaction.
7. Commit the transaction if all validations and operations complete successfully.
8. Execute `rollback` if an error occurs during the process.

**Concurrency Control:**

If two monitors attempt to register a loan for the last available unit of the same instrument, the database must serialize the operations through record locking.

The first loan may succeed; the second must receive HTTP `409 Conflict` when it determines that no available units remain.

Student validations must also be performed after acquiring the student lock, preventing simultaneous requests from creating loans that violate business rules.

All processes must follow the same locking order to reduce the risk of deadlocks.

## 13. Error Handling

The API must display clear messages in Spanish.

Examples:

| Situation | HTTP Code | Message |
|---|---|---|
| Student does not exist | 404 | El estudiante no existe. |
| Instrument does not exist | 404 | El instrumento no existe. |
| Instrument has no available units | 409 | No hay unidades disponibles para este instrumento. |
| Student has a pending loan | 409 | El estudiante ya tiene un instrumento sin devolver. |
| Student has an overdue loan | 409 | El estudiante tiene prestamos vencidos pendientes. |
| Inactive instrument | 409 | No es posible prestar un instrumento dado de baja. |
| Loan already returned | 409 | Este prestamo ya tiene una devolucion registrada. |
| Invalid data | 422 | Los datos proporcionados no son validos. |
| Internal error | 500 | Ocurrio un error interno del servidor. |

## 14. Security and Validation

The backend will be responsible for validating all incoming requests.

The following guidelines must be applied:

- Validate input data.
- Prevent the frontend from directly controlling business rules.
- Do not allow direct MySQL access from the frontend.
- Protect credentials using environment variables.
- Avoid exposing sensitive information in responses.
- Use transactions for operations that modify inventory.
- Keep user-facing messages in Spanish.

Authentication and authorization mechanisms must be implemented if they are included in the approved project scope.

## 15. Relationship with Other Documents

| Document | Relationship |
|---|---|
| `constitution.md` | Establishes system principles and constraints. |
| `spec.md` | Defines functional requirements, business rules, and non-functional requirements. |
| `plan.md` | Organizes development phases. |
| `architecture.md` | Defines components and architectural communication. |
| `data-model.md` | Defines entities, relationships, and data structures. |
| `tasks.md` | Organizes implementation activities. |
| `adr/` | Records architectural decisions. |

## 16. Acceptance Criteria

The API contract shall be considered validated when:

1. Endpoints are defined and correspond to system features.
2. HTTP methods are consistent with their operations.
3. Requests and responses use JSON.
4. HTTP status codes correctly represent operation results.
5. Business rules are validated in the backend.
6. Loan and return operations protect inventory integrity.
7. Concurrency control returns HTTP 409 when applicable.
8. Dates are handled in UTC.
9. User-facing messages are written in Spanish.
10. The contract remains consistent with `spec.md`, `data-model.md`, and `architecture.md`.

## 17. Change Log

| Version | Date | Description | Status |
|---|---|---|---|
| 1.0 | 08/11/2026 | Initial creation of the Music School REST API contract. | Draft for Validation |
| 1.1 | 08/11/2026 | Added the POST /categories endpoint, validations to maintain inventory integrity, concurrency control for returns, and conflict handling for duplicate operations. | Draft for Validation |
