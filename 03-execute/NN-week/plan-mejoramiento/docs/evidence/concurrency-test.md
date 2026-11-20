
# Concurrency Test Evidence — Music School

## 1. Objective

Verify that the system correctly handles two simultaneous loan requests when only one unit of an instrument is available.

## 2. Business Rule Evaluated

**RN-05 — Concurrency Control**

When two operators simultaneously attempt to lend the last available unit of an instrument, only one operation may succeed. The operation that cannot obtain the available unit must return HTTP 409 Conflict.

## 3. Test Configuration

- Instrument: INS-CONC-001.
- Total units: 1.
- Available units before the test: 1.
- Student A: EST-CONC-001.
- Student B: EST-CONC-002.
- Operations: Two independent requests to `POST /api/loans`.

## 4. Observed Results

| Request | HTTP Result | Result |
|---|---|---|
| Student A | 201 Created | Prestamo registrado correctamente |
| Student B | 409 Conflict | No hay unidades disponibles |

After the successful operation, availability was reduced to zero, and only one new loan was registered.

## 5. Technical Mechanism

The `LoanService` uses:

- Database transactions through `DB::transaction()`.
- Row-level locking through `lockForUpdate()`.
- Availability verification after acquiring the lock.
- Inventory updates within the transaction.
- HTTP 409 responses when no units are available.

## 6. Conclusion

The test performed using two independent processes confirmed that, for the executed requests, only one operation successfully registered the loan of the last available unit. The second request received HTTP 409 Conflict.

This evidence supports the implementation of business rule RN-05 and the concurrency criteria of TASK-14.

**Note:** This manual test verifies the executed scenario; it does not replace a stress test or independently verify all possible concurrency conditions.
