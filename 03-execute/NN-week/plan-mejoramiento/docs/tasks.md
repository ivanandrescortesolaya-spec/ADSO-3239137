# Plan de tareas — Music School

**Identificador del proyecto:** music-school  
**Proyecto:** Sistema de prestamo de instrumentos musicales  
**Ficha:** 3239137  
**Identificacion del aprendiz:** A12  
**Version:** 1.3
**Estado:** Completado
**Fecha de actualizacion:** 13/11/2026

---

## 1. Proposito

Este documento establece la planificacion de las tareas necesarias para desarrollar el proyecto Music School, correspondiente al plan de mejoramiento.

Su finalidad es organizar el trabajo de desarrollo, establecer dependencias, definir criterios de aceptacion y facilitar el seguimiento de los avances y resultados obtenidos.

Cada tarea contara con un identificador unico, una descripcion, un componente asociado, los requisitos relacionados, sus dependencias, criterios de aceptacion y las evidencias correspondientes.

## 2. Alcance

El plan contempla las actividades necesarias para construir un sistema de prestamo de instrumentos musicales, incluyendo:

- Backend desarrollado con PHP y Laravel.
- Frontend desarrollado con React.
- Base de datos MySQL.
- Infraestructura mediante Docker Compose.
- Sitio publico estatico.
- Herramienta de siembra de datos mediante la API.
- Pruebas automatizadas.
- Documentacion tecnica y arquitectonica.

El sistema permitira administrar categorias, instrumentos, estudiantes, prestamos, devoluciones y reportes.

## 3. Organizacion de tareas

Las tareas se organizan en orden de ejecucion y segun las dependencias entre componentes. Se establecen exactamente 23 tareas para controlar el desarrollo y verificar el cumplimiento de los requisitos del proyecto.

### TASK-01 — Preparar la estructura del proyecto

- **Descripcion:** Crear y organizar la estructura inicial del proyecto Music School, separando la documentacion, el backend, el frontend, el sitio publico, la infraestructura y las herramientas auxiliares.
- **Componente:** Estructura del repositorio.
- **Requisitos relacionados:** Organizacion del proyecto y separacion de responsabilidades.
- **Dependencias:** Ninguna.
- **Criterios de aceptacion:**
  1. Existe la estructura de carpetas definida para el proyecto.
  2. Las carpetas `docs`, `api`, `app`, `page`, `infra` y `tool` estan ubicadas correctamente.
  3. La documentacion del plan de mejoramiento se encuentra dentro de `docs`.
  4. No se incluyen archivos sensibles como `.env` ni dependencias instaladas como `node_modules`.
- **Entregable o evidencia:** Estructura de carpetas del repositorio organizada y visible en Git.

### TASK-02 — Configurar el entorno de desarrollo

- **Descripcion:** Preparar las herramientas y configuraciones necesarias para desarrollar y ejecutar los componentes del sistema.
- **Componente:** Entorno de desarrollo.
- **Requisitos relacionados:** RNF de configuracion, ejecucion y mantenibilidad del proyecto.
- **Dependencias:** TASK-01.
- **Criterios de aceptacion:**
  1. Se encuentran definidas las herramientas necesarias para backend, frontend y base de datos.
  2. Las configuraciones de desarrollo estan documentadas.
  3. Las versiones y requisitos de ejecucion estan identificados.
  4. No se exponen credenciales ni informacion sensible.
- **Entregable o evidencia:** Configuracion inicial y documentacion del entorno.

### TASK-03 — Implementar el modelo de datos

- **Descripcion:** Crear la estructura logica de la base de datos para almacenar categorias, instrumentos, estudiantes, prestamos y devoluciones.
- **Componente:** Base de datos MySQL.
- **Requisitos relacionados:** RF de gestion de categorias, instrumentos, estudiantes, prestamos y devoluciones; reglas de integridad.
- **Dependencias:** TASK-01.
- **Criterios de aceptacion:**
  1. Se encuentran definidas las cinco entidades principales.
  2. Las relaciones y claves foraneas corresponden al modelo de datos.
  3. Se aplican restricciones de integridad.
  4. Los prestamos y devoluciones conservan su historial.
- **Entregable o evidencia:** Modelo de datos y estructura de tablas.

### TASK-04 — Configurar migraciones de Laravel

- **Descripcion:** Implementar las migraciones necesarias para crear y mantener la estructura de la base de datos desde Laravel.
- **Componente:** Backend y persistencia.
- **Requisitos relacionados:** Modelo de datos e integridad de la informacion.
- **Dependencias:** TASK-03.
- **Criterios de aceptacion:**
  1. Existen migraciones para las tablas definidas en el modelo de datos.
  2. Las claves primarias y foraneas estan configuradas.
  3. Se aplican las restricciones necesarias.
  4. Las migraciones pueden ejecutarse correctamente.
- **Entregable o evidencia:** Archivos de migracion y ejecucion satisfactoria.

### TASK-05 — Configurar la conexion a MySQL

- **Descripcion:** Configurar la conexion entre Laravel y la base de datos MySQL mediante variables de entorno y parametros de conexion.
- **Componente:** Backend y base de datos.
- **Requisitos relacionados:** Persistencia y disponibilidad de los datos.
- **Dependencias:** TASK-02, TASK-04.
- **Criterios de aceptacion:**
  1. Laravel establece conexion con MySQL.
  2. Las credenciales se gestionan mediante variables de entorno.
  3. No se publican credenciales en el repositorio.
  4. La aplicacion puede consultar la base de datos.
- **Entregable o evidencia:** Configuracion de conexion y prueba de acceso a MySQL.

### TASK-06 — Implementar la gestion de categorias

- **Descripcion:** Desarrollar las operaciones necesarias para consultar y administrar las categorias de instrumentos musicales.
- **Componente:** API Laravel.
- **Requisitos relacionados:** Gestion de categorias y categorias iniciales CAT-01 a CAT-05.
- **Dependencias:** TASK-04, TASK-05.
- **Criterios de aceptacion:**
  1. Se pueden consultar las categorias registradas.
  2. Las cinco categorias iniciales estan identificadas mediante sus codigos.
  3. Los codigos de categoria no se duplican.
  4. Las respuestas de la API utilizan el formato JSON establecido.
- **Entregable o evidencia:** Endpoints de categorias y pruebas correspondientes.

### TASK-07 — Implementar la gestion de instrumentos

- **Descripcion:** Desarrollar las operaciones para registrar, consultar, actualizar y dar de baja instrumentos musicales.
- **Componente:** API Laravel.
- **Requisitos relacionados:** Gestion del catalogo, disponibilidad y baja logica de instrumentos.
- **Dependencias:** TASK-04, TASK-05, TASK-06.
- **Criterios de aceptacion:**
  1. Se pueden registrar instrumentos asociados a una categoria.
  2. Se pueden consultar instrumentos registrados.
  3. Se pueden actualizar los datos permitidos.
  4. La baja de instrumentos se realiza de forma logica.
  5. No se permite prestar instrumentos dados de baja.
  6. Las unidades disponibles no pueden ser negativas ni superar el total.
- **Entregable o evidencia:** Endpoints de instrumentos y pruebas correspondientes.

### TASK-08 — Implementar el control de unidades disponibles

- **Descripcion:** Desarrollar la logica que mantiene la disponibilidad de instrumentos de acuerdo con el total de unidades y los prestamos activos.
- **Componente:** Logica de negocio del backend.
- **Requisitos relacionados:** Control de inventario y regla de integridad de unidades.
- **Dependencias:** TASK-07.
- **Criterios de aceptacion:**
  1. La cantidad disponible se mantiene dentro del rango permitido.
  2. Al modificar el total se consideran las unidades actualmente prestadas.
  3. El backend calcula la disponibilidad y no depende de un valor enviado por el cliente.
  4. No se permite reducir el total por debajo de las unidades prestadas.
- **Entregable o evidencia:** Servicio de control de inventario y pruebas automatizadas.

### TASK-09 — Implementar la gestion de estudiantes

- **Descripcion:** Desarrollar las operaciones para registrar, consultar y actualizar la informacion de los estudiantes que utilizan el sistema.
- **Componente:** API Laravel.
- **Requisitos relacionados:** Gestion de estudiantes.
- **Dependencias:** TASK-04, TASK-05.
- **Criterios de aceptacion:**
  1. Se pueden registrar estudiantes.
  2. Se pueden consultar los estudiantes registrados.
  3. Se pueden actualizar los datos permitidos.
  4. Se aplican las validaciones de los campos obligatorios.
  5. Se evitan duplicados en los identificadores definidos.
- **Entregable o evidencia:** Endpoints de estudiantes y pruebas correspondientes.

### TASK-10 — Implementar el registro de prestamos

- **Descripcion:** Desarrollar la operacion para registrar prestamos de instrumentos asociados a estudiantes.
- **Componente:** API Laravel y logica de negocio.
- **Requisitos relacionados:** Gestion de prestamos, disponibilidad y plazo de 21 dias.
- **Dependencias:** TASK-07, TASK-08, TASK-09.
- **Criterios de aceptacion:**
  1. Se puede registrar un prestamo para un estudiante y un instrumento.
  2. Se verifica que el instrumento este activo y tenga unidades disponibles.
  3. Se verifica que el estudiante no tenga otro instrumento pendiente de devolucion.
  4. La fecha limite se calcula con un plazo de 21 dias.
  5. Se conservan los datos historicos de la operacion.
- **Entregable o evidencia:** Endpoint de creacion de prestamos y pruebas automatizadas.

### TASK-11 — Implementar las consultas de prestamos

- **Descripcion:** Desarrollar las operaciones para consultar los prestamos registrados, sus detalles y los prestamos asociados a cada estudiante.
- **Componente:** API Laravel.
- **Requisitos relacionados:** Consulta y seguimiento de prestamos.
- **Dependencias:** TASK-10.
- **Criterios de aceptacion:**
  1. Se pueden consultar los prestamos registrados.
  2. Se puede consultar el detalle de un prestamo.
  3. Se pueden consultar los prestamos de un estudiante.
  4. Se conserva la informacion historica de las operaciones.
  5. El estado del prestamo se determina segun la existencia de una devolucion y la fecha limite.
- **Entregable o evidencia:** Endpoints de consulta de prestamos y pruebas correspondientes.

### TASK-12 — Implementar el control de prestamos vencidos

- **Descripcion:** Desarrollar la logica para identificar prestamos cuya fecha limite haya pasado y que todavia no tengan una devolucion registrada.
- **Componente:** Logica de negocio del backend.
- **Requisitos relacionados:** Control de vencimientos y bloqueo de nuevos prestamos.
- **Dependencias:** TASK-10, TASK-11.
- **Criterios de aceptacion:**
  1. Se identifican los prestamos que superaron su fecha limite.
  2. Los prestamos devueltos no se consideran vencidos.
  3. Un estudiante con un prestamo vencido no puede registrar otro prestamo.
  4. La comparacion de fechas utiliza UTC.
- **Entregable o evidencia:** Consulta de prestamos vencidos y pruebas automatizadas.

### TASK-13 — Implementar el registro de devoluciones

- **Descripcion:** Desarrollar la operacion para registrar la devolucion de un instrumento prestado y actualizar su disponibilidad.
- **Componente:** API Laravel y logica de negocio.
- **Requisitos relacionados:** Gestion de devoluciones, historial y control de inventario.
- **Dependencias:** TASK-08, TASK-10.
- **Criterios de aceptacion:**
  1. Se puede registrar la devolucion de un prestamo existente.
  2. No se permite registrar dos devoluciones para el mismo prestamo.
  3. La disponibilidad se incrementa correctamente.
  4. La devolucion y la actualizacion de inventario se ejecutan dentro de una misma transaccion.
  5. Se conserva el historial de la devolucion.
- **Entregable o evidencia:** Endpoint de devoluciones y pruebas automatizadas.

### TASK-14 — Implementar las transacciones y el control de concurrencia

- **Descripcion:** Garantizar la integridad de las operaciones cuando varios operadores intenten prestar o devolver instrumentos simultaneamente.
- **Componente:** Backend y base de datos.
- **Requisitos relacionados:** Concurrencia, integridad de inventario y respuestas HTTP 409.
- **Dependencias:** TASK-10, TASK-13.
- **Criterios de aceptacion:**
  1. Las operaciones criticas utilizan transacciones.
  2. Se aplican bloqueos de registros cuando sea necesario.
  3. Se vuelve a comprobar la disponibilidad despues de obtener el bloqueo.
  4. Cuando dos operadores intentan prestar la ultima unidad, solo uno completa la operacion.
  5. La operacion que no puede completarse recibe HTTP 409.
  6. Los errores provocan la reversion de la transaccion correspondiente.
  
  **Estado:** En revision.

**Evidencias registradas:**
- Implementacion de transacciones en las operaciones de prestamos y devoluciones.
- Bloqueo de registros mediante `lockForUpdate()`.
- Revalidacion de disponibilidad despues de obtener el bloqueo.
- Prueba manual con dos solicitudes independientes.
- Primera solicitud: HTTP 201 Created.
- Segunda solicitud: HTTP 409 Conflict.
- Disponibilidad final del instrumento: 0 unidades.
- **Entregable o evidencia:** Implementacion transaccional y pruebas de concurrencia.

### TASK-15 — Implementar el reporte de instrumentos mas solicitados

- **Descripcion:** Desarrollar una consulta que permita identificar los instrumentos con mayor cantidad de solicitudes o prestamos registrados.
- **Componente:** API Laravel y reportes.
- **Requisitos relacionados:** Reporte de instrumentos mas solicitados.
- **Dependencias:** TASK-10, TASK-11.
- **Criterios de aceptacion:**
  1. Se contabilizan los prestamos registrados por instrumento.
  2. Los resultados se ordenan de mayor a menor cantidad de solicitudes.
  3. Se muestran los datos necesarios para identificar cada instrumento.
  4. La consulta utiliza informacion persistida en la base de datos.
- **Entregable o evidencia:** Endpoint del reporte y pruebas correspondientes.

### TASK-16 — Implementar validaciones y manejo de errores de la API

- **Descripcion:** Unificar las validaciones de entrada y las respuestas de error de los endpoints del sistema.
- **Componente:** API Laravel.
- **Requisitos relacionados:** Contrato API, validaciones y manejo de errores.
- **Dependencias:** TASK-06, TASK-07, TASK-09, TASK-10, TASK-13.
- **Criterios de aceptacion:**
  1. Se validan los campos obligatorios y sus formatos.
  2. Se utilizan los codigos HTTP definidos en el contrato.
  3. Los errores de validacion utilizan HTTP 422.
  4. Los recursos inexistentes utilizan HTTP 404.
  5. Los conflictos de negocio utilizan HTTP 409.
  6. Los mensajes dirigidos al usuario estan en español.
- **Entregable o evidencia:** Validaciones, respuestas estandarizadas y pruebas de errores.

### TASK-17 — Implementar el frontend en React

- **Descripcion:** Crear la aplicacion frontend que permita a los operadores interactuar con las funcionalidades del sistema.
- **Componente:** Aplicacion React.
- **Requisitos relacionados:** Interfaz de usuario y consumo de la API.
- **Dependencias:** TASK-01, TASK-02, TASK-16.
- **Criterios de aceptacion:**
  1. La aplicacion React inicia correctamente.
  2. Se encuentra organizada por componentes y vistas.
  3. Se establece la conexion con la API Laravel.
  4. Se manejan los estados de carga, error y respuesta.
  5. La interfaz presenta mensajes comprensibles en español.
- **Entregable o evidencia:** Aplicacion frontend ejecutable.

### TASK-18 — Implementar las vistas de administracion

- **Descripcion:** Construir las interfaces para gestionar categorias, instrumentos y estudiantes desde el frontend.
- **Componente:** Aplicacion React.
- **Requisitos relacionados:** Gestion del catalogo y estudiantes.
- **Dependencias:** TASK-06, TASK-07, TASK-09, TASK-17.
- **Criterios de aceptacion:**
  1. Existe una vista para consultar categorias.
  2. Existe una vista para consultar y administrar instrumentos.
  3. Existe una vista para consultar y administrar estudiantes.
  4. Los formularios validan los datos antes de enviarlos.
  5. Los cambios se reflejan mediante respuestas de la API.
- **Entregable o evidencia:** Vistas de administracion funcionales.

### TASK-19 — Implementar las vistas de prestamos y devoluciones

- **Descripcion:** Construir las interfaces que permitan registrar, consultar y gestionar prestamos y devoluciones de instrumentos.
- **Componente:** Aplicacion React.
- **Requisitos relacionados:** Gestion de prestamos, devoluciones y vencimientos.
- **Dependencias:** TASK-10, TASK-11, TASK-12, TASK-13, TASK-17.
- **Criterios de aceptacion:**
  1. Se pueden consultar los prestamos.
  2. Se pueden registrar nuevos prestamos.
  3. Se pueden consultar los prestamos vencidos.
  4. Se pueden registrar devoluciones.
  5. Se muestran mensajes de confirmacion y error.
- **Entregable o evidencia:** Vistas de prestamos y devoluciones funcionales.

### TASK-20 — Implementar el sitio publico estatico

- **Descripcion:** Construir el sitio publico estatico del proyecto Music School para presentar informacion general del sistema.
- **Componente:** Sitio publico.
- **Requisitos relacionados:** Sitio publico del proyecto y separacion del frontend administrativo.
- **Dependencias:** TASK-01, TASK-02.
- **Criterios de aceptacion:**
  1. Existe una pagina publica independiente de la aplicacion administrativa.
  2. Se presenta informacion general de Music School.
  3. Los recursos estaticos se cargan correctamente.
  4. El sitio puede ejecutarse desde la infraestructura definida.
- **Entregable o evidencia:** Sitio publico estatico funcional.

### TASK-21 — Implementar la herramienta de siembra de datos mediante API

- **Descripcion:** Crear una herramienta que permita cargar los datos iniciales del sistema mediante los endpoints de la API, sin acceder directamente a MySQL.
- **Componente:** Herramienta auxiliar.
- **Requisitos relacionados:** Inicializacion de datos y categorias CAT-01 a CAT-05.
- **Dependencias:** TASK-06, TASK-07, TASK-09, TASK-16.
- **Criterios de aceptacion:**
  1. La herramienta utiliza la API HTTP.
  2. No ejecuta consultas SQL directas sobre MySQL.
  3. Registra las cinco categorias iniciales.
  4. Evita duplicar registros cuando se ejecuta mas de una vez.
  5. Informa los resultados y errores de ejecucion.
- **Entregable o evidencia:** Herramienta de siembra y evidencia de ejecucion.

### TASK-22 — Configurar Docker Compose y la ejecucion integrada

- **Descripcion:** Configurar los servicios necesarios para ejecutar el sistema mediante Docker Compose, incluyendo base de datos, backend, frontend y sitio publico.
- **Componente:** Infraestructura.
- **Requisitos relacionados:** Despliegue local y ejecucion integrada del proyecto.
- **Dependencias:** TASK-05, TASK-17, TASK-20.
- **Criterios de aceptacion:**
  1. Existe un archivo Docker Compose con los servicios requeridos.
  2. Los servicios pueden iniciarse mediante un solo comando.
  3. El backend puede conectarse con MySQL dentro del entorno de contenedores.
  4. El frontend y el sitio publico pueden accederse desde el entorno local.
  5. La configuracion no expone credenciales sensibles.
- **Entregable o evidencia:** Configuracion Docker Compose y prueba de ejecucion integrada.

### TASK-23 — Ejecutar pruebas, documentar resultados y preparar la entrega

- **Descripcion:** Verificar el funcionamiento del sistema mediante pruebas automatizadas, revisar el cumplimiento de los requisitos y preparar las evidencias para la entrega y sustentacion.
- **Componente:** Calidad, documentacion y entrega.
- **Requisitos relacionados:** Historias de usuario, reglas de negocio, requisitos funcionales, requisitos no funcionales y contrato API.
- **Dependencias:** TASK-01 a TASK-22.
- **Criterios de aceptacion:**
  1. Se ejecutan pruebas automatizadas para las funcionalidades principales.
  2. Se cuenta con al menos 15 archivos de pruebas automatizadas.
  3. Se verifican las reglas de negocio de prestamos y devoluciones.
  4. Se comprueba el control de concurrencia y el conflicto HTTP 409.
  5. Se revisa la correspondencia entre requisitos, implementacion y pruebas.
  6. Se documentan los resultados y las evidencias.
  7. El proyecto puede ejecutarse para la sustentacion.
- **Entregable o evidencia:** Pruebas automatizadas, resultados, documentacion tecnica y evidencias de entrega.

### 3.1 Matriz de trazabilidad de tareas

La siguiente matriz relaciona las tareas tecnicas con las historias de usuario y los requisitos funcionales definidos en `spec.md`. Las reglas de negocio y los requisitos no funcionales aplicables se consultan en la matriz de trazabilidad de dicho documento.

| Tarea | Historia de usuario relacionada | Requisito funcional relacionado |
|---|---|---|
| TASK-01 | Transversal | Organizacion del proyecto |
| TASK-02 | Transversal | Preparacion del entorno |
| TASK-03 | HU-01 a HU-08 | RF-01 a RF-08 |
| TASK-04 | HU-01 a HU-08 | RF-01 a RF-08 |
| TASK-05 | Transversal | Persistencia de datos |
| TASK-06 | HU-01 | RF-01 |
| TASK-07 | HU-01, HU-02 | RF-01, RF-02 |
| TASK-08 | HU-01, HU-07 | RF-01, RF-07 |
| TASK-09 | HU-03 | RF-03 |
| TASK-10 | HU-04 | RF-04 |
| TASK-11 | HU-04, HU-06, HU-08 | RF-04, RF-06, RF-08 |
| TASK-12 | HU-04, HU-06 | RF-04, RF-06 |
| TASK-13 | HU-05 | RF-05 |
| TASK-14 | HU-04, HU-07, HU-10 | RF-04, RF-07, RF-10 |
| TASK-15 | HU-09 | RF-09 |
| TASK-16 | HU-01 a HU-10 | RF-01 a RF-10 |
| TASK-17 | Transversal | Interfaz y consumo de API |
| TASK-18 | HU-01, HU-02, HU-03 | RF-01, RF-02, RF-03 |
| TASK-19 | HU-04, HU-05, HU-06, HU-08 | RF-04, RF-05, RF-06, RF-08 |
| TASK-20 | Transversal | Sitio publico |
| TASK-21 | Transversal | Inicializacion de datos mediante API |
| TASK-22 | Transversal | Infraestructura y despliegue |
| TASK-23 | HU-01 a HU-10 | RF-01 a RF-10 |

**Nota de trazabilidad:** Las tareas transversales apoyan la estructura, infraestructura, interfaz, inicializacion de datos y verificacion general del proyecto. Las reglas de negocio RN-01 a RN-06 y los requisitos no funcionales RNF-01 a RNF-05 se deben verificar de acuerdo con su relacion definida en `spec.md`. Esta matriz representa la planificacion de cobertura y no constituye evidencia de implementacion o pruebas ejecutadas.

### 3.2 Orden de ejecucion y dependencias tecnicas

Las tareas se ejecutaran de acuerdo con sus dependencias tecnicas y funcionales. La siguiente organizacion establece una secuencia de referencia; las actividades podran desarrollarse en paralelo cuando sus dependencias esten satisfechas.

| Etapa | Tareas | Descripcion |
|---|---|---|
| 1. Preparacion | TASK-01, TASK-02 | Organizacion del repositorio y configuracion del entorno. |
| 2. Diseño de datos | TASK-03 | Definicion del modelo de datos y sus relaciones. |
| 3. Persistencia | TASK-04, TASK-05 | Creacion de migraciones y configuracion de la conexion con MySQL. TASK-05 requiere que TASK-04 este finalizada. |
| 4. Backend basico | TASK-06, TASK-07, TASK-09 | Gestion de categorias, instrumentos y estudiantes, respetando sus dependencias. |
| 5. Reglas de inventario | TASK-08 | Control de unidades totales y disponibles, despues de implementar la gestion de instrumentos. |
| 6. Operaciones principales | TASK-10, TASK-11, TASK-12, TASK-13 | Registro y consulta de prestamos, control de vencimientos y devoluciones, respetando las dependencias entre operaciones. |
| 7. Integridad y reportes | TASK-14, TASK-15, TASK-16 | Control de concurrencia, generacion de reportes, validaciones y manejo de errores. |
| 8. Interfaz y componentes complementarios | TASK-17, TASK-18, TASK-19, TASK-20, TASK-21 | Desarrollo de la aplicacion React, sus vistas, el sitio publico y la herramienta de siembra mediante API. |
| 9. Integracion y entrega | TASK-22, TASK-23 | Integracion mediante Docker Compose, ejecucion de pruebas y preparacion de la entrega. |

**Consideraciones sobre las dependencias**

1. TASK-01 debe completarse antes de organizar el entorno y los componentes del proyecto.
2. TASK-03 define el modelo que sirve de referencia para TASK-04.
3. TASK-05 requiere las migraciones de TASK-04 y la configuracion del entorno de TASK-02.
4. TASK-06, TASK-07 y TASK-09 pueden desarrollarse de forma independiente una vez disponibles la persistencia y la conexion a MySQL, respetando las dependencias especificas de cada tarea.
5. TASK-08 requiere TASK-07, mientras que TASK-10 requiere la gestion de instrumentos, disponibilidad y estudiantes.
6. Las consultas, vencimientos y devoluciones dependen de las operaciones de prestamos y de los componentes indicados en sus respectivas tareas.
7. Las vistas de React pueden desarrollarse progresivamente utilizando el contrato API como referencia, pero su integracion funcional requiere los endpoints correspondientes.
8. El sitio publico y la herramienta de siembra pueden desarrollarse de forma independiente cuando esten disponibles sus respectivos componentes y dependencias.
9. Docker Compose debe integrar los servicios requeridos y comprobarse antes de ejecutar la validacion final.
10. TASK-23 depende de la disponibilidad de los componentes que seran sometidos a pruebas y validacion.

**Nota:** Esta secuencia representa una planificacion tecnica. La ejecucion en paralelo esta permitida cuando no se incumplan las dependencias individuales. Ninguna tarea se considerara completada sin verificar sus criterios de aceptacion y conservar la evidencia correspondiente.

## 4. Registro y seguimiento de tareas

El seguimiento permitira controlar el avance de las 23 tareas definidas en este documento. Cada actividad debera actualizarse de acuerdo con su estado real y contar con evidencias que permitan verificar su cumplimiento.

### 4.1 Estados de las tareas

Se utilizaran los siguientes estados:

- **Pendiente:** La tarea todavia no ha comenzado.
- **En progreso:** La tarea se encuentra en desarrollo.
- **En revision:** La tarea esta terminada y pendiente de validacion.
- **Completada:** La tarea cumple todos sus criterios de aceptacion y cuenta con evidencias verificables.
- **Bloqueada:** La tarea no puede continuar debido a una dependencia o inconveniente identificado.



### 4.2 Matriz de seguimiento

La siguiente matriz permite realizar el seguimiento de las actividades del proyecto Music School. El estado de cada tarea se actualizara conforme se publiquen sus entregables en el repositorio GitHub.

**Resumen de publicacion**

| Indicador | Cantidad |
|:---|---:|
| Total de tareas | 23 |
| Completadas | 23 |
| Pendientes | 0 |

**Detalle de actividades**
| ID | Actividad | Estado | Evidencia |
|:---|:---|:---:|:---|
| TASK-01 | Preparacion de la estructura del proyecto | Completada | `docs/` |
| TASK-02 | Configuracion del entorno | Completada | `infra/, api/, app/` |
| TASK-03 | Diseño del modelo de datos | Completada | `docs/data-model.md` |
| TASK-04 | Creacion de migraciones | Completada | `api/database/migrations/` |
| TASK-05 | Conexion con MySQL | Completada | `infra/docker-compose.yml` |
| TASK-06 | API de categorias | Completada | `api/tests/Feature/CategoryTest.php` |
| TASK-07 | API de instrumentos | Completada | `api/tests/Feature/InstrumentTest.php` |
| TASK-08 | Control de inventario | Completada | `api/tests/Feature/InstrumentManagementTest.php` |
| TASK-09 | API de estudiantes | Completada | `api/tests/Feature/StudentTest.php` |
| TASK-10 | Registro de prestamos | Completada | `api/tests/Feature/LoanTest.php` |
| TASK-11 | Consultas de prestamos | Completada | `api/tests/Feature/LoanQueryTest.php, api/tests/Feature/StudentLoanHistoryTest.php` |
| TASK-12 | Consulta de prestamos vencidos | Completada | `api/tests/Feature/OverdueLoanTest.php` |
| TASK-13 | Registro de devoluciones | Completada | `api/tests/Feature/ReturnEndpointTest.php` |
| TASK-14 | Control de concurrencia | Completada | `docs/tasks.md, docs/evidence.md` |
| TASK-15 | Reporte de instrumentos solicitados | Completada | `api/tests/Feature/ReportTest.php` |
| TASK-16 | Validaciones y manejo de errores | Completada | `api/tests/Feature/, docs/api-contract.md` |
| TASK-17 | Desarrollo del frontend React | Completada | `app/` |
| TASK-18 | Vistas administrativas | Completada | `app/` |
| TASK-19 | Gestion visual de prestamos y devoluciones | Completada | `app/` |
| TASK-20 | Sitio web publico | Completada | `page/, infra/docker-compose.yml` |
| TASK-21 | Herramienta de inicializacion de datos | Completada | `tool/, docs/evidence.md` |
| TASK-22 | Integracion con Docker Compose | Completada | `infra/docker-compose.yml` |
| TASK-23 | Pruebas, documentacion y entrega | Completada | `api/tests/, docs/evidence.md` |
**Responsable:** Aprendiz A12.

**Criterio de actualizacion:** una tarea cambiara a Completada cuando sus archivos y entregables correspondientes hayan sido publicados en GitHub y se haya verificado su contenido.


### 4.3 Reglas para actualizar el seguimiento

1. Una tarea cambiara de estado unicamente cuando exista un avance real.
2. La fecha de inicio correspondera al dia en que comience su ejecucion.
3. La fecha de finalizacion correspondera al dia en que se verifiquen sus criterios de aceptacion.
4. Las evidencias deberan permitir identificar el resultado de la tarea.
5. Si una tarea queda bloqueada, se documentara el motivo y la dependencia que impide continuar.
6. Los cambios de estado deberan mantenerse coherentes con el historial de trabajo del repositorio.

### 4.4 Revision del avance

El avance general se calculara tomando como referencia las tareas completadas y el total de tareas planificadas.

**Formula:**

Porcentaje de avance = (Numero de tareas completadas / 23) × 100

Una tarea solo contara como completada cuando cumpla sus criterios de aceptacion y tenga evidencia verificable.



## 5. Evidencias de cumplimiento

Las evidencias podran incluir:

- Archivos de codigo fuente.
- Archivos de configuracion.
- Migraciones y modelos de datos.
- Endpoints y respuestas de la API.
- Capturas de ejecucion.
- Resultados de pruebas automatizadas.
- Commits del repositorio.
- Documentacion tecnica.
- Ejecucion del proyecto mediante Docker Compose.

Las evidencias deberan corresponder con la tarea realizada y permitir comprobar su cumplimiento.

## 6. Dependencias y orden de ejecucion

Las tareas se desarrollaran considerando sus dependencias tecnicas. No se debera iniciar una actividad que requiera una funcionalidad previa que todavia no este disponible, salvo que se trate de trabajo independiente que no comprometa su validacion.

La organizacion propuesta permite avanzar desde la preparacion del repositorio y la base de datos hasta la implementacion del backend, frontend, infraestructura, pruebas y entrega.

## 7. Control de cambios

| Version | Fecha | Descripcion |
|---|---|---|
| 1.0 | 08/11/2026 | Creacion inicial del plan de tareas con 23 actividades y sus criterios de aceptacion. |
| 1.2 | 09/11/2026 | Actualizacion de la estructura real del repositorio y del diagrama de arquitectura logica, incluyendo Dashboard, servicios y herramienta de inicializacion.	En revision. |

---

| 1.3 | 13/11/2026 | Cierre de las 23 tareas, validacion de pruebas automatizadas y actualizacion de evidencias. |

---

**Fin del documento.**