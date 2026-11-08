# Contrato de API REST — Music School

**Identificador:** music-school  
**Proyecto:** Sistema de préstamo de instrumentos musicales  
**Ficha:** ADSO 3239137  
**Código del aprendiz:** A12  
**Versión:** 1.1
**Estado:** Borrador para validación

---

## 1. Propósito

El presente documento establece el contrato de comunicación entre el frontend desarrollado con React y el backend desarrollado con PHP y Laravel para el sistema Music School.

Define los endpoints, métodos HTTP, parámetros, estructuras de solicitudes, respuestas, códigos de estado y validaciones necesarias para garantizar una comunicación uniforme entre los componentes del sistema.

El contrato deberá respetar los requisitos establecidos en `spec.md`, las estructuras de datos definidas en `data-model.md` y las decisiones arquitectónicas documentadas en `architecture.md`.

## 2. Alcance

La API REST permitirá realizar las siguientes operaciones:

- Consultar categorías de instrumentos.
- Gestionar instrumentos.
- Consultar y gestionar estudiantes.
- Registrar préstamos.
- Consultar préstamos e historial.
- Registrar devoluciones.
- Consultar préstamos vencidos.
- Consultar unidades disponibles.
- Generar el reporte de instrumentos más solicitados.
- Inicializar información de prueba mediante solicitudes a la API.

La API será el mecanismo de comunicación entre el frontend y el backend. El frontend no tendrá acceso directo a la base de datos.

### 2.1. Herramienta de siembra de datos

El proyecto contará con una herramienta de siembra ubicada en la carpeta `tool/`, cuya responsabilidad será inicializar información de prueba mediante solicitudes HTTP a los endpoints de la API REST.

La herramienta no deberá conectarse directamente a MySQL ni ejecutar consultas SQL sobre la base de datos.

La información inicial deberá contemplar las siguientes cinco categorías:

| Código | Categoría |
|---|---|
| CAT-01 | Cuerdas |
| CAT-02 | Vientos |
| CAT-03 | Percusión |
| CAT-04 | Teclados |
| CAT-05 | Electrónicos |

La herramienta podrá utilizar los endpoints de la API para registrar las categorías, los instrumentos y los estudiantes necesarios para las pruebas del sistema.

El proceso deberá respetar las validaciones del backend y las restricciones de integridad definidas en `data-model.md`.

La siembra deberá evitar duplicar registros cuando se ejecute más de una vez, utilizando los códigos únicos definidos para identificar los datos iniciales.

La herramienta deberá permitir preparar un conjunto de datos de prueba para validar las consultas del catálogo, los préstamos, las devoluciones y los reportes.

## 3. Características generales

| Característica | Definición |
|---|---|
| Estilo de comunicación | API REST |
| Protocolo | HTTP |
| Formato de intercambio | JSON |
| Backend | PHP y Laravel |
| Frontend | React |
| Base de datos | MySQL |
| Codificación | UTF-8 |
| Fechas | UTC |
| Idioma de mensajes | Español |
| Identificadores del código | Inglés |

### 3.1. URL base

Durante el desarrollo local, la API utilizará la siguiente dirección base:

`http://localhost:8000/api`

**Nota de configuración:** El puerto `8000` se establece como valor provisional para el entorno local. Se deberá verificar y ajustar según el mapeo de puertos definido en `infra/docker-compose.yml` durante la configuración de la infraestructura.

### 3.2. Encabezados HTTP

Las solicitudes que envíen información en formato JSON deberán utilizar:

```http
Content-Type: application/json
Accept: application/json
```

## 4. Convenciones de respuesta

Las respuestas de la API deberán utilizar estructuras JSON uniformes.

### 4.1. Respuesta exitosa

Ejemplo:

```json
{
  "mensaje": "Operación realizada correctamente.",
  "datos": {
    "id": 1
  }
}
```

### 4.2. Respuesta de error

Ejemplo:

```json
{
  "mensaje": "No fue posible completar la operación.",
  "errores": {}
}
```

### 4.3. Respuesta de validación

Ejemplo:

```json
{
  "mensaje": "Los datos proporcionados no son válidos.",
  "errores": {
    "student_id": [
      "El estudiante seleccionado no existe."
    ]
  }
}
```

## 5. Códigos de estado HTTP

| Código | Nombre | Uso |
|---|---|---|
| 200 | OK | Consulta u operación exitosa. |
| 201 | Created | Registro creado correctamente. |
| 204 | No Content | Operación exitosa sin contenido de respuesta. |
| 400 | Bad Request | Solicitud incorrecta. |
| 404 | Not Found | Recurso no encontrado. |
| 409 | Conflict | Conflicto con las reglas de negocio o disponibilidad. |
| 422 | Unprocessable Entity | Error de validación de los datos. |
| 500 | Internal Server Error | Error interno del servidor. |

El backend deberá utilizar los códigos HTTP de acuerdo con el resultado de cada operación.

## 6. Endpoints de categorías

### 6.1. Consultar categorías

| Propiedad | Definición |
|---|---|
| Método | GET |
| Endpoint | `/categories` |
| Descripción | Consultar las categorías de instrumentos. |
| Respuesta exitosa | 200 OK |

Ejemplo de respuesta:

```json
{
  "mensaje": "Categorías consultadas correctamente.",
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
      "name": "Percusión"
    },
    {
      "id": 4,
      "code": "CAT-04",
      "name": "Teclados"
    },
    {
      "id": 5,
      "code": "CAT-05",
      "name": "Electrónicos"
    }
  ]
}
```

Las cinco categorías iniciales deberán estar disponibles para la clasificación de instrumentos.

### 6.2. Registrar una categoría

**Endpoint:**

```http
POST /categories
```

**Descripción:**

Permite registrar una nueva categoría de instrumentos musicales en el catálogo del sistema.

**Cuerpo de la solicitud:**

```json
{
  "code": "CAT-01",
  "name": "Cuerdas"
}
```

**Validaciones:**

- `code` es obligatorio.
- `code` debe tener una longitud máxima de 20 caracteres.
- `code` debe ser único.
- `name` es obligatorio.
- `name` debe tener una longitud máxima de 100 caracteres.
- No se deben registrar categorías con códigos duplicados.

**Respuesta exitosa:**

Código HTTP: `201 Created`

```json
{
  "mensaje": "Categoría registrada correctamente.",
  "datos": {
    "id": 1,
    "code": "CAT-01",
    "name": "Cuerdas"
  }
}
```

**Respuestas de error:**

- `409 Conflict`: cuando el código de categoría ya existe.
- `422 Unprocessable Entity`: cuando los datos enviados no cumplen las reglas de validación.
- `500 Internal Server Error`: cuando ocurre un error inesperado en el servidor.
## 7. Endpoints de instrumentos

### 7.1. Consultar instrumentos

| Propiedad | Definición |
|---|---|
| Método | GET |
| Endpoint | `/instruments` |
| Descripción | Consultar el catálogo de instrumentos. |
| Respuesta exitosa | 200 OK |

Ejemplo de respuesta:

```json
{
  "mensaje": "Instrumentos consultados correctamente.",
  "datos": [
    {
      "id": 1,
      "category_id": 1,
      "code": "GTR-001",
      "name": "Guitarra acústica",
      "total_units": 5,
      "available_units": 3,
      "is_active": true
    }
  ]
}
```

### 7.2. Consultar un instrumento

| Propiedad | Definición |
|---|---|
| Método | GET |
| Endpoint | `/instruments/{id}` |
| Descripción | Consultar el detalle de un instrumento. |
| Respuesta exitosa | 200 OK |
| Error posible | 404 Not Found |

### 7.3. Registrar un instrumento

| Propiedad | Definición |
|---|---|
| Método | POST |
| Endpoint | `/instruments` |
| Descripción | Registrar un instrumento en el catálogo. |
| Respuesta exitosa | 201 Created |

Ejemplo de solicitud:

```json
{
  "category_id": 1,
  "code": "GTR-002",
  "name": "Guitarra eléctrica",
  "total_units": 4
}
```

Validaciones:

- La categoría debe existir.
- El código debe ser único.
- El nombre es obligatorio.
- El total de unidades debe ser un número entero igual o mayor que cero.
- Las unidades disponibles iniciales deberán corresponder con el total de unidades registradas.

### 7.4. Actualizar un instrumento

| Propiedad | Definición |
|---|---|
| Método | PUT |
| Endpoint | `/instruments/{id}` |
| Descripción | Actualizar la información de un instrumento. |
| Respuesta exitosa | 200 OK |

#### Ejemplo de solicitud

```json
{
  "category_id": 1,
  "code": "GTR-001",
  "name": "Guitarra acústica profesional",
  "total_units": 6
}
```

#### Validaciones

- El instrumento debe existir.
- La categoría indicada debe existir.
- El código debe ser único, excluyendo el registro que se está actualizando.
- El nombre es obligatorio.
- `total_units` debe ser un número entero mayor o igual a cero.
- El nuevo `total_units` no puede ser inferior a la cantidad de unidades que actualmente están prestadas.
- Cuando se actualice `total_units`, el backend deberá recalcular `available_units` conservando la cantidad de unidades prestadas. El cálculo será: `available_units = nuevo_total_units - unidades_prestadas`.
- La actualización deberá realizarse dentro de una transacción de base de datos para garantizar la integridad del inventario.
- La cantidad de unidades prestadas se obtiene mediante la diferencia entre las unidades totales actuales y las unidades disponibles actuales.
- `available_units` no debe modificarse directamente desde la solicitud del cliente; su actualización corresponde a las operaciones de préstamo y devolución gestionadas por el backend.
- El sistema debe conservar la integridad del inventario después de cualquier actualización.
- La actualización no debe modificar los datos históricos congelados en préstamos anteriores.

#### Respuesta exitosa

Código HTTP: `200 OK`.

La actualización deberá respetar las restricciones de inventario y conservar la información histórica de los préstamos existentes.

### 7.5. Dar de baja un instrumento

| Propiedad | Definición |
|---|---|
| Método | PATCH |
| Endpoint | `/instruments/{id}/deactivate` |
| Descripción | Realizar la baja lógica de un instrumento. |
| Respuesta exitosa | 200 OK |

La baja lógica deberá cambiar el estado de actividad del instrumento sin eliminar físicamente su registro.

Los instrumentos inactivos no deberán aparecer como disponibles ni permitir nuevos préstamos.

## 8. Endpoints de estudiantes

### 8.1. Consultar estudiantes

| Propiedad | Definición |
|---|---|
| Método | GET |
| Endpoint | `/students` |
| Descripción | Consultar los estudiantes registrados. |
| Respuesta exitosa | 200 OK |

### 8.2. Consultar un estudiante

| Propiedad | Definición |
|---|---|
| Método | GET |
| Endpoint | `/students/{id}` |
| Descripción | Consultar la información de un estudiante. |
| Respuesta exitosa | 200 OK |
| Error posible | 404 Not Found |

### 8.3. Registrar un estudiante

| Propiedad | Definición |
|---|---|
| Método | POST |
| Endpoint | `/students` |
| Descripción | Registrar un estudiante. |
| Respuesta exitosa | 201 Created |

Ejemplo de solicitud:

```json
{
  "student_code": "EST-001",
  "full_name": "Estudiante de prueba",
  "email": "estudiante@example.com"
}
```

Validaciones:

- El código del estudiante es obligatorio y único.
- El nombre completo es obligatorio.
- El correo electrónico debe tener un formato válido.

### 8.4. Actualizar un estudiante

| Propiedad | Definición |
|---|---|
| Método | PUT |
| Endpoint | `/students/{id}` |
| Descripción | Actualizar los datos de un estudiante. |
| Respuesta exitosa | 200 OK |

#### Ejemplo de solicitud

```json
{
  "student_code": "EST-001",
  "full_name": "Estudiante de prueba actualizado",
  "email": "estudiante.actualizado@example.com"
}
```

#### Validaciones

- El estudiante debe existir.
- El código del estudiante es obligatorio y único, excluyendo el registro que se está actualizando.
- El nombre completo es obligatorio.
- El correo electrónico debe tener un formato válido.
- El correo debe ser único, excluyendo el registro que se está actualizando.
- La actualización no debe modificar los datos históricos congelados en los préstamos anteriores.

#### Respuesta exitosa

Código HTTP: `200 OK`.

La actualización no deberá modificar los datos históricos congelados en los registros de préstamos.

## 9. Endpoints de préstamos

### 9.1. Consultar préstamos

| Propiedad | Definición |
|---|---|
| Método | GET |
| Endpoint | `/loans` |
| Descripción | Consultar los préstamos registrados. |
| Respuesta exitosa | 200 OK |

Los préstamos deberán permitir identificar su situación mediante los registros asociados de devoluciones y las fechas correspondientes.

### 9.2. Consultar un préstamo

| Propiedad | Definición |
|---|---|
| Método | GET |
| Endpoint | `/loans/{id}` |
| Descripción | Consultar el detalle de un préstamo. |
| Respuesta exitosa | 200 OK |
| Error posible | 404 Not Found |

### 9.3. Registrar un préstamo

| Propiedad | Definición |
|---|---|
| Método | POST |
| Endpoint | `/loans` |
| Descripción | Registrar el préstamo de un instrumento a un estudiante. |
| Respuesta exitosa | 201 Created |
| Conflicto posible | 409 Conflict |
| Error de validación | 422 Unprocessable Entity |

#### Respuesta exitosa

Cuando el préstamo se registre correctamente, el backend responderá con el código HTTP `201 Created`.

Ejemplo de respuesta:

```json
{
  "mensaje": "Préstamo registrado correctamente.",
  "datos": {
    "id": 1,
    "student_id": 1,
    "instrument_id": 1,
    "student_code_snapshot": "EST-001",
    "student_name_snapshot": "Estudiante de prueba",
    "instrument_code_snapshot": "GTR-001",
    "instrument_name_snapshot": "Guitarra acústica",
    "loaned_at": "2026-11-08T14:30:00Z",
    "due_at": "2026-11-29T14:30:00Z",
    "created_at": "2026-11-08T14:30:00Z"
  }
}
```

Los campos `student_code_snapshot`, `student_name_snapshot`, `instrument_code_snapshot` e `instrument_name_snapshot` conservarán la información del estudiante y del instrumento en el momento de registrar el préstamo.

Las fechas `loaned_at`, `due_at` y `created_at` deberán manejarse en UTC.

El estado del préstamo no se almacenará como un campo independiente. Se determinará mediante la existencia de una devolución asociada en la tabla `returns`, de acuerdo con lo establecido en `data-model.md`.

El backend deberá realizar las siguientes validaciones:

1. Verificar que el estudiante exista.
2. Verificar que el instrumento exista y esté activo.
3. Comprobar que el estudiante no tenga otro instrumento sin devolver.
4. Comprobar que el estudiante no tenga préstamos vencidos pendientes.
5. Verificar que existan unidades disponibles.
6. Aplicar el plazo de préstamo de 21 días.
7. Registrar la información histórica correspondiente.
8. Actualizar las unidades disponibles mediante una transacción.

El registro del préstamo deberá conservar una copia de los datos históricos definidos en `data-model.md`.

La fecha de préstamo y la fecha límite de devolución deberán manejarse en UTC.

### 9.4. Consultar préstamos de un estudiante

| Propiedad | Definición |
|---|---|
| Método | GET |
| Endpoint | `/students/{id}/loans` |
| Descripción | Consultar los préstamos asociados a un estudiante. |
| Respuesta exitosa | 200 OK |

### 9.5. Consultar préstamos vencidos

| Propiedad | Definición |
|---|---|
| Método | GET |
| Endpoint | `/loans/overdue` |
| Descripción | Consultar préstamos que superaron su fecha límite y no tienen devolución registrada. |
| Respuesta exitosa | 200 OK |

La condición de vencimiento deberá calcularse utilizando la fecha límite y la ausencia de un registro asociado en `returns`.

## 10. Endpoints de devoluciones

### 10.1. Registrar una devolución

| Propiedad | Definición |
|---|---|
| Método | POST |
| Endpoint | `/loans/{id}/returns` |
| Descripción | Registrar la devolución de un instrumento prestado. |
| Respuesta exitosa | 201 Created |
| Conflicto posible | 409 Conflict |

Ejemplo de solicitud:

```json
{}
```

El identificador del préstamo se enviará mediante la URL.

El backend deberá:

1. Verificar que el préstamo exista.
2. Iniciar una transacción de base de datos.
3. Bloquear el registro del préstamo mediante `lockForUpdate()`.
4. Verificar nuevamente que el préstamo no tenga una devolución registrada.
5. Bloquear el registro del instrumento asociado mediante `lockForUpdate()`.
6. Registrar la devolución con la fecha y hora actual en UTC.
7. Incrementar las unidades disponibles del instrumento en una sola unidad.
8. Verificar que las unidades disponibles no superen las unidades totales.
9. Confirmar la transacción mediante `COMMIT`.
10. Si ocurre algún error, cancelar la operación mediante `ROLLBACK`.

La creación del registro de devolución y el incremento de las unidades disponibles deberán ejecutarse dentro de la misma transacción de base de datos. Si cualquiera de estas operaciones falla, el backend deberá ejecutar `ROLLBACK` para revertir todos los cambios realizados. De esta manera, se evita registrar una devolución sin actualizar el inventario o incrementar las unidades disponibles sin registrar la devolución correspondiente.

La información original del préstamo deberá conservarse sin modificaciones.

**Control de concurrencia:**

Si dos operadores intentan registrar simultáneamente la devolución del mismo préstamo, el sistema debe permitir que solamente una operación se complete.

La segunda solicitud deberá verificar nuevamente el registro de devolución después de obtener el bloqueo y responder con `409 Conflict` si el préstamo ya fue devuelto.

La restricción `UNIQUE` del campo `loan_id` en la tabla `returns` debe actuar como protección adicional para impedir devoluciones duplicadas. Los conflictos por duplicidad deben manejarse y responderse como `409 Conflict`, no como un error interno `500`.

Si el préstamo ya fue devuelto, la operación deberá rechazarse y no deberá incrementar nuevamente el inventario.

### 10.2. Consultar una devolución

| Propiedad | Definición |
|---|---|
| Método | GET |
| Endpoint | `/loans/{id}/returns` |
| Descripción | Consultar la devolución asociada a un préstamo. |
| Respuesta exitosa | 200 OK |
| Error posible | 404 Not Found |

## 11. Endpoint del reporte de instrumentos más solicitados

### 11.1. Consultar instrumentos más solicitados

| Propiedad | Definición |
|---|---|
| Método | GET |
| Endpoint | `/reports/most-requested-instruments` |
| Descripción | Consultar el reporte de instrumentos más solicitados. |
| Respuesta exitosa | 200 OK |

Ejemplo de respuesta:

```json
{
  "mensaje": "Reporte generado correctamente.",
  "datos": [
    {
      "instrument_id": 1,
      "instrument_name": "Guitarra acústica",
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

El reporte deberá basarse en los registros históricos de préstamos y presentar los instrumentos ordenados según la cantidad de solicitudes registradas.

## 12. Reglas de negocio aplicadas por la API

La API deberá garantizar el cumplimiento de las siguientes reglas:

| Código | Regla | Comportamiento esperado |
|---|---|---|
| RN-01 | Máximo un instrumento sin devolver por estudiante. | Rechazar nuevos préstamos mientras exista uno pendiente. |
| RN-02 | Plazo de 21 días. | Calcular la fecha límite de devolución. |
| RN-03 | Bloqueo por préstamos vencidos. | Rechazar nuevos préstamos hasta registrar la devolución correspondiente. |
| RN-04 | Integridad del inventario. | Mantener las unidades disponibles entre cero y el total. |
| RN-05 | Conservación histórica. | No modificar los datos congelados de operaciones anteriores. |
| RN-06 | Conservación de registros. | No eliminar físicamente préstamos ni devoluciones; utilizar baja lógica para instrumentos. |

### 12.1 Concurrencia

El registro de préstamos debe ejecutarse dentro de una transacción de base de datos para garantizar la integridad de la información cuando varios monitores realizan operaciones simultáneamente.

El procedimiento debe seguir este orden:

1. Iniciar una transacción.
2. Bloquear el registro del estudiante mediante `lockForUpdate()`.
3. Verificar que el estudiante no tenga un préstamo pendiente ni préstamos vencidos sin devolver.
4. Bloquear el registro del instrumento mediante `lockForUpdate()`.
5. Verificar que el instrumento esté activo y tenga unidades disponibles.
6. Registrar el préstamo y actualizar las unidades disponibles dentro de la misma transacción.
7. Confirmar la transacción si todas las validaciones y operaciones se completan correctamente.
8. Ejecutar `rollback` si ocurre algún error durante el proceso.

**Control de concurrencia:**

Si dos monitores intentan registrar un préstamo de la última unidad disponible del mismo instrumento, la base de datos debe serializar las operaciones mediante el bloqueo de registros. El primer préstamo podrá completarse; el segundo deberá recibir una respuesta HTTP `409 Conflict` cuando compruebe que ya no existen unidades disponibles.

Las validaciones del estudiante también deben realizarse después de obtener su bloqueo, evitando que dos solicitudes simultáneas generen préstamos que incumplan las reglas de negocio.

Todos los procesos deben respetar el mismo orden de bloqueo para reducir el riesgo de interbloqueos (*deadlocks*).

## 13. Manejo de errores

La API deberá presentar mensajes claros en español.

Ejemplos:

| Situación | Código HTTP | Mensaje |
|---|---|---|
| Estudiante inexistente | 404 | El estudiante no existe. |
| Instrumento inexistente | 404 | El instrumento no existe. |
| Instrumento sin unidades disponibles | 409 | No hay unidades disponibles para este instrumento. |
| Estudiante con préstamo pendiente | 409 | El estudiante ya tiene un instrumento sin devolver. |
| Estudiante con préstamo vencido | 409 | El estudiante tiene préstamos vencidos pendientes. |
| Instrumento inactivo | 409 | No es posible prestar un instrumento dado de baja. |
| Préstamo ya devuelto | 409 | Este préstamo ya tiene una devolución registrada. |
| Datos incorrectos | 422 | Los datos proporcionados no son válidos. |
| Error interno | 500 | Ocurrió un error interno del servidor. |

## 14. Seguridad y validación

El backend será responsable de validar todas las solicitudes recibidas.

Se deberán aplicar los siguientes lineamientos:

- Validar los datos de entrada.
- Evitar que el frontend controle directamente las reglas de negocio.
- No permitir acceso directo a MySQL desde el frontend.
- Proteger las credenciales mediante variables de entorno.
- Evitar exponer información sensible en las respuestas.
- Utilizar transacciones para las operaciones que modifiquen el inventario.
- Mantener los mensajes visibles para el usuario en español.

Los mecanismos de autenticación y autorización deberán implementarse si están contemplados en el alcance aprobado del proyecto.

## 15. Relación con los demás documentos

| Documento | Relación |
|---|---|
| `constitution.md` | Establece los principios y restricciones del sistema. |
| `spec.md` | Define los requisitos funcionales, reglas de negocio y requisitos no funcionales. |
| `plan.md` | Organiza las fases de desarrollo. |
| `architecture.md` | Define los componentes y la comunicación arquitectónica. |
| `data-model.md` | Define las entidades, relaciones y estructuras de datos. |
| `tasks.md` | Organiza las actividades de implementación. |
| `adr/` | Registra las decisiones arquitectónicas. |

## 16. Criterios de aceptación

El contrato de API se considerará validado cuando:

1. Los endpoints estén definidos y correspondan con las funcionalidades del sistema.
2. Los métodos HTTP sean coherentes con las operaciones.
3. Las solicitudes y respuestas utilicen JSON.
4. Los códigos HTTP representen correctamente los resultados.
5. Las reglas de negocio se validen en el backend.
6. Las operaciones de préstamo y devolución protejan la integridad del inventario.
7. El control de concurrencia responda con HTTP 409 cuando corresponda.
8. Las fechas se manejen en UTC.
9. Los mensajes visibles para el usuario estén en español.
10. El contrato mantenga correspondencia con `spec.md`, `data-model.md` y `architecture.md`.

## 17. Control de cambios

| Versión | Fecha | Descripción | Estado |
|---|---|---|---|
| 1.0 | 08/11/2026 | Creación inicial del contrato de API REST de Music School. | Borrador para validación |
| 1.1 | 08/11/2026 | Incorporación del endpoint POST /categories, validaciones para mantener la integridad del inventario, control de concurrencia en las devoluciones y manejo de conflictos por operaciones duplicadas. | Borrador para validación |