# Modelo de datos — Music School

**Identificador:** music-school  
**Proyecto:** Sistema de prestamo de instrumentos musicales  
**Ficha:** ADSO 3239137  
**Codigo del aprendiz:** A12
**Version:** 1.1
**Estado:** Borrador para validacion

---

## 1. Proposito

Este documento define la estructura logica de la base de datos del sistema Music School, incluyendo sus entidades, atributos, tipos de datos, claves primarias, claves foraneas, restricciones e indices.

El modelo de datos servira como referencia para implementar la persistencia utilizando MySQL y Laravel.

Su diseño debe garantizar la integridad de la informacion, el control del inventario, la conservacion del historial de operaciones y la consistencia de los prestamos y devoluciones.

## 2. Tecnologia de persistencia

| Elemento | Tecnologia |
|---|---|
| Motor de base de datos | MySQL 8 |
| Backend de persistencia | PHP con Laravel |
| Identificadores | Ingles |
| Fechas y horas | UTC |
| Integridad referencial | Claves foraneas |
| Control de operaciones | Transacciones de base de datos |

## 3. Entidades principales

El modelo contempla las siguientes entidades:

- `categories`: almacena las categorias de instrumentos.
- `instruments`: almacena los modelos de instrumentos y sus cantidades.
- `students`: almacena la informacion de los estudiantes.
- `loans`: registra los prestamos realizados y conserva los datos historicos.
- `returns`: registra las devoluciones asociadas a los prestamos.

## 4. Definicion de entidades

### 4.1. Tabla `categories`

Almacena las categorias de instrumentos musicales.

| Campo | Tipo de dato | Restriccion | Descripcion |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador de categoria. |
| code | VARCHAR(20) | UNIQUE, NOT NULL | Codigo de categoria. |
| name | VARCHAR(100) | NOT NULL | Nombre de categoria. |
| created_at | DATETIME(6) | NOT NULL | Fecha de creacion en UTC. |
| updated_at | DATETIME(6) | NOT NULL | Fecha de actualizacion en UTC. |

Categorias iniciales:

| Codigo | Categoria |
|---|---|
| CAT-01 | Cuerdas |
| CAT-02 | Vientos |
| CAT-03 | Percusion |
| CAT-04 | Teclados |
| CAT-05 | Electronicos |

### 4.2. Tabla `instruments`

Almacena los modelos de instrumentos musicales y sus cantidades.

| Campo | Tipo de dato | Restriccion | Descripcion |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador del instrumento. |
| category_id | BIGINT | FK, NOT NULL | Categoria asociada. |
| code | VARCHAR(50) | UNIQUE, NOT NULL | Codigo unico del modelo. |
| name | VARCHAR(150) | NOT NULL | Nombre del instrumento. |
| total_units | INT | NOT NULL | Cantidad total de unidades. |
| available_units | INT | NOT NULL | Cantidad de unidades disponibles. |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Estado del instrumento para baja logica. |
| created_at | DATETIME(6) | NOT NULL | Fecha de creacion en UTC. |
| updated_at | DATETIME(6) | NOT NULL | Fecha de actualizacion en UTC. |

Restricciones:

- `total_units` debe ser mayor o igual a cero.
- `available_units` debe ser mayor o igual a cero.
- `available_units` no puede superar `total_units`.
- Los instrumentos inactivos no pueden recibir nuevos prestamos.
- Los instrumentos dados de baja deben conservar sus registros historicos.
- La baja de un instrumento no debe eliminar fisicamente su registro.

### 4.3. Tabla `students`

Almacena la informacion de los estudiantes.

| Campo | Tipo de dato | Restriccion | Descripcion |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador del estudiante. |
| student_code | VARCHAR(50) | UNIQUE, NOT NULL | Codigo del estudiante. |
| full_name | VARCHAR(150) | NOT NULL | Nombre completo. |
| email | VARCHAR(150) | UNIQUE, NOT NULL | Correo electronico. |
| created_at | DATETIME(6) | NOT NULL | Fecha de creacion en UTC. |
| updated_at | DATETIME(6) | NOT NULL | Fecha de actualizacion en UTC. |

Restricciones:

- Cada estudiante debe tener un identificador unico.
- El codigo del estudiante no debe repetirse.
- La informacion de los estudiantes relacionada con prestamos historicos debe conservarse mediante los datos congelados registrados en cada operacion.

### 4.4. Tabla `loans`

Almacena los prestamos realizados y conserva la informacion original del estudiante y del instrumento al momento de la operacion.

| Campo | Tipo de dato | Restriccion | Descripcion |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador del prestamo. |
| student_id | BIGINT | FK, NOT NULL | Estudiante asociado. |
| instrument_id | BIGINT | FK, NOT NULL | Modelo de instrumento asociado. |
| student_code_snapshot | VARCHAR(50) | NOT NULL | Codigo del estudiante al realizar el prestamo. |
| student_name_snapshot | VARCHAR(150) | NOT NULL | Nombre del estudiante al realizar el prestamo. |
| instrument_code_snapshot | VARCHAR(50) | NOT NULL | Codigo del instrumento al realizar el prestamo. |
| instrument_name_snapshot | VARCHAR(150) | NOT NULL | Nombre del instrumento al realizar el prestamo. |
| loaned_at | DATETIME(6) | NOT NULL | Fecha y hora del prestamo en UTC. |
| due_at | DATETIME(6) | NOT NULL | Fecha y hora de vencimiento en UTC. |
| created_at | DATETIME(6) | NOT NULL | Fecha de creacion del registro en UTC. |

Restricciones:

- Cada prestamo debe pertenecer a un estudiante existente.
- Cada prestamo debe corresponder a un instrumento existente.
- Cada prestamo representa una unidad del modelo de instrumento.
- La fecha de vencimiento debe establecerse a 21 dias desde la fecha de registro del prestamo.
- El estudiante no puede tener mas de un prestamo pendiente de devolucion.
- Los estudiantes con prestamos vencidos y pendientes no pueden recibir nuevos instrumentos.
- Los datos congelados deben conservar la informacion original del estudiante y del instrumento.
- Los prestamos no deben eliminarse fisicamente.
- Los registros historicos no deben modificarse por cambios posteriores en el catalogo o en la informacion del estudiante.

**Identificacion del estado del prestamo:**

El estado del prestamo se determinara mediante la existencia de un registro relacionado en la tabla `returns`.

- Si no existe una devolucion asociada, el prestamo permanece pendiente.
- Si existe una devolucion asociada, el prestamo se considera devuelto.
- Si no existe devolucion y `due_at` ya fue superada, el prestamo se considera vencido.

Este mecanismo evita mantener un campo de estado duplicado que pueda generar inconsistencias con los registros de devolucion.

### 4.5. Tabla `returns`

Almacena las devoluciones de los instrumentos.

| Campo | Tipo de dato | Restriccion | Descripcion |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | Identificador de devolucion. |
| loan_id | BIGINT | FK, UNIQUE, NOT NULL | Prestamo devuelto. |
| returned_at | DATETIME(6) | NOT NULL | Fecha y hora de devolucion en UTC. |
| created_at | DATETIME(6) | NOT NULL | Fecha de creacion del registro en UTC. |

Restricciones:

- Cada devolucion debe estar asociada a un prestamo existente.
- Cada prestamo puede tener como maximo una devolucion.
- No se permiten devoluciones duplicadas.
- Las devoluciones no deben eliminarse fisicamente.
- La devolucion debe incrementar las unidades disponibles del instrumento correspondiente.
- Las unidades disponibles nunca deben superar las unidades totales.
- La devolucion debe conservar la informacion historica del prestamo al que pertenece.

## 5. Relaciones entre entidades

| Entidad principal | Relacion | Entidad relacionada |
|---|---|---|
| categories | 1:N | instruments |
| instruments | 1:N | loans |
| students | 1:N | loans |
| loans | 1:0..1 | returns |

Descripcion de las relaciones:

- Una categoria puede contener varios modelos de instrumentos.
- Un instrumento puede estar relacionado con varios prestamos historicos.
- Un estudiante puede tener varios prestamos a lo largo del tiempo, respetando el limite de un prestamo pendiente.
- Un prestamo puede tener cero o una devolucion registrada.

## 6. Reglas de integridad

1. Las claves foraneas deben garantizar la integridad referencial.
2. Las unidades disponibles deben permanecer entre cero y las unidades totales.
3. Un estudiante no puede tener mas de un prestamo pendiente de devolucion.
4. Un estudiante con un prestamo vencido y pendiente no puede recibir otro instrumento.
5. Cada prestamo debe tener un plazo de 21 dias.
6. Una devolucion debe estar asociada a un prestamo existente.
7. Un prestamo no puede tener mas de una devolucion.
8. Los prestamos y las devoluciones deben conservarse como registros historicos.
9. Los datos congelados deben mantener la informacion original de las operaciones.
10. Los instrumentos retirados del catalogo deben utilizar baja logica.
11. Las operaciones simultaneas deben proteger la disponibilidad del inventario.
12. Las fechas y horas deben almacenarse y procesarse en UTC.

## 7. Indices recomendados

| Tabla | Indice | Proposito |
|---|---|---|
| categories | UNIQUE(code) | Consultar categorias por codigo. |
| instruments | UNIQUE(code) | Identificar modelos de instrumentos. |
| instruments | category_id | Consultar instrumentos por categoria. |
| instruments | is_active | Consultar instrumentos activos. |
| students | UNIQUE(student_code) | Buscar estudiantes por codigo. |
| students | UNIQUE(email) | Evitar correos duplicados. |
| loans | student_id | Consultar prestamos por estudiante. |
| loans | instrument_id | Consultar prestamos por instrumento. |
| loans | due_at | Identificar prestamos vencidos. |
| loans | student_id, loaned_at | Consultar prestamos de un estudiante por fecha. |
| returns | UNIQUE(loan_id) | Evitar devoluciones duplicadas. |

Las claves primarias, las restricciones UNIQUE y las claves foraneas tambien generan o requieren indices segun las reglas de MySQL.

## 8. Consideraciones de implementacion

### 8.1. Control de prestamos

El registro de un prestamo debe ejecutarse mediante una transaccion de base de datos.

Dentro de la transaccion se debe:

1. Verificar que el estudiante exista.
2. Bloquear la fila del estudiante durante la validacion del prestamo para evitar que dos solicitudes simultaneas registren prestamos pendientes para el mismo estudiante.
3. Verificar que el estudiante no tenga otro prestamo pendiente.
4. Verificar que el estudiante no tenga prestamos vencidos pendientes.
5. Bloquear la fila del instrumento que se desea prestar.
6. Comprobar que el instrumento este activo.
7. Comprobar que existan unidades disponibles.
8. Registrar el prestamo y sus datos congelados.
9. Disminuir las unidades disponibles en una unidad.
10. Confirmar la transaccion.

La validacion de prestamos pendientes debe ejecutarse dentro de la misma transaccion que registra el nuevo prestamo. Para ello, Laravel debe bloquear la fila del estudiante mediante el mecanismo de bloqueo pesimista (lockForUpdate()), consultar si tiene un prestamo sin devolucion y, si no tiene ninguno, registrar el nuevo prestamo y actualizar el inventario. El bloqueo debe mantenerse hasta que la transaccion finalice mediante commit o rollback. De esta manera, se evita que dos solicitudes simultaneas creen prestamos pendientes para el mismo estudiante.

### 8.2. Control de devoluciones

La devolucion debe ejecutarse mediante una transaccion.

Dentro de la transaccion se debe:

1. Identificar el prestamo.
2. Bloquear la fila del prestamo durante la operacion de devolucion.
3. Verificar que no tenga una devolucion registrada.
4. Registrar la devolucion.
5. Incrementar en una unidad la disponibilidad del instrumento asociado al prestamo.
6. Verificar que las unidades disponibles no superen las unidades totales.
7. Confirmar la transaccion.

### 8.3. Control de concurrencia

Para evitar que dos operadores entreguen simultaneamente la ultima unidad disponible de un instrumento:

- Se deben utilizar transacciones de base de datos.
- Se debe bloquear la fila del instrumento durante la operacion de prestamo.
- La disponibilidad debe verificarse dentro de la transaccion.
- La actualizacion de las unidades disponibles y el registro del prestamo deben realizarse dentro de la misma transaccion.
- Si otro operador ya ha registrado el prestamo de la ultima unidad, la operacion debe rechazarse.
- La operacion rechazada debe responder con el codigo HTTP `409 Conflict`.
- Cuando la operacion sea rechazada, no se debe crear el prestamo ni modificar las unidades disponibles.
- Si ocurre un error durante la operacion, se debe ejecutar un `ROLLBACK` para evitar cambios parciales.
- Si la operacion finaliza correctamente, se debe ejecutar un `COMMIT`.

### 8.4. Integridad referencial y eliminacion de registros

Para garantizar la integridad de la informacion y conservar el historial de prestamos:

- Las relaciones entre las tablas deben implementarse mediante claves foraneas.
- No se debe permitir la eliminacion fisica de estudiantes que tengan prestamos registrados.
- No se debe permitir la eliminacion fisica de instrumentos que tengan prestamos asociados.
- Las claves foraneas deben utilizar la restriccion `ON DELETE RESTRICT` cuando corresponda.
- Los instrumentos deben retirarse del catalogo mediante baja logica, utilizando el campo `is_active`.
- Los prestamos y las devoluciones deben conservarse permanentemente para mantener la trazabilidad de las operaciones.

### 8.5. Restricciones de integridad del inventario

La base de datos debe garantizar que las cantidades registradas para cada instrumento mantengan la consistencia del inventario.

Se deben aplicar las siguientes restricciones:

- `total_units` debe ser mayor o igual a cero.
- `available_units` debe ser mayor o igual a cero.
- `available_units` no puede superar `total_units`.
- Las unidades disponibles deben disminuir al registrar un prestamo correctamente.
- Las unidades disponibles deben aumentar al registrar una devolucion correctamente.
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
Estas restricciones deben declararse dentro de la definicion CREATE TABLE instruments, junto con los demas campos de la tabla. No deben ejecutarse como sentencias independientes. Su proposito es garantizar desde la base de datos que las unidades totales y disponibles no sean negativas y que las unidades disponibles nunca superen las unidades totales.

## 9. Criterios de aceptacion del modelo de datos

El modelo de datos se considerara aceptable cuando cumpla las siguientes condiciones:

1. Existan las cinco entidades principales: `categories`, `instruments`, `students`, `loans` y `returns`.
2. Las relaciones entre las entidades esten definidas mediante claves primarias y claves foraneas.
3. Las categorias iniciales correspondan a las cinco categorias establecidas para el proyecto.
4. Las unidades disponibles permanezcan entre cero y las unidades totales.
5. Los prestamos conserven los datos historicos del estudiante y del instrumento.
6. Cada prestamo tenga un plazo de 21 dias.
7. Cada prestamo pueda tener como maximo una devolucion registrada.
8. Los prestamos y las devoluciones conserven su informacion historica.
9. Los instrumentos retirados del catalogo se gestionen mediante baja logica.
10. Las operaciones de prestamo y devolucion utilicen transacciones para mantener la integridad del inventario.
11. El control de concurrencia impida entregar una misma ultima unidad a dos operadores y responda con HTTP 409 Conflict cuando corresponda.
12. Las fechas y horas se almacenen y procesen en UTC.
13. Los indices y restricciones definidos permitan mantener la consistencia y facilitar las consultas del sistema.

## 10. Control de cambios

| Version | Fecha | Descripcion |
|---|---|---|
| 1.0 | 07/11/2026 | Creacion inicial del modelo de datos, definicion de entidades, atributos y relaciones. |
| 1.1 | 07/11/2026 | Incorporacion de consideraciones de implementacion, integridad referencial, control de concurrencia, restricciones del inventario y criterios de aceptacion. |

**Estado actual:** Borrador para validacion.