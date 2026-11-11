# Contrato de API REST — Music School

**Identificador:** music-school  
**Proyecto:** Sistema de prestamo de instrumentos musicales  
**Ficha:** ADSO 3239137  
**Codigo del aprendiz:** A12  
**Version:** 1.1
**Estado:** Borrador para validacion

---

## 1. Proposito

El presente documento establece el contrato de comunicacion entre el frontend desarrollado con React y el backend desarrollado con PHP y Laravel para el sistema Music School.

Define los endpoints, metodos HTTP, parametros, estructuras de solicitudes, respuestas, codigos de estado y validaciones necesarias para garantizar una comunicacion uniforme entre los componentes del sistema.

El contrato debera respetar los requisitos establecidos en `spec.md`, las estructuras de datos definidas en `data-model.md` y las decisiones arquitectonicas documentadas en `architecture.md`.

## 2. Alcance

La API REST permitira realizar las siguientes operaciones:

- Consultar categorias de instrumentos.
- Gestionar instrumentos.
- Consultar y gestionar estudiantes.
- Registrar prestamos.
- Consultar prestamos e historial.
- Registrar devoluciones.
- Consultar prestamos vencidos.
- Consultar unidades disponibles.
- Generar el reporte de instrumentos mas solicitados.
- Inicializar informacion de prueba mediante solicitudes a la API.

La API sera el mecanismo de comunicacion entre el frontend y el backend. El frontend no tendra acceso directo a la base de datos.

### 2.1. Herramienta de siembra de datos

El proyecto contara con una herramienta de siembra ubicada en la carpeta `tool/`, cuya responsabilidad sera inicializar informacion de prueba mediante solicitudes HTTP a los endpoints de la API REST.

La herramienta no debera conectarse directamente a MySQL ni ejecutar consultas SQL sobre la base de datos.

La informacion inicial debera contemplar las siguientes cinco categorias:

| Codigo | Categoria |
|---|---|
| CAT-01 | Cuerdas |
| CAT-02 | Vientos |
| CAT-03 | Percusion |
| CAT-04 | Teclados |
| CAT-05 | Electronicos |

La herramienta podra utilizar los endpoints de la API para registrar las categorias, los instrumentos y los estudiantes necesarios para las pruebas del sistema.

El proceso debera respetar las validaciones del backend y las restricciones de integridad definidas en `data-model.md`.

La siembra debera evitar duplicar registros cuando se ejecute mas de una vez, utilizando los codigos unicos definidos para identificar los datos iniciales.

La herramienta debera permitir preparar un conjunto de datos de prueba para validar las consultas del catalogo, los prestamos, las devoluciones y los reportes.

## 3. Caracteristicas generales

| Caracteristica | Definicion |
|---|---|
| Estilo de comunicacion | API REST |
| Protocolo | HTTP |
| Formato de intercambio | JSON |
| Backend | PHP y Laravel |
| Frontend | React |
| Base de datos | MySQL |
| Codificacion | UTF-8 |
| Fechas | UTC |
| Idioma de mensajes | Español |
| Identificadores del codigo | Ingles |

### 3.1. URL base

Durante el desarrollo local, la API utilizara la siguiente direccion base:

`http://localhost:8000/api`

**Nota de configuracion:** El puerto `8000` se establece como valor provisional para el entorno local. Se debera verificar y ajustar segun el mapeo de puertos definido en `infra/docker-compose.yml` durante la configuracion de la infraestructura.

### 3.2. Encabezados HTTP

Las solicitudes que envien informacion en formato JSON deberan utilizar:

```http
Content-Type: application/json
Accept: application/json
```

## 4. Convenciones de respuesta

Las respuestas de la API deberan utilizar estructuras JSON uniformes.

### 4.1. Respuesta exitosa

Ejemplo:

```json
{
  "mensaje": "Operacion realizada correctamente.",
  "datos": {
    "id": 1
  }
}
```

### 4.2. Respuesta de error

Ejemplo:

```json
{
  "mensaje": "No fue posible completar la operacion.",
  "errores": {}
}
```

### 4.3. Respuesta de validacion

Ejemplo:

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

## 5. Codigos de estado HTTP

| Codigo | Nombre | Uso |
|---|---|---|
| 200 | OK | Consulta u operacion exitosa. |
| 201 | Created | Registro creado correctamente. |
| 204 | No Content | Operacion exitosa sin contenido de respuesta. |
| 400 | Bad Request | Solicitud incorrecta. |
| 404 | Not Found | Recurso no encontrado. |
| 409 | Conflict | Conflicto con las reglas de negocio o disponibilidad. |
| 422 | Unprocessable Entity | Error de validacion de los datos. |
| 500 | Internal Server Error | Error interno del servidor. |

El backend debera utilizar los codigos HTTP de acuerdo con el resultado de cada operacion.

## 6. Endpoints de categorias

### 6.1. Consultar categorias

| Propiedad | Definicion |
|---|---|
| Metodo | GET |
| Endpoint | `/categories` |
| Descripcion | Consultar las categorias de instrumentos. |
| Respuesta exitosa | 200 OK |

Ejemplo de respuesta:

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

Las cinco categorias iniciales deberan estar disponibles para la clasificacion de instrumentos.

### 6.2. Registrar una categoria

**Endpoint:**

```http
POST /categories
```

**Descripcion:**

Permite registrar una nueva categoria de instrumentos musicales en el catalogo del sistema.

**Cuerpo de la solicitud:**

```json
{
  "code": "CAT-01",
  "name": "Cuerdas"
}
```

**Validaciones:**

- `code` es obligatorio.
- `code` debe tener una longitud maxima de 20 caracteres.
- `code` debe ser unico.
- `name` es obligatorio.
- `name` debe tener una longitud maxima de 100 caracteres.
- No se deben registrar categorias con codigos duplicados.

**Respuesta exitosa:**

Codigo HTTP: `201 Created`

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

**Respuestas de error:**

- `409 Conflict`: cuando el codigo de categoria ya existe.
- `422 Unprocessable Entity`: cuando los datos enviados no cumplen las reglas de validacion.
- `500 Internal Server Error`: cuando ocurre un error inesperado en el servidor.
## 7. Endpoints de instrumentos

### 7.1. Consultar instrumentos

| Propiedad | Definicion |
|---|---|
| Metodo | GET |
| Endpoint | `/instruments` |
| Descripcion | Consultar el catalogo de instrumentos. |
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
      "name": "Guitarra acustica",
      "total_units": 5,
      "available_units": 3,
      "is_active": true
    }
  ]
}
```

### 7.2. Consultar un instrumento

| Propiedad | Definicion |
|---|---|
| Metodo | GET |
| Endpoint | `/instruments/{id}` |
| Descripcion | Consultar el detalle de un instrumento. |
| Respuesta exitosa | 200 OK |
| Error posible | 404 Not Found |

### 7.3. Registrar un instrumento

| Propiedad | Definicion |
|---|---|
| Metodo | POST |
| Endpoint | `/instruments` |
| Descripcion | Registrar un instrumento en el catalogo. |
| Respuesta exitosa | 201 Created |

Ejemplo de solicitud:

```json
{
  "category_id": 1,
  "code": "GTR-002",
  "name": "Guitarra electrica",
  "total_units": 4
}
```

Validaciones:

- La categoria debe existir.
- El codigo debe ser unico.
- El nombre es obligatorio.
- El total de unidades debe ser un numero entero igual o mayor que cero.
- Las unidades disponibles iniciales deberan corresponder con el total de unidades registradas.

### 7.4. Actualizar un instrumento

| Propiedad | Definicion |
|---|---|
| Metodo | PUT |
| Endpoint | `/instruments/{id}` |
| Descripcion | Actualizar la informacion de un instrumento. |
| Respuesta exitosa | 200 OK |

#### Ejemplo de solicitud

```json
{
  "category_id": 1,
  "code": "GTR-001",
  "name": "Guitarra acustica profesional",
  "total_units": 6
}
```

#### Validaciones

- El instrumento debe existir.
- La categoria indicada debe existir.
- El codigo debe ser unico, excluyendo el registro que se esta actualizando.
- El nombre es obligatorio.
- `total_units` debe ser un numero entero mayor o igual a cero.
- El nuevo `total_units` no puede ser inferior a la cantidad de unidades que actualmente estan prestadas.
- Cuando se actualice `total_units`, el backend debera recalcular `available_units` conservando la cantidad de unidades prestadas. El calculo sera: `available_units = nuevo_total_units - unidades_prestadas`.
- La actualizacion debera realizarse dentro de una transaccion de base de datos para garantizar la integridad del inventario.
- La cantidad de unidades prestadas se obtiene mediante la diferencia entre las unidades totales actuales y las unidades disponibles actuales.
- `available_units` no debe modificarse directamente desde la solicitud del cliente; su actualizacion corresponde a las operaciones de prestamo y devolucion gestionadas por el backend.
- El sistema debe conservar la integridad del inventario despues de cualquier actualizacion.
- La actualizacion no debe modificar los datos historicos congelados en prestamos anteriores.

#### Respuesta exitosa

Codigo HTTP: `200 OK`.

La actualizacion debera respetar las restricciones de inventario y conservar la informacion historica de los prestamos existentes.

### 7.5. Dar de baja un instrumento

| Propiedad | Definicion |
|---|---|
| Metodo | PATCH |
| Endpoint | `/instruments/{id}/deactivate` |
| Descripcion | Realizar la baja logica de un instrumento. |
| Respuesta exitosa | 200 OK |

La baja logica debera cambiar el estado de actividad del instrumento sin eliminar fisicamente su registro.

Los instrumentos inactivos no deberan aparecer como disponibles ni permitir nuevos prestamos.

## 8. Endpoints de estudiantes

### 8.1. Consultar estudiantes

| Propiedad | Definicion |
|---|---|
| Metodo | GET |
| Endpoint | `/students` |
| Descripcion | Consultar los estudiantes registrados. |
| Respuesta exitosa | 200 OK |

### 8.2. Consultar un estudiante

| Propiedad | Definicion |
|---|---|
| Metodo | GET |
| Endpoint | `/students/{id}` |
| Descripcion | Consultar la informacion de un estudiante. |
| Respuesta exitosa | 200 OK |
| Error posible | 404 Not Found |

### 8.3. Registrar un estudiante

| Propiedad | Definicion |
|---|---|
| Metodo | POST |
| Endpoint | `/students` |
| Descripcion | Registrar un estudiante. |
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

- El codigo del estudiante es obligatorio y unico.
- El nombre completo es obligatorio.
- El correo electronico debe tener un formato valido.

### 8.4. Actualizar un estudiante

| Propiedad | Definicion |
|---|---|
| Metodo | PUT |
| Endpoint | `/students/{id}` |
| Descripcion | Actualizar los datos de un estudiante. |
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
- El codigo del estudiante es obligatorio y unico, excluyendo el registro que se esta actualizando.
- El nombre completo es obligatorio.
- El correo electronico debe tener un formato valido.
- El correo debe ser unico, excluyendo el registro que se esta actualizando.
- La actualizacion no debe modificar los datos historicos congelados en los prestamos anteriores.

#### Respuesta exitosa

Codigo HTTP: `200 OK`.

La actualizacion no debera modificar los datos historicos congelados en los registros de prestamos.

## 9. Endpoints de prestamos

### 9.1. Consultar prestamos

| Propiedad | Definicion |
|---|---|
| Metodo | GET |
| Endpoint | `/loans` |
| Descripcion | Consultar los prestamos registrados. |
| Respuesta exitosa | 200 OK |

Los prestamos deberan permitir identificar su situacion mediante los registros asociados de devoluciones y las fechas correspondientes.

### 9.2. Consultar un prestamo

| Propiedad | Definicion |
|---|---|
| Metodo | GET |
| Endpoint | `/loans/{id}` |
| Descripcion | Consultar el detalle de un prestamo. |
| Respuesta exitosa | 200 OK |
| Error posible | 404 Not Found |

### 9.3. Registrar un prestamo

| Propiedad | Definicion |
|---|---|
| Metodo | POST |
| Endpoint | `/loans` |
| Descripcion | Registrar el prestamo de un instrumento a un estudiante. |
| Respuesta exitosa | 201 Created |
| Conflicto posible | 409 Conflict |
| Error de validacion | 422 Unprocessable Entity |

#### Respuesta exitosa

Cuando el prestamo se registre correctamente, el backend respondera con el codigo HTTP `201 Created`.

Ejemplo de respuesta:

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

Los campos `student_code_snapshot`, `student_name_snapshot`, `instrument_code_snapshot` e `instrument_name_snapshot` conservaran la informacion del estudiante y del instrumento en el momento de registrar el prestamo.

Las fechas `loaned_at`, `due_at` y `created_at` deberan manejarse en UTC.

El estado del prestamo no se almacenara como un campo independiente. Se determinara mediante la existencia de una devolucion asociada en la tabla `returns`, de acuerdo con lo establecido en `data-model.md`.

El backend debera realizar las siguientes validaciones:

1. Verificar que el estudiante exista.
2. Verificar que el instrumento exista y este activo.
3. Comprobar que el estudiante no tenga otro instrumento sin devolver.
4. Comprobar que el estudiante no tenga prestamos vencidos pendientes.
5. Verificar que existan unidades disponibles.
6. Aplicar el plazo de prestamo de 21 dias.
7. Registrar la informacion historica correspondiente.
8. Actualizar las unidades disponibles mediante una transaccion.

El registro del prestamo debera conservar una copia de los datos historicos definidos en `data-model.md`.

La fecha de prestamo y la fecha limite de devolucion deberan manejarse en UTC.

### 9.4. Consultar prestamos de un estudiante

| Propiedad | Definicion |
|---|---|
| Metodo | GET |
| Endpoint | `/students/{id}/loans` |
| Descripcion | Consultar los prestamos asociados a un estudiante. |
| Respuesta exitosa | 200 OK |

### 9.5. Consultar prestamos vencidos

| Propiedad | Definicion |
|---|---|
| Metodo | GET |
| Endpoint | `/loans/overdue` |
| Descripcion | Consultar prestamos que superaron su fecha limite y no tienen devolucion registrada. |
| Respuesta exitosa | 200 OK |

La condicion de vencimiento debera calcularse utilizando la fecha limite y la ausencia de un registro asociado en `returns`.

## 10. Endpoints de devoluciones

### 10.1. Registrar una devolucion

| Propiedad | Definicion |
|---|---|
| Metodo | POST |
| Endpoint | `/loans/{id}/returns` |
| Descripcion | Registrar la devolucion de un instrumento prestado. |
| Respuesta exitosa | 201 Created |
| Conflicto posible | 409 Conflict |

Ejemplo de solicitud:

```json
{}
```

El identificador del prestamo se enviara mediante la URL.

El backend debera:

1. Verificar que el prestamo exista.
2. Iniciar una transaccion de base de datos.
3. Bloquear el registro del prestamo mediante `lockForUpdate()`.
4. Verificar nuevamente que el prestamo no tenga una devolucion registrada.
5. Bloquear el registro del instrumento asociado mediante `lockForUpdate()`.
6. Registrar la devolucion con la fecha y hora actual en UTC.
7. Incrementar las unidades disponibles del instrumento en una sola unidad.
8. Verificar que las unidades disponibles no superen las unidades totales.
9. Confirmar la transaccion mediante `COMMIT`.
10. Si ocurre algun error, cancelar la operacion mediante `ROLLBACK`.

La creacion del registro de devolucion y el incremento de las unidades disponibles deberan ejecutarse dentro de la misma transaccion de base de datos. Si cualquiera de estas operaciones falla, el backend debera ejecutar `ROLLBACK` para revertir todos los cambios realizados. De esta manera, se evita registrar una devolucion sin actualizar el inventario o incrementar las unidades disponibles sin registrar la devolucion correspondiente.

La informacion original del prestamo debera conservarse sin modificaciones.

**Control de concurrencia:**

Si dos operadores intentan registrar simultaneamente la devolucion del mismo prestamo, el sistema debe permitir que solamente una operacion se complete.

La segunda solicitud debera verificar nuevamente el registro de devolucion despues de obtener el bloqueo y responder con `409 Conflict` si el prestamo ya fue devuelto.

La restriccion `UNIQUE` del campo `loan_id` en la tabla `returns` debe actuar como proteccion adicional para impedir devoluciones duplicadas. Los conflictos por duplicidad deben manejarse y responderse como `409 Conflict`, no como un error interno `500`.

Si el prestamo ya fue devuelto, la operacion debera rechazarse y no debera incrementar nuevamente el inventario.

### 10.2. Consultar una devolucion

| Propiedad | Definicion |
|---|---|
| Metodo | GET |
| Endpoint | `/loans/{id}/returns` |
| Descripcion | Consultar la devolucion asociada a un prestamo. |
| Respuesta exitosa | 200 OK |
| Error posible | 404 Not Found |

## 11. Endpoint del reporte de instrumentos mas solicitados

### 11.1. Consultar instrumentos mas solicitados

| Propiedad | Definicion |
|---|---|
| Metodo | GET |
| Endpoint | `/reports/most-requested-instruments` |
| Descripcion | Consultar el reporte de instrumentos mas solicitados. |
| Respuesta exitosa | 200 OK |

Ejemplo de respuesta:

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

El reporte debera basarse en los registros historicos de prestamos y presentar los instrumentos ordenados segun la cantidad de solicitudes registradas.

## 12. Reglas de negocio aplicadas por la API

La API debera garantizar el cumplimiento de las siguientes reglas:

| Codigo | Regla | Comportamiento esperado |
|---|---|---|
| RN-01 | Maximo un instrumento sin devolver por estudiante. | Rechazar nuevos prestamos mientras exista uno pendiente. |
| RN-02 | Plazo de 21 dias. | Calcular la fecha limite de devolucion. |
| RN-03 | Bloqueo por prestamos vencidos. | Rechazar nuevos prestamos hasta registrar la devolucion correspondiente. |
| RN-04 | Integridad del inventario. | Mantener las unidades disponibles entre cero y el total. |
| RN-05 | Conservacion historica. | No modificar los datos congelados de operaciones anteriores. |
| RN-06 | Conservacion de registros. | No eliminar fisicamente prestamos ni devoluciones; utilizar baja logica para instrumentos. |

### 12.1 Concurrencia

El registro de prestamos debe ejecutarse dentro de una transaccion de base de datos para garantizar la integridad de la informacion cuando varios monitores realizan operaciones simultaneamente.

El procedimiento debe seguir este orden:

1. Iniciar una transaccion.
2. Bloquear el registro del estudiante mediante `lockForUpdate()`.
3. Verificar que el estudiante no tenga un prestamo pendiente ni prestamos vencidos sin devolver.
4. Bloquear el registro del instrumento mediante `lockForUpdate()`.
5. Verificar que el instrumento este activo y tenga unidades disponibles.
6. Registrar el prestamo y actualizar las unidades disponibles dentro de la misma transaccion.
7. Confirmar la transaccion si todas las validaciones y operaciones se completan correctamente.
8. Ejecutar `rollback` si ocurre algun error durante el proceso.

**Control de concurrencia:**

Si dos monitores intentan registrar un prestamo de la ultima unidad disponible del mismo instrumento, la base de datos debe serializar las operaciones mediante el bloqueo de registros. El primer prestamo podra completarse; el segundo debera recibir una respuesta HTTP `409 Conflict` cuando compruebe que ya no existen unidades disponibles.

Las validaciones del estudiante tambien deben realizarse despues de obtener su bloqueo, evitando que dos solicitudes simultaneas generen prestamos que incumplan las reglas de negocio.

Todos los procesos deben respetar el mismo orden de bloqueo para reducir el riesgo de interbloqueos (*deadlocks*).

## 13. Manejo de errores

La API debera presentar mensajes claros en español.

Ejemplos:

| Situacion | Codigo HTTP | Mensaje |
|---|---|---|
| Estudiante inexistente | 404 | El estudiante no existe. |
| Instrumento inexistente | 404 | El instrumento no existe. |
| Instrumento sin unidades disponibles | 409 | No hay unidades disponibles para este instrumento. |
| Estudiante con prestamo pendiente | 409 | El estudiante ya tiene un instrumento sin devolver. |
| Estudiante con prestamo vencido | 409 | El estudiante tiene prestamos vencidos pendientes. |
| Instrumento inactivo | 409 | No es posible prestar un instrumento dado de baja. |
| Prestamo ya devuelto | 409 | Este prestamo ya tiene una devolucion registrada. |
| Datos incorrectos | 422 | Los datos proporcionados no son validos. |
| Error interno | 500 | Ocurrio un error interno del servidor. |

## 14. Seguridad y validacion

El backend sera responsable de validar todas las solicitudes recibidas.

Se deberan aplicar los siguientes lineamientos:

- Validar los datos de entrada.
- Evitar que el frontend controle directamente las reglas de negocio.
- No permitir acceso directo a MySQL desde el frontend.
- Proteger las credenciales mediante variables de entorno.
- Evitar exponer informacion sensible en las respuestas.
- Utilizar transacciones para las operaciones que modifiquen el inventario.
- Mantener los mensajes visibles para el usuario en español.

Los mecanismos de autenticacion y autorizacion deberan implementarse si estan contemplados en el alcance aprobado del proyecto.

## 15. Relacion con los demas documentos

| Documento | Relacion |
|---|---|
| `constitution.md` | Establece los principios y restricciones del sistema. |
| `spec.md` | Define los requisitos funcionales, reglas de negocio y requisitos no funcionales. |
| `plan.md` | Organiza las fases de desarrollo. |
| `architecture.md` | Define los componentes y la comunicacion arquitectonica. |
| `data-model.md` | Define las entidades, relaciones y estructuras de datos. |
| `tasks.md` | Organiza las actividades de implementacion. |
| `adr/` | Registra las decisiones arquitectonicas. |

## 16. Criterios de aceptacion

El contrato de API se considerara validado cuando:

1. Los endpoints esten definidos y correspondan con las funcionalidades del sistema.
2. Los metodos HTTP sean coherentes con las operaciones.
3. Las solicitudes y respuestas utilicen JSON.
4. Los codigos HTTP representen correctamente los resultados.
5. Las reglas de negocio se validen en el backend.
6. Las operaciones de prestamo y devolucion protejan la integridad del inventario.
7. El control de concurrencia responda con HTTP 409 cuando corresponda.
8. Las fechas se manejen en UTC.
9. Los mensajes visibles para el usuario esten en español.
10. El contrato mantenga correspondencia con `spec.md`, `data-model.md` y `architecture.md`.

## 17. Control de cambios

| Version | Fecha | Descripcion | Estado |
|---|---|---|---|
| 1.0 | 08/11/2026 | Creacion inicial del contrato de API REST de Music School. | Borrador para validacion |
| 1.1 | 08/11/2026 | Incorporacion del endpoint POST /categories, validaciones para mantener la integridad del inventario, control de concurrencia en las devoluciones y manejo de conflictos por operaciones duplicadas. | Borrador para validacion |