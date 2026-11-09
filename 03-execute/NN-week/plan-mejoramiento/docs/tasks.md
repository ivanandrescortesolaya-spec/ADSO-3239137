# Plan de tareas — Music School

**Identificador del proyecto:** music-school  
**Proyecto:** Sistema de préstamo de instrumentos musicales  
**Ficha:** 3239137  
**Identificación del aprendiz:** A12  
**Versión:** 1.1
**Estado:** En ejecución y seguimiento
**Fecha de actualización:** 09/11/2026

---

## 1. Propósito

Este documento establece la planificación de las tareas necesarias para desarrollar el proyecto Music School, correspondiente al plan de mejoramiento.

Su finalidad es organizar el trabajo de desarrollo, establecer dependencias, definir criterios de aceptación y facilitar el seguimiento de los avances y resultados obtenidos.

Cada tarea contará con un identificador único, una descripción, un componente asociado, los requisitos relacionados, sus dependencias, criterios de aceptación y las evidencias correspondientes.

## 2. Alcance

El plan contempla las actividades necesarias para construir un sistema de préstamo de instrumentos musicales, incluyendo:

- Backend desarrollado con PHP y Laravel.
- Frontend desarrollado con React.
- Base de datos MySQL.
- Infraestructura mediante Docker Compose.
- Sitio público estático.
- Herramienta de siembra de datos mediante la API.
- Pruebas automatizadas.
- Documentación técnica y arquitectónica.

El sistema permitirá administrar categorías, instrumentos, estudiantes, préstamos, devoluciones y reportes.

## 3. Organización de tareas

Las tareas se organizan en orden de ejecución y según las dependencias entre componentes. Se establecen exactamente 23 tareas para controlar el desarrollo y verificar el cumplimiento de los requisitos del proyecto.

### TASK-01 — Preparar la estructura del proyecto

- **Descripción:** Crear y organizar la estructura inicial del proyecto Music School, separando la documentación, el backend, el frontend, el sitio público, la infraestructura y las herramientas auxiliares.
- **Componente:** Estructura del repositorio.
- **Requisitos relacionados:** Organización del proyecto y separación de responsabilidades.
- **Dependencias:** Ninguna.
- **Criterios de aceptación:**
  1. Existe la estructura de carpetas definida para el proyecto.
  2. Las carpetas `docs`, `api`, `app`, `page`, `infra` y `tool` están ubicadas correctamente.
  3. La documentación del plan de mejoramiento se encuentra dentro de `docs`.
  4. No se incluyen archivos sensibles como `.env` ni dependencias instaladas como `node_modules`.
- **Entregable o evidencia:** Estructura de carpetas del repositorio organizada y visible en Git.

### TASK-02 — Configurar el entorno de desarrollo

- **Descripción:** Preparar las herramientas y configuraciones necesarias para desarrollar y ejecutar los componentes del sistema.
- **Componente:** Entorno de desarrollo.
- **Requisitos relacionados:** RNF de configuración, ejecución y mantenibilidad del proyecto.
- **Dependencias:** TASK-01.
- **Criterios de aceptación:**
  1. Se encuentran definidas las herramientas necesarias para backend, frontend y base de datos.
  2. Las configuraciones de desarrollo están documentadas.
  3. Las versiones y requisitos de ejecución están identificados.
  4. No se exponen credenciales ni información sensible.
- **Entregable o evidencia:** Configuración inicial y documentación del entorno.

### TASK-03 — Implementar el modelo de datos

- **Descripción:** Crear la estructura lógica de la base de datos para almacenar categorías, instrumentos, estudiantes, préstamos y devoluciones.
- **Componente:** Base de datos MySQL.
- **Requisitos relacionados:** RF de gestión de categorías, instrumentos, estudiantes, préstamos y devoluciones; reglas de integridad.
- **Dependencias:** TASK-01.
- **Criterios de aceptación:**
  1. Se encuentran definidas las cinco entidades principales.
  2. Las relaciones y claves foráneas corresponden al modelo de datos.
  3. Se aplican restricciones de integridad.
  4. Los préstamos y devoluciones conservan su historial.
- **Entregable o evidencia:** Modelo de datos y estructura de tablas.

### TASK-04 — Configurar migraciones de Laravel

- **Descripción:** Implementar las migraciones necesarias para crear y mantener la estructura de la base de datos desde Laravel.
- **Componente:** Backend y persistencia.
- **Requisitos relacionados:** Modelo de datos e integridad de la información.
- **Dependencias:** TASK-03.
- **Criterios de aceptación:**
  1. Existen migraciones para las tablas definidas en el modelo de datos.
  2. Las claves primarias y foráneas están configuradas.
  3. Se aplican las restricciones necesarias.
  4. Las migraciones pueden ejecutarse correctamente.
- **Entregable o evidencia:** Archivos de migración y ejecución satisfactoria.

### TASK-05 — Configurar la conexión a MySQL

- **Descripción:** Configurar la conexión entre Laravel y la base de datos MySQL mediante variables de entorno y parámetros de conexión.
- **Componente:** Backend y base de datos.
- **Requisitos relacionados:** Persistencia y disponibilidad de los datos.
- **Dependencias:** TASK-02, TASK-04.
- **Criterios de aceptación:**
  1. Laravel establece conexión con MySQL.
  2. Las credenciales se gestionan mediante variables de entorno.
  3. No se publican credenciales en el repositorio.
  4. La aplicación puede consultar la base de datos.
- **Entregable o evidencia:** Configuración de conexión y prueba de acceso a MySQL.

### TASK-06 — Implementar la gestión de categorías

- **Descripción:** Desarrollar las operaciones necesarias para consultar y administrar las categorías de instrumentos musicales.
- **Componente:** API Laravel.
- **Requisitos relacionados:** Gestión de categorías y categorías iniciales CAT-01 a CAT-05.
- **Dependencias:** TASK-04, TASK-05.
- **Criterios de aceptación:**
  1. Se pueden consultar las categorías registradas.
  2. Las cinco categorías iniciales están identificadas mediante sus códigos.
  3. Los códigos de categoría no se duplican.
  4. Las respuestas de la API utilizan el formato JSON establecido.
- **Entregable o evidencia:** Endpoints de categorías y pruebas correspondientes.

### TASK-07 — Implementar la gestión de instrumentos

- **Descripción:** Desarrollar las operaciones para registrar, consultar, actualizar y dar de baja instrumentos musicales.
- **Componente:** API Laravel.
- **Requisitos relacionados:** Gestión del catálogo, disponibilidad y baja lógica de instrumentos.
- **Dependencias:** TASK-04, TASK-05, TASK-06.
- **Criterios de aceptación:**
  1. Se pueden registrar instrumentos asociados a una categoría.
  2. Se pueden consultar instrumentos registrados.
  3. Se pueden actualizar los datos permitidos.
  4. La baja de instrumentos se realiza de forma lógica.
  5. No se permite prestar instrumentos dados de baja.
  6. Las unidades disponibles no pueden ser negativas ni superar el total.
- **Entregable o evidencia:** Endpoints de instrumentos y pruebas correspondientes.

### TASK-08 — Implementar el control de unidades disponibles

- **Descripción:** Desarrollar la lógica que mantiene la disponibilidad de instrumentos de acuerdo con el total de unidades y los préstamos activos.
- **Componente:** Lógica de negocio del backend.
- **Requisitos relacionados:** Control de inventario y regla de integridad de unidades.
- **Dependencias:** TASK-07.
- **Criterios de aceptación:**
  1. La cantidad disponible se mantiene dentro del rango permitido.
  2. Al modificar el total se consideran las unidades actualmente prestadas.
  3. El backend calcula la disponibilidad y no depende de un valor enviado por el cliente.
  4. No se permite reducir el total por debajo de las unidades prestadas.
- **Entregable o evidencia:** Servicio de control de inventario y pruebas automatizadas.

### TASK-09 — Implementar la gestión de estudiantes

- **Descripción:** Desarrollar las operaciones para registrar, consultar y actualizar la información de los estudiantes que utilizan el sistema.
- **Componente:** API Laravel.
- **Requisitos relacionados:** Gestión de estudiantes.
- **Dependencias:** TASK-04, TASK-05.
- **Criterios de aceptación:**
  1. Se pueden registrar estudiantes.
  2. Se pueden consultar los estudiantes registrados.
  3. Se pueden actualizar los datos permitidos.
  4. Se aplican las validaciones de los campos obligatorios.
  5. Se evitan duplicados en los identificadores definidos.
- **Entregable o evidencia:** Endpoints de estudiantes y pruebas correspondientes.

### TASK-10 — Implementar el registro de préstamos

- **Descripción:** Desarrollar la operación para registrar préstamos de instrumentos asociados a estudiantes.
- **Componente:** API Laravel y lógica de negocio.
- **Requisitos relacionados:** Gestión de préstamos, disponibilidad y plazo de 21 días.
- **Dependencias:** TASK-07, TASK-08, TASK-09.
- **Criterios de aceptación:**
  1. Se puede registrar un préstamo para un estudiante y un instrumento.
  2. Se verifica que el instrumento esté activo y tenga unidades disponibles.
  3. Se verifica que el estudiante no tenga otro instrumento pendiente de devolución.
  4. La fecha límite se calcula con un plazo de 21 días.
  5. Se conservan los datos históricos de la operación.
- **Entregable o evidencia:** Endpoint de creación de préstamos y pruebas automatizadas.

### TASK-11 — Implementar las consultas de préstamos

- **Descripción:** Desarrollar las operaciones para consultar los préstamos registrados, sus detalles y los préstamos asociados a cada estudiante.
- **Componente:** API Laravel.
- **Requisitos relacionados:** Consulta y seguimiento de préstamos.
- **Dependencias:** TASK-10.
- **Criterios de aceptación:**
  1. Se pueden consultar los préstamos registrados.
  2. Se puede consultar el detalle de un préstamo.
  3. Se pueden consultar los préstamos de un estudiante.
  4. Se conserva la información histórica de las operaciones.
  5. El estado del préstamo se determina según la existencia de una devolución y la fecha límite.
- **Entregable o evidencia:** Endpoints de consulta de préstamos y pruebas correspondientes.

### TASK-12 — Implementar el control de préstamos vencidos

- **Descripción:** Desarrollar la lógica para identificar préstamos cuya fecha límite haya pasado y que todavía no tengan una devolución registrada.
- **Componente:** Lógica de negocio del backend.
- **Requisitos relacionados:** Control de vencimientos y bloqueo de nuevos préstamos.
- **Dependencias:** TASK-10, TASK-11.
- **Criterios de aceptación:**
  1. Se identifican los préstamos que superaron su fecha límite.
  2. Los préstamos devueltos no se consideran vencidos.
  3. Un estudiante con un préstamo vencido no puede registrar otro préstamo.
  4. La comparación de fechas utiliza UTC.
- **Entregable o evidencia:** Consulta de préstamos vencidos y pruebas automatizadas.

### TASK-13 — Implementar el registro de devoluciones

- **Descripción:** Desarrollar la operación para registrar la devolución de un instrumento prestado y actualizar su disponibilidad.
- **Componente:** API Laravel y lógica de negocio.
- **Requisitos relacionados:** Gestión de devoluciones, historial y control de inventario.
- **Dependencias:** TASK-08, TASK-10.
- **Criterios de aceptación:**
  1. Se puede registrar la devolución de un préstamo existente.
  2. No se permite registrar dos devoluciones para el mismo préstamo.
  3. La disponibilidad se incrementa correctamente.
  4. La devolución y la actualización de inventario se ejecutan dentro de una misma transacción.
  5. Se conserva el historial de la devolución.
- **Entregable o evidencia:** Endpoint de devoluciones y pruebas automatizadas.

### TASK-14 — Implementar las transacciones y el control de concurrencia

- **Descripción:** Garantizar la integridad de las operaciones cuando varios operadores intenten prestar o devolver instrumentos simultáneamente.
- **Componente:** Backend y base de datos.
- **Requisitos relacionados:** Concurrencia, integridad de inventario y respuestas HTTP 409.
- **Dependencias:** TASK-10, TASK-13.
- **Criterios de aceptación:**
  1. Las operaciones críticas utilizan transacciones.
  2. Se aplican bloqueos de registros cuando sea necesario.
  3. Se vuelve a comprobar la disponibilidad después de obtener el bloqueo.
  4. Cuando dos operadores intentan prestar la última unidad, solo uno completa la operación.
  5. La operación que no puede completarse recibe HTTP 409.
  6. Los errores provocan la reversión de la transacción correspondiente.
  
  **Estado:** En revisión.

**Evidencias registradas:**
- Implementación de transacciones en las operaciones de préstamos y devoluciones.
- Bloqueo de registros mediante `lockForUpdate()`.
- Revalidación de disponibilidad después de obtener el bloqueo.
- Prueba manual con dos solicitudes independientes.
- Primera solicitud: HTTP 201 Created.
- Segunda solicitud: HTTP 409 Conflict.
- Disponibilidad final del instrumento: 0 unidades.
- **Entregable o evidencia:** Implementación transaccional y pruebas de concurrencia.

### TASK-15 — Implementar el reporte de instrumentos más solicitados

- **Descripción:** Desarrollar una consulta que permita identificar los instrumentos con mayor cantidad de solicitudes o préstamos registrados.
- **Componente:** API Laravel y reportes.
- **Requisitos relacionados:** Reporte de instrumentos más solicitados.
- **Dependencias:** TASK-10, TASK-11.
- **Criterios de aceptación:**
  1. Se contabilizan los préstamos registrados por instrumento.
  2. Los resultados se ordenan de mayor a menor cantidad de solicitudes.
  3. Se muestran los datos necesarios para identificar cada instrumento.
  4. La consulta utiliza información persistida en la base de datos.
- **Entregable o evidencia:** Endpoint del reporte y pruebas correspondientes.

### TASK-16 — Implementar validaciones y manejo de errores de la API

- **Descripción:** Unificar las validaciones de entrada y las respuestas de error de los endpoints del sistema.
- **Componente:** API Laravel.
- **Requisitos relacionados:** Contrato API, validaciones y manejo de errores.
- **Dependencias:** TASK-06, TASK-07, TASK-09, TASK-10, TASK-13.
- **Criterios de aceptación:**
  1. Se validan los campos obligatorios y sus formatos.
  2. Se utilizan los códigos HTTP definidos en el contrato.
  3. Los errores de validación utilizan HTTP 422.
  4. Los recursos inexistentes utilizan HTTP 404.
  5. Los conflictos de negocio utilizan HTTP 409.
  6. Los mensajes dirigidos al usuario están en español.
- **Entregable o evidencia:** Validaciones, respuestas estandarizadas y pruebas de errores.

### TASK-17 — Implementar el frontend en React

- **Descripción:** Crear la aplicación frontend que permita a los operadores interactuar con las funcionalidades del sistema.
- **Componente:** Aplicación React.
- **Requisitos relacionados:** Interfaz de usuario y consumo de la API.
- **Dependencias:** TASK-01, TASK-02, TASK-16.
- **Criterios de aceptación:**
  1. La aplicación React inicia correctamente.
  2. Se encuentra organizada por componentes y vistas.
  3. Se establece la conexión con la API Laravel.
  4. Se manejan los estados de carga, error y respuesta.
  5. La interfaz presenta mensajes comprensibles en español.
- **Entregable o evidencia:** Aplicación frontend ejecutable.

### TASK-18 — Implementar las vistas de administración

- **Descripción:** Construir las interfaces para gestionar categorías, instrumentos y estudiantes desde el frontend.
- **Componente:** Aplicación React.
- **Requisitos relacionados:** Gestión del catálogo y estudiantes.
- **Dependencias:** TASK-06, TASK-07, TASK-09, TASK-17.
- **Criterios de aceptación:**
  1. Existe una vista para consultar categorías.
  2. Existe una vista para consultar y administrar instrumentos.
  3. Existe una vista para consultar y administrar estudiantes.
  4. Los formularios validan los datos antes de enviarlos.
  5. Los cambios se reflejan mediante respuestas de la API.
- **Entregable o evidencia:** Vistas de administración funcionales.

### TASK-19 — Implementar las vistas de préstamos y devoluciones

- **Descripción:** Construir las interfaces que permitan registrar, consultar y gestionar préstamos y devoluciones de instrumentos.
- **Componente:** Aplicación React.
- **Requisitos relacionados:** Gestión de préstamos, devoluciones y vencimientos.
- **Dependencias:** TASK-10, TASK-11, TASK-12, TASK-13, TASK-17.
- **Criterios de aceptación:**
  1. Se pueden consultar los préstamos.
  2. Se pueden registrar nuevos préstamos.
  3. Se pueden consultar los préstamos vencidos.
  4. Se pueden registrar devoluciones.
  5. Se muestran mensajes de confirmación y error.
- **Entregable o evidencia:** Vistas de préstamos y devoluciones funcionales.

### TASK-20 — Implementar el sitio público estático

- **Descripción:** Construir el sitio público estático del proyecto Music School para presentar información general del sistema.
- **Componente:** Sitio público.
- **Requisitos relacionados:** Sitio público del proyecto y separación del frontend administrativo.
- **Dependencias:** TASK-01, TASK-02.
- **Criterios de aceptación:**
  1. Existe una página pública independiente de la aplicación administrativa.
  2. Se presenta información general de Music School.
  3. Los recursos estáticos se cargan correctamente.
  4. El sitio puede ejecutarse desde la infraestructura definida.
- **Entregable o evidencia:** Sitio público estático funcional.

### TASK-21 — Implementar la herramienta de siembra de datos mediante API

- **Descripción:** Crear una herramienta que permita cargar los datos iniciales del sistema mediante los endpoints de la API, sin acceder directamente a MySQL.
- **Componente:** Herramienta auxiliar.
- **Requisitos relacionados:** Inicialización de datos y categorías CAT-01 a CAT-05.
- **Dependencias:** TASK-06, TASK-07, TASK-09, TASK-16.
- **Criterios de aceptación:**
  1. La herramienta utiliza la API HTTP.
  2. No ejecuta consultas SQL directas sobre MySQL.
  3. Registra las cinco categorías iniciales.
  4. Evita duplicar registros cuando se ejecuta más de una vez.
  5. Informa los resultados y errores de ejecución.
- **Entregable o evidencia:** Herramienta de siembra y evidencia de ejecución.

### TASK-22 — Configurar Docker Compose y la ejecución integrada

- **Descripción:** Configurar los servicios necesarios para ejecutar el sistema mediante Docker Compose, incluyendo base de datos, backend, frontend y sitio público.
- **Componente:** Infraestructura.
- **Requisitos relacionados:** Despliegue local y ejecución integrada del proyecto.
- **Dependencias:** TASK-05, TASK-17, TASK-20.
- **Criterios de aceptación:**
  1. Existe un archivo Docker Compose con los servicios requeridos.
  2. Los servicios pueden iniciarse mediante un solo comando.
  3. El backend puede conectarse con MySQL dentro del entorno de contenedores.
  4. El frontend y el sitio público pueden accederse desde el entorno local.
  5. La configuración no expone credenciales sensibles.
- **Entregable o evidencia:** Configuración Docker Compose y prueba de ejecución integrada.

### TASK-23 — Ejecutar pruebas, documentar resultados y preparar la entrega

- **Descripción:** Verificar el funcionamiento del sistema mediante pruebas automatizadas, revisar el cumplimiento de los requisitos y preparar las evidencias para la entrega y sustentación.
- **Componente:** Calidad, documentación y entrega.
- **Requisitos relacionados:** Historias de usuario, reglas de negocio, requisitos funcionales, requisitos no funcionales y contrato API.
- **Dependencias:** TASK-01 a TASK-22.
- **Criterios de aceptación:**
  1. Se ejecutan pruebas automatizadas para las funcionalidades principales.
  2. Se cuenta con al menos 15 archivos de pruebas automatizadas.
  3. Se verifican las reglas de negocio de préstamos y devoluciones.
  4. Se comprueba el control de concurrencia y el conflicto HTTP 409.
  5. Se revisa la correspondencia entre requisitos, implementación y pruebas.
  6. Se documentan los resultados y las evidencias.
  7. El proyecto puede ejecutarse para la sustentación.
- **Entregable o evidencia:** Pruebas automatizadas, resultados, documentación técnica y evidencias de entrega.

### 3.1 Matriz de trazabilidad de tareas

La siguiente matriz relaciona las tareas técnicas con las historias de usuario y los requisitos funcionales definidos en `spec.md`. Las reglas de negocio y los requisitos no funcionales aplicables se consultan en la matriz de trazabilidad de dicho documento.

| Tarea | Historia de usuario relacionada | Requisito funcional relacionado |
|---|---|---|
| TASK-01 | Transversal | Organización del proyecto |
| TASK-02 | Transversal | Preparación del entorno |
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
| TASK-20 | Transversal | Sitio público |
| TASK-21 | Transversal | Inicialización de datos mediante API |
| TASK-22 | Transversal | Infraestructura y despliegue |
| TASK-23 | HU-01 a HU-10 | RF-01 a RF-10 |

**Nota de trazabilidad:** Las tareas transversales apoyan la estructura, infraestructura, interfaz, inicialización de datos y verificación general del proyecto. Las reglas de negocio RN-01 a RN-06 y los requisitos no funcionales RNF-01 a RNF-05 se deben verificar de acuerdo con su relación definida en `spec.md`. Esta matriz representa la planificación de cobertura y no constituye evidencia de implementación o pruebas ejecutadas.

### 3.2 Orden de ejecución y dependencias técnicas

Las tareas se ejecutarán de acuerdo con sus dependencias técnicas y funcionales. La siguiente organización establece una secuencia de referencia; las actividades podrán desarrollarse en paralelo cuando sus dependencias estén satisfechas.

| Etapa | Tareas | Descripción |
|---|---|---|
| 1. Preparación | TASK-01, TASK-02 | Organización del repositorio y configuración del entorno. |
| 2. Diseño de datos | TASK-03 | Definición del modelo de datos y sus relaciones. |
| 3. Persistencia | TASK-04, TASK-05 | Creación de migraciones y configuración de la conexión con MySQL. TASK-05 requiere que TASK-04 esté finalizada. |
| 4. Backend básico | TASK-06, TASK-07, TASK-09 | Gestión de categorías, instrumentos y estudiantes, respetando sus dependencias. |
| 5. Reglas de inventario | TASK-08 | Control de unidades totales y disponibles, después de implementar la gestión de instrumentos. |
| 6. Operaciones principales | TASK-10, TASK-11, TASK-12, TASK-13 | Registro y consulta de préstamos, control de vencimientos y devoluciones, respetando las dependencias entre operaciones. |
| 7. Integridad y reportes | TASK-14, TASK-15, TASK-16 | Control de concurrencia, generación de reportes, validaciones y manejo de errores. |
| 8. Interfaz y componentes complementarios | TASK-17, TASK-18, TASK-19, TASK-20, TASK-21 | Desarrollo de la aplicación React, sus vistas, el sitio público y la herramienta de siembra mediante API. |
| 9. Integración y entrega | TASK-22, TASK-23 | Integración mediante Docker Compose, ejecución de pruebas y preparación de la entrega. |

**Consideraciones sobre las dependencias**

1. TASK-01 debe completarse antes de organizar el entorno y los componentes del proyecto.
2. TASK-03 define el modelo que sirve de referencia para TASK-04.
3. TASK-05 requiere las migraciones de TASK-04 y la configuración del entorno de TASK-02.
4. TASK-06, TASK-07 y TASK-09 pueden desarrollarse de forma independiente una vez disponibles la persistencia y la conexión a MySQL, respetando las dependencias específicas de cada tarea.
5. TASK-08 requiere TASK-07, mientras que TASK-10 requiere la gestión de instrumentos, disponibilidad y estudiantes.
6. Las consultas, vencimientos y devoluciones dependen de las operaciones de préstamos y de los componentes indicados en sus respectivas tareas.
7. Las vistas de React pueden desarrollarse progresivamente utilizando el contrato API como referencia, pero su integración funcional requiere los endpoints correspondientes.
8. El sitio público y la herramienta de siembra pueden desarrollarse de forma independiente cuando estén disponibles sus respectivos componentes y dependencias.
9. Docker Compose debe integrar los servicios requeridos y comprobarse antes de ejecutar la validación final.
10. TASK-23 depende de la disponibilidad de los componentes que serán sometidos a pruebas y validación.

**Nota:** Esta secuencia representa una planificación técnica. La ejecución en paralelo está permitida cuando no se incumplan las dependencias individuales. Ninguna tarea se considerará completada sin verificar sus criterios de aceptación y conservar la evidencia correspondiente.

## 4. Registro y seguimiento de tareas

El seguimiento permitirá controlar el avance de las 23 tareas definidas en este documento. Cada actividad deberá actualizarse de acuerdo con su estado real y contar con evidencias que permitan verificar su cumplimiento.

### 4.1 Estados de las tareas

Se utilizarán los siguientes estados:

- **Pendiente:** La tarea todavía no ha comenzado.
- **En progreso:** La tarea se encuentra en desarrollo.
- **En revisión:** La tarea está terminada y pendiente de validación.
- **Completada:** La tarea cumple todos sus criterios de aceptación y cuenta con evidencias verificables.
- **Bloqueada:** La tarea no puede continuar debido a una dependencia o inconveniente identificado.



### 4.2 Matriz de seguimiento

La siguiente matriz permite realizar el seguimiento de las actividades del proyecto Music School. El estado de cada tarea se actualizará conforme se publiquen sus entregables en el repositorio GitHub.

**Resumen de publicación**

| Indicador | Cantidad |
|:---|---:|
| Total de tareas | 23 |
| Completadas | 4 |
| Pendientes | 19 |

**Detalle de actividades**

| ID | Actividad | Estado | Evidencia |
|:---|:---|:---:|:---|
| TASK-01 | Preparación de la estructura del proyecto | Completada | `docs/` |
| TASK-02 | Configuración del entorno | Pendiente | — |
| TASK-03 | Diseño del modelo de datos | Pendiente | — |
| TASK-04 | Creación de migraciones | Pendiente | — |
| TASK-05 | Conexión con MySQL | Pendiente | — |
| TASK-06 | API de categorías | Pendiente | — |
| TASK-07 | API de instrumentos | Pendiente | — |
| TASK-08 | Control de inventario | Pendiente | — |
| TASK-09 | API de estudiantes | Pendiente | — |
| TASK-10 | Registro de préstamos | Pendiente | — |
| TASK-11 | Consultas de préstamos | Pendiente | — |
| TASK-12 | Consulta de préstamos vencidos | Pendiente | — |
| TASK-13 | Registro de devoluciones | Pendiente | — |
| TASK-14 | Control de concurrencia | Pendiente | — |
| TASK-15 | Reporte de instrumentos solicitados | Pendiente | — |
| TASK-16 | Validaciones y manejo de errores | Pendiente | — |
| TASK-17 | Desarrollo del frontend React | Completada | `app/` |
| TASK-18 | Vistas administrativas | Completada | `app/` |
| TASK-19 | Gestión visual de préstamos y devoluciones | Completada | `app/` |
| TASK-20 | Sitio web público | Pendiente | — |
| TASK-21 | Herramienta de inicialización de datos | Pendiente | — |
| TASK-22 | Integración con Docker Compose | Pendiente | — |
| TASK-23 | Pruebas, documentación y entrega | Pendiente | — |

**Responsable:** Aprendiz A12.

**Criterio de actualización:** una tarea cambiará a Completada cuando sus archivos y entregables correspondientes hayan sido publicados en GitHub y se haya verificado su contenido.


### 4.3 Reglas para actualizar el seguimiento

1. Una tarea cambiará de estado únicamente cuando exista un avance real.
2. La fecha de inicio corresponderá al día en que comience su ejecución.
3. La fecha de finalización corresponderá al día en que se verifiquen sus criterios de aceptación.
4. Las evidencias deberán permitir identificar el resultado de la tarea.
5. Si una tarea queda bloqueada, se documentará el motivo y la dependencia que impide continuar.
6. Los cambios de estado deberán mantenerse coherentes con el historial de trabajo del repositorio.

### 4.4 Revisión del avance

El avance general se calculará tomando como referencia las tareas completadas y el total de tareas planificadas.

**Fórmula:**

Porcentaje de avance = (Número de tareas completadas / 23) × 100

Una tarea solo contará como completada cuando cumpla sus criterios de aceptación y tenga evidencia verificable.



## 5. Evidencias de cumplimiento

Las evidencias podrán incluir:

- Archivos de código fuente.
- Archivos de configuración.
- Migraciones y modelos de datos.
- Endpoints y respuestas de la API.
- Capturas de ejecución.
- Resultados de pruebas automatizadas.
- Commits del repositorio.
- Documentación técnica.
- Ejecución del proyecto mediante Docker Compose.

Las evidencias deberán corresponder con la tarea realizada y permitir comprobar su cumplimiento.

## 6. Dependencias y orden de ejecución

Las tareas se desarrollarán considerando sus dependencias técnicas. No se deberá iniciar una actividad que requiera una funcionalidad previa que todavía no esté disponible, salvo que se trate de trabajo independiente que no comprometa su validación.

La organización propuesta permite avanzar desde la preparación del repositorio y la base de datos hasta la implementación del backend, frontend, infraestructura, pruebas y entrega.

## 7. Control de cambios

| Versión | Fecha | Descripción |
|---|---|---|
| 1.0 | 08/11/2026 | Creación inicial del plan de tareas con 23 actividades y sus criterios de aceptación. |
| 1.2 | 09/11/2026 | Actualización de la estructura real del repositorio y del diagrama de arquitectura lógica, incluyendo Dashboard, servicios y herramienta de inicialización.	En revisión. |

---

**Fin del documento.**