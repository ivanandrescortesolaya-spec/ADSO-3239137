# Evidencia de prueba de concurrencia — Music School

## 1. Objetivo

Verificar que el sistema controle correctamente dos solicitudes simultáneas de préstamo cuando solamente existe una unidad disponible de un instrumento.

## 2. Regla de negocio evaluada

**RN-05 — Control de concurrencia**

Cuando dos operadores intenten entregar simultáneamente la última unidad disponible de un instrumento, solamente una operación podrá completarse. La operación que no consiga la disponibilidad deberá responder con HTTP 409 Conflict.

## 3. Configuración de la prueba

- Instrumento: INS-CONC-001.
- Unidades totales: 1.
- Unidades disponibles antes de la prueba: 1.
- Estudiante A: EST-CONC-001.
- Estudiante B: EST-CONC-002.
- Operaciones: dos solicitudes independientes a `POST /api/loans`.

## 4. Resultados observados

| Solicitud | Resultado HTTP | Resultado |
|---|---:|---|
| Estudiante A | 201 Created | Préstamo registrado correctamente |
| Estudiante B | 409 Conflict | No hay unidades disponibles |

Después de la operación exitosa, la disponibilidad quedó en cero y solamente se registró un nuevo préstamo.

## 5. Mecanismo técnico

El servicio `LoanService` utiliza:

- Transacciones mediante `DB::transaction()`.
- Bloqueo de registros mediante `lockForUpdate()`.
- Verificación de disponibilidad después de obtener el bloqueo.
- Actualización de inventario dentro de la transacción.
- Respuesta HTTP 409 cuando no existen unidades disponibles.

## 6. Conclusión

La prueba realizada con dos procesos independientes confirmó que, ante las solicitudes efectuadas, solamente una operación pudo registrar el préstamo de la última unidad disponible. La segunda recibió HTTP 409 Conflict.

Esta evidencia respalda la implementación de la regla RN-05 y los criterios de concurrencia de TASK-14.

**Nota:** Esta prueba manual comprueba el escenario ejecutado; no reemplaza una prueba de estrés ni verifica por sí sola todas las posibles condiciones de concurrencia.