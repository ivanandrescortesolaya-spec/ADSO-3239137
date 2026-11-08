# Modelo de datos — Music School

**Identificador:** music-school  
**Proyecto:** Sistema de préstamo de instrumentos musicales  
**Ficha:** ADSO 3239137  
**Código del aprendiz:** A12
**Versión:** 1.1
**Estado:** Borrador para validación

---

## 1. Propósito

Este documento define la estructura lógica de la base de datos del sistema Music School, incluyendo sus entidades, atributos, tipos de datos, claves primarias, claves foráneas, restricciones e índices.

El modelo de datos servirá como referencia para implementar la persistencia utilizando MySQL y Laravel.

Su diseño debe garantizar la integridad de la información, el control del inventario, la conservación del historial de operaciones y la consistencia de los préstamos y devoluciones.

## 2. Tecnología de persistencia

| Elemento | Tecnología |
|---|---|
| Motor de base de datos | MySQL 8 |
| Backend de persistencia | PHP con Laravel |
| Identificadores | Inglés |
| Fechas y horas | UTC |
| Integridad referencial | Claves foráneas |
| Control de operaciones | Transacciones de base de datos |

## 3. Entidades principales

El modelo contempla las siguientes entidades:

- `categories`: almacena las categorías de instrumentos.
- `instruments`: almacena los modelos de instrumentos y sus cantidades.
- `students`: almacena la información de los estudiantes.
- `loans`: registra los préstamos realizados y conserva los datos históricos.
- `returns`: registra las devoluciones asociadas a los préstamos.

## 4. Definición de entidades

### 4.1. Tabla `categories`

Almacena las categorías de instrumentos musicales.

| Campo | Tipo de dato | Restricción | Descripción |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador de categoría. |
| code | VARCHAR(20) | UNIQUE, NOT NULL | Código de categoría. |
| name | VARCHAR(100) | NOT NULL | Nombre de categoría. |
| created_at | DATETIME(6) | NOT NULL | Fecha de creación en UTC. |
| updated_at | DATETIME(6) | NOT NULL | Fecha de actualización en UTC. |

Categorías iniciales:

| Código | Categoría |
|---|---|
| CAT-01 | Cuerdas |
| CAT-02 | Vientos |
| CAT-03 | Percusión |
| CAT-04 | Teclados |
| CAT-05 | Electrónicos |

### 4.2. Tabla `instruments`

Almacena los modelos de instrumentos musicales y sus cantidades.

| Campo | Tipo de dato | Restricción | Descripción |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador del instrumento. |
| category_id | BIGINT | FK, NOT NULL | Categoría asociada. |
| code | VARCHAR(50) | UNIQUE, NOT NULL | Código único del modelo. |
| name | VARCHAR(150) | NOT NULL | Nombre del instrumento. |
| total_units | INT | NOT NULL | Cantidad total de unidades. |
| available_units | INT | NOT NULL | Cantidad de unidades disponibles. |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Estado del instrumento para baja lógica. |
| created_at | DATETIME(6) | NOT NULL | Fecha de creación en UTC. |
| updated_at | DATETIME(6) | NOT NULL | Fecha de actualización en UTC. |

Restricciones:

- `total_units` debe ser mayor o igual a cero.
- `available_units` debe ser mayor o igual a cero.
- `available_units` no puede superar `total_units`.
- Los instrumentos inactivos no pueden recibir nuevos préstamos.
- Los instrumentos dados de baja deben conservar sus registros históricos.
- La baja de un instrumento no debe eliminar físicamente su registro.

### 4.3. Tabla `students`

Almacena la información de los estudiantes.

| Campo | Tipo de dato | Restricción | Descripción |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador del estudiante. |
| student_code | VARCHAR(50) | UNIQUE, NOT NULL | Código del estudiante. |
| full_name | VARCHAR(150) | NOT NULL | Nombre completo. |
| email | VARCHAR(150) | UNIQUE, NOT NULL | Correo electrónico. |
| created_at | DATETIME(6) | NOT NULL | Fecha de creación en UTC. |
| updated_at | DATETIME(6) | NOT NULL | Fecha de actualización en UTC. |

Restricciones:

- Cada estudiante debe tener un identificador único.
- El código del estudiante no debe repetirse.
- La información de los estudiantes relacionada con préstamos históricos debe conservarse mediante los datos congelados registrados en cada operación.

### 4.4. Tabla `loans`

Almacena los préstamos realizados y conserva la información original del estudiante y del instrumento al momento de la operación.

| Campo | Tipo de dato | Restricción | Descripción |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador del préstamo. |
| student_id | BIGINT | FK, NOT NULL | Estudiante asociado. |
| instrument_id | BIGINT | FK, NOT NULL | Modelo de instrumento asociado. |
| student_code_snapshot | VARCHAR(50) | NOT NULL | Código del estudiante al realizar el préstamo. |
| student_name_snapshot | VARCHAR(150) | NOT NULL | Nombre del estudiante al realizar el préstamo. |
| instrument_code_snapshot | VARCHAR(50) | NOT NULL | Código del instrumento al realizar el préstamo. |
| instrument_name_snapshot | VARCHAR(150) | NOT NULL | Nombre del instrumento al realizar el préstamo. |
| loaned_at | DATETIME(6) | NOT NULL | Fecha y hora del préstamo en UTC. |
| due_at | DATETIME(6) | NOT NULL | Fecha y hora de vencimiento en UTC. |
| created_at | DATETIME(6) | NOT NULL | Fecha de creación del registro en UTC. |

Restricciones:

- Cada préstamo debe pertenecer a un estudiante existente.
- Cada préstamo debe corresponder a un instrumento existente.
- Cada préstamo representa una unidad del modelo de instrumento.
- La fecha de vencimiento debe establecerse a 21 días desde la fecha de registro del préstamo.
- El estudiante no puede tener más de un préstamo pendiente de devolución.
- Los estudiantes con préstamos vencidos y pendientes no pueden recibir nuevos instrumentos.
- Los datos congelados deben conservar la información original del estudiante y del instrumento.
- Los préstamos no deben eliminarse físicamente.
- Los registros históricos no deben modificarse por cambios posteriores en el catálogo o en la información del estudiante.

**Identificación del estado del préstamo:**

El estado del préstamo se determinará mediante la existencia de un registro relacionado en la tabla `returns`.

- Si no existe una devolución asociada, el préstamo permanece pendiente.
- Si existe una devolución asociada, el préstamo se considera devuelto.
- Si no existe devolución y `due_at` ya fue superada, el préstamo se considera vencido.

Este mecanismo evita mantener un campo de estado duplicado que pueda generar inconsistencias con los registros de devolución.

### 4.5. Tabla `returns`

Almacena las devoluciones de los instrumentos.

| Campo | Tipo de dato | Restricción | Descripción |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador de devolución. |
| loan_id | BIGINT | FK, UNIQUE, NOT NULL | Préstamo devuelto. |
| returned_at | DATETIME(6) | NOT NULL | Fecha y hora de devolución en UTC. |
| created_at | DATETIME(6) | NOT NULL | Fecha de creación del registro en UTC. |

Restricciones:

- Cada devolución debe estar asociada a un préstamo existente.
- Cada préstamo puede tener como máximo una devolución.
- No se permiten devoluciones duplicadas.
- Las devoluciones no deben eliminarse físicamente.
- La devolución debe incrementar las unidades disponibles del instrumento correspondiente.
- Las unidades disponibles nunca deben superar las unidades totales.
- La devolución debe conservar la información histórica del préstamo al que pertenece.

## 5. Relaciones entre entidades

| Entidad principal | Relación | Entidad relacionada |
|---|---|---|
| categories | 1:N | instruments |
| instruments | 1:N | loans |
| students | 1:N | loans |
| loans | 1:0..1 | returns |

Descripción de las relaciones:

- Una categoría puede contener varios modelos de instrumentos.
- Un instrumento puede estar relacionado con varios préstamos históricos.
- Un estudiante puede tener varios préstamos a lo largo del tiempo, respetando el límite de un préstamo pendiente.
- Un préstamo puede tener cero o una devolución registrada.

## 6. Reglas de integridad

1. Las claves foráneas deben garantizar la integridad referencial.
2. Las unidades disponibles deben permanecer entre cero y las unidades totales.
3. Un estudiante no puede tener más de un préstamo pendiente de devolución.
4. Un estudiante con un préstamo vencido y pendiente no puede recibir otro instrumento.
5. Cada préstamo debe tener un plazo de 21 días.
6. Una devolución debe estar asociada a un préstamo existente.
7. Un préstamo no puede tener más de una devolución.
8. Los préstamos y las devoluciones deben conservarse como registros históricos.
9. Los datos congelados deben mantener la información original de las operaciones.
10. Los instrumentos retirados del catálogo deben utilizar baja lógica.
11. Las operaciones simultáneas deben proteger la disponibilidad del inventario.
12. Las fechas y horas deben almacenarse y procesarse en UTC.

## 7. Índices recomendados

| Tabla | Índice | Propósito |
|---|---|---|
| categories | UNIQUE(code) | Consultar categorías por código. |
| instruments | UNIQUE(code) | Identificar modelos de instrumentos. |
| instruments | category_id | Consultar instrumentos por categoría. |
| instruments | is_active | Consultar instrumentos activos. |
| students | UNIQUE(student_code) | Buscar estudiantes por código. |
| students | UNIQUE(email) | Evitar correos duplicados. |
| loans | student_id | Consultar préstamos por estudiante. |
| loans | instrument_id | Consultar préstamos por instrumento. |
| loans | due_at | Identificar préstamos vencidos. |
| loans | student_id, loaned_at | Consultar préstamos de un estudiante por fecha. |
| returns | UNIQUE(loan_id) | Evitar devoluciones duplicadas. |

Las claves primarias, las restricciones UNIQUE y las claves foráneas también generan o requieren índices según las reglas de MySQL.

## 8. Consideraciones de implementación

### 8.1. Control de préstamos

El registro de un préstamo debe ejecutarse mediante una transacción de base de datos.

Dentro de la transacción se debe:

1. Verificar que el estudiante exista.
2. Bloquear la fila del estudiante durante la validación del préstamo para evitar que dos solicitudes simultáneas registren préstamos pendientes para el mismo estudiante.
3. Verificar que el estudiante no tenga otro préstamo pendiente.
4. Verificar que el estudiante no tenga préstamos vencidos pendientes.
5. Bloquear la fila del instrumento que se desea prestar.
6. Comprobar que el instrumento esté activo.
7. Comprobar que existan unidades disponibles.
8. Registrar el préstamo y sus datos congelados.
9. Disminuir las unidades disponibles en una unidad.
10. Confirmar la transacción.

La validación de préstamos pendientes debe ejecutarse dentro de la misma transacción que registra el nuevo préstamo. Para ello, Laravel debe bloquear la fila del estudiante mediante el mecanismo de bloqueo pesimista (lockForUpdate()), consultar si tiene un préstamo sin devolución y, si no tiene ninguno, registrar el nuevo préstamo y actualizar el inventario. El bloqueo debe mantenerse hasta que la transacción finalice mediante commit o rollback. De esta manera, se evita que dos solicitudes simultáneas creen préstamos pendientes para el mismo estudiante.

### 8.2. Control de devoluciones

La devolución debe ejecutarse mediante una transacción.

Dentro de la transacción se debe:

1. Identificar el préstamo.
2. Bloquear la fila del préstamo durante la operación de devolución.
3. Verificar que no tenga una devolución registrada.
4. Registrar la devolución.
5. Incrementar en una unidad la disponibilidad del instrumento asociado al préstamo.
6. Verificar que las unidades disponibles no superen las unidades totales.
7. Confirmar la transacción.

### 8.3. Control de concurrencia

Para evitar que dos operadores entreguen simultáneamente la última unidad disponible de un instrumento:

- Se deben utilizar transacciones de base de datos.
- Se debe bloquear la fila del instrumento durante la operación de préstamo.
- La disponibilidad debe verificarse dentro de la transacción.
- La actualización de las unidades disponibles y el registro del préstamo deben realizarse dentro de la misma transacción.
- Si otro operador ya ha registrado el préstamo de la última unidad, la operación debe rechazarse.
- La operación rechazada debe responder con el código HTTP `409 Conflict`.
- Cuando la operación sea rechazada, no se debe crear el préstamo ni modificar las unidades disponibles.
- Si ocurre un error durante la operación, se debe ejecutar un `ROLLBACK` para evitar cambios parciales.
- Si la operación finaliza correctamente, se debe ejecutar un `COMMIT`.

### 8.4. Integridad referencial y eliminación de registros

Para garantizar la integridad de la información y conservar el historial de préstamos:

- Las relaciones entre las tablas deben implementarse mediante claves foráneas.
- No se debe permitir la eliminación física de estudiantes que tengan préstamos registrados.
- No se debe permitir la eliminación física de instrumentos que tengan préstamos asociados.
- Las claves foráneas deben utilizar la restricción `ON DELETE RESTRICT` cuando corresponda.
- Los instrumentos deben retirarse del catálogo mediante baja lógica, utilizando el campo `is_active`.
- Los préstamos y las devoluciones deben conservarse permanentemente para mantener la trazabilidad de las operaciones.

### 8.5. Restricciones de integridad del inventario

La base de datos debe garantizar que las cantidades registradas para cada instrumento mantengan la consistencia del inventario.

Se deben aplicar las siguientes restricciones:

- `total_units` debe ser mayor o igual a cero.
- `available_units` debe ser mayor o igual a cero.
- `available_units` no puede superar `total_units`.
- Las unidades disponibles deben disminuir al registrar un préstamo correctamente.
- Las unidades disponibles deben aumentar al registrar una devolución correctamente.
- Las operaciones que modifiquen las cantidades deben ejecutarse mediante transacciones.
- Las restricciones deben validarse tanto en Laravel como en la base de datos.

En MySQL 8 se deben utilizar restricciones `CHECK` para reforzar las condiciones del inventario:

```sql
CONSTRAINT chk_total_units
    CHECK (total_units >= 0),

CONSTRAINT chk_available_units
    CHECK (available_units >= 0),

CONSTRAINT chk_inventory_units
    CHECK (available_units <= total_units)
```
Estas restricciones deben declararse dentro de la definición CREATE TABLE instruments, junto con los demás campos de la tabla. No deben ejecutarse como sentencias independientes. Su propósito es garantizar desde la base de datos que las unidades totales y disponibles no sean negativas y que las unidades disponibles nunca superen las unidades totales.

## 9. Criterios de aceptación del modelo de datos

El modelo de datos se considerará aceptable cuando cumpla las siguientes condiciones:

1. Existan las cinco entidades principales: `categories`, `instruments`, `students`, `loans` y `returns`.
2. Las relaciones entre las entidades estén definidas mediante claves primarias y claves foráneas.
3. Las categorías iniciales correspondan a las cinco categorías establecidas para el proyecto.
4. Las unidades disponibles permanezcan entre cero y las unidades totales.
5. Los préstamos conserven los datos históricos del estudiante y del instrumento.
6. Cada préstamo tenga un plazo de 21 días.
7. Cada préstamo pueda tener como máximo una devolución registrada.
8. Los préstamos y las devoluciones conserven su información histórica.
9. Los instrumentos retirados del catálogo se gestionen mediante baja lógica.
10. Las operaciones de préstamo y devolución utilicen transacciones para mantener la integridad del inventario.
11. El control de concurrencia impida entregar una misma última unidad a dos operadores y responda con HTTP 409 Conflict cuando corresponda.
12. Las fechas y horas se almacenen y procesen en UTC.
13. Los índices y restricciones definidos permitan mantener la consistencia y facilitar las consultas del sistema.

## 10. Control de cambios

| Versión | Fecha | Descripción |
|---|---|---|
| 1.0 | 07/11/2026 | Creación inicial del modelo de datos, definición de entidades, atributos y relaciones. |
| 1.1 | 07/11/2026 | Incorporación de consideraciones de implementación, integridad referencial, control de concurrencia, restricciones del inventario y criterios de aceptación. |

**Estado actual:** Borrador para validación.