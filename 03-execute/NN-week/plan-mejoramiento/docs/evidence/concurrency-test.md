# Evidencia de prueba de concurrencia — Music School

## 1. Objetivo

Verificar que el sistema controle correctamente dos solicitudes simultaneas de prestamo cuando solamente existe una unidad disponible de un instrumento.

## 2. Regla de negocio evaluada

**RN-05 — Control de concurrencia**

Cuando dos operadores intenten entregar simultaneamente la ultima unidad disponible de un instrumento, solamente una operacion podra completarse. La operacion que no consiga la disponibilidad debera responder con HTTP 409 Conflict.

## 3. Configuracion de la prueba

- Instrumento: INS-CONC-001.
- Unidades totales: 1.
- Unidades disponibles antes de la prueba: 1.
- Estudiante A: EST-CONC-001.
- Estudiante B: EST-CONC-002.
- Operaciones: dos solicitudes independientes a `POST /api/loans`.

## 4. Resultados observados

| Solicitud | Resultado HTTP | Resultado |
|---|---:|---|
| Estudiante A | 201 Created | Prestamo registrado correctamente |
| Estudiante B | 409 Conflict | No hay unidades disponibles |

Despues de la operacion exitosa, la disponibilidad quedo en cero y solamente se registro un nuevo prestamo.

## 5. Mecanismo tecnico

El servicio `LoanService` utiliza:

- Transacciones mediante `DB::transaction()`.
- Bloqueo de registros mediante `lockForUpdate()`.
- Verificacion de disponibilidad despues de obtener el bloqueo.
- Actualizacion de inventario dentro de la transaccion.
- Respuesta HTTP 409 cuando no existen unidades disponibles.

## 6. Conclusion

La prueba realizada con dos procesos independientes confirmo que, ante las solicitudes efectuadas, solamente una operacion pudo registrar el prestamo de la ultima unidad disponible. La segunda recibio HTTP 409 Conflict.

Esta evidencia respalda la implementacion de la regla RN-05 y los criterios de concurrencia de TASK-14.

**Nota:** Esta prueba manual comprueba el escenario ejecutado; no reemplaza una prueba de estres ni verifica por si sola todas las posibles condiciones de concurrencia.