# Especificación de requisitos — Music School

**Identificador:** music-school  
**Proyecto:** Sistema de préstamo de instrumentos musicales  
**Ficha:** ADSO 3239137  
**Versión:** 1.0
**Estado:** Borrador para validación  

---

## 1. Propósito

El presente documento establece los requisitos funcionales, reglas de negocio, requisitos no funcionales y criterios de aceptación del sistema Music School.

El sistema tiene como finalidad gestionar el catálogo de instrumentos musicales, controlar sus unidades disponibles, administrar los préstamos y devoluciones, y generar reportes de los instrumentos más solicitados.

Esta especificación constituye la referencia principal para el diseño, desarrollo, implementación y validación del producto.

## 2. Alcance del sistema

Music School permitirá:

- Gestionar el catálogo de instrumentos musicales.
- Organizar los instrumentos en cinco categorías.
- Consultar las unidades totales y disponibles de cada instrumento.
- Gestionar la información de los estudiantes.
- Registrar préstamos de instrumentos.
- Registrar devoluciones.
- Controlar los plazos de devolución.
- Identificar préstamos vencidos.
- Conservar el historial de operaciones.
- Generar reportes de los instrumentos más solicitados.
- Evitar inconsistencias en el inventario cuando existan operaciones simultáneas.

### 2.1 Categorías de instrumentos

El sistema debe incluir cinco categorías iniciales:

| Código | Categoría |
|---|---|
| CAT-01 | Cuerdas |
| CAT-02 | Vientos |
| CAT-03 | Percusión |
| CAT-04 | Teclados |
| CAT-05 | Electrónicos |

Estas categorías deben estar disponibles mediante el sembrador de datos.

### 2.2 Identificación de instrumentos y ejemplares

El sistema distinguirá entre el modelo de instrumento y sus unidades físicas.

- **Modelo:** representa el tipo de instrumento y se identifica mediante un código de modelo.
- **Ejemplares:** representan las unidades físicas disponibles de un modelo.
- **Unidades totales:** cantidad total de ejemplares registrados.
- **Unidades disponibles:** cantidad de ejemplares que pueden entregarse en préstamo.

La disponibilidad debe actualizarse cuando se registren préstamos y devoluciones.

### 2.3 Tecnologías del proyecto

| Componente | Tecnología |
|---|---|
| Frontend | React |
| Backend | PHP con Laravel |
| Base de datos | MySQL |
| Comunicación | API REST |
| Intercambio de información | JSON |
| Infraestructura | Docker |

## 3. Actores del sistema

### 3.1 Estudiante

Persona que solicita instrumentos musicales en calidad de préstamo.

Responsabilidades y necesidades:

- Consultar los instrumentos disponibles.
- Consultar la información de los instrumentos.
- Solicitar un préstamo.
- Realizar la devolución del instrumento mediante el monitor.
- Conocer las fechas de vencimiento de sus préstamos.

### 3.2 Monitor u operador

Responsable de gestionar las operaciones de préstamo y devolución.

Responsabilidades:

- Consultar el catálogo de instrumentos.
- Consultar la información de los estudiantes.
- Registrar préstamos.
- Registrar devoluciones.
- Consultar el estado de las operaciones.
- Verificar la disponibilidad de instrumentos.

El sistema debe impedir que dos operadores entreguen simultáneamente la última unidad disponible.

## 4. Historias de usuario

### HU-01. Gestión de instrumentos

**Como** monitor,  
**quiero** registrar modelos de instrumentos musicales y sus unidades físicas,  
**para** mantener organizado el catálogo y controlar las existencias.

Criterios de aceptación:

- El sistema debe permitir registrar modelos de instrumentos.
- Cada modelo debe tener un código identificador único.
- Cada modelo debe pertenecer a una categoría.
- El modelo debe registrar sus unidades totales y disponibles.
- No se deben aceptar cantidades negativas.
- Las unidades disponibles no pueden superar las unidades totales.

### HU-02. Consulta del catálogo

**Como** estudiante,  
**quiero** consultar el catálogo de instrumentos musicales,  
**para** conocer los instrumentos y sus unidades disponibles.

Criterios de aceptación:

- El sistema debe mostrar los instrumentos activos.
- Debe mostrar la categoría correspondiente.
- Debe mostrar las unidades disponibles.
- Los instrumentos dados de baja no deben aparecer como disponibles para nuevos préstamos.

### HU-03. Gestión de estudiantes

**Como** monitor,  
**quiero** registrar y consultar estudiantes,  
**para** identificar correctamente a las personas que solicitan instrumentos.

Criterios de aceptación:

- El sistema debe permitir registrar estudiantes.
- Cada estudiante debe tener un identificador.
- El sistema debe permitir consultar la información registrada.
- Los préstamos deben estar asociados a un estudiante existente.

### HU-04. Registro de préstamos

**Como** monitor,  
**quiero** registrar el préstamo de un instrumento a un estudiante,  
**para** controlar la entrega de instrumentos musicales.

Criterios de aceptación:

- El préstamo debe estar asociado a un estudiante.
- El modelo de instrumento debe tener unidades disponibles.
- El estudiante no debe tener otro instrumento sin devolver.
- El sistema debe registrar la fecha del préstamo.
- La fecha de vencimiento debe establecerse a 21 días.
- La operación debe actualizar las unidades disponibles.
- La operación debe conservar la información original del instrumento.
- El sistema debe impedir el préstamo cuando el estudiante tenga un préstamo vencido y pendiente de devolución.

### HU-05. Registro de devoluciones

**Como** monitor,  
**quiero** registrar la devolución de un instrumento,  
**para** actualizar su disponibilidad y conservar el historial de la operación.

**Criterios de aceptación:**

- El sistema debe identificar el préstamo correspondiente.
- No se debe permitir registrar dos devoluciones para el mismo préstamo.
- La devolución debe registrar su fecha y hora en UTC.
- Las unidades disponibles deben incrementarse correctamente al registrar la devolución.
- Las unidades disponibles nunca deben superar las unidades totales.
- La devolución debe conservarse como registro histórico.
- La información original del préstamo debe mantenerse sin modificaciones.
- La operación debe actualizar el estado del préstamo para identificarlo como devuelto.

### HU-06. Control de préstamos vencidos

**Como** monitor,  
**quiero** identificar los préstamos vencidos,  
**para** impedir nuevos préstamos a estudiantes que tengan instrumentos pendientes de devolución y cuyo plazo haya vencido.

**Criterios de aceptación:**

- El sistema debe calcular la fecha de vencimiento a partir de la fecha de registro del préstamo.
- El plazo de cada préstamo será de 21 días.
- El sistema debe identificar como vencidos los préstamos cuya fecha de vencimiento haya sido superada y que no tengan una devolución registrada.
- El sistema debe permitir consultar los préstamos vencidos y pendientes de devolución.
- El estudiante que tenga un préstamo vencido y pendiente de devolución no podrá recibir nuevos instrumentos.
- El bloqueo debe mantenerse hasta que se registre la devolución correspondiente.
- Las fechas y horas utilizadas para determinar el vencimiento deben manejarse en UTC.

### HU-07. Control de inventario

**Como** monitor,  
**quiero** consultar y mantener las cantidades de instrumentos disponibles,  
**para** evitar inconsistencias en el inventario.

**Criterios de aceptación:**

- Las unidades disponibles nunca podrán ser inferiores a cero.
- Las unidades disponibles nunca podrán superar las unidades totales.
- Los préstamos deben disminuir las unidades disponibles en una unidad por cada instrumento prestado.
- Las devoluciones deben incrementar las unidades disponibles en una unidad por cada instrumento devuelto.
- El sistema no debe permitir registrar un préstamo cuando no existan unidades disponibles.
- Las operaciones que modifiquen el inventario deben mantener la integridad de los datos.
- Cuando se realicen operaciones simultáneas sobre la última unidad disponible, solamente una podrá completarse y la otra deberá recibir HTTP 409 Conflict. 

### HU-08. Conservación del historial

**Como** monitor,  
**quiero** conservar los registros de préstamos y devoluciones,  
**para** consultar las operaciones realizadas sin perder la información histórica.

**Criterios de aceptación:**

- Los préstamos no podrán eliminarse físicamente.
- Las devoluciones no podrán eliminarse físicamente.
- Los datos congelados en cada operación deben conservar la información original del instrumento y del estudiante.
- Los cambios posteriores realizados en el catálogo no deben modificar la información histórica de los préstamos y devoluciones.
- Los instrumentos retirados del catálogo deben gestionarse mediante baja lógica.
- Los instrumentos dados de baja no deben estar disponibles para nuevos préstamos.
- La baja lógica de un instrumento no debe eliminar ni modificar los registros históricos asociados.

### HU-09. Reporte de instrumentos más solicitados

**Como** monitor,  
**quiero** consultar un reporte de los instrumentos más solicitados,  
**para** identificar cuáles tienen mayor demanda.

**Criterios de aceptación:**

- El reporte debe utilizar la información histórica de los préstamos registrados.
- El sistema debe calcular la frecuencia de solicitudes de cada modelo de instrumento.
- Los resultados deben mostrar los instrumentos ordenados desde el más solicitado hasta el menos solicitado.
- Cada resultado debe identificar el instrumento y la cantidad de préstamos registrados.
- Los resultados deben corresponder a las operaciones registradas en el sistema.
- El reporte debe considerar los préstamos históricos, incluso cuando el instrumento haya sido retirado del catálogo.
- La consulta del reporte no debe modificar ni eliminar los datos históricos.

### HU-10. Control de concurrencia en préstamos

**Como** monitor,  
**quiero** que el sistema controle los préstamos simultáneos,  
**para** evitar entregar una misma unidad a dos estudiantes.

**Criterios de aceptación:**

- El sistema debe controlar las operaciones simultáneas que modifiquen las unidades disponibles.
- Si dos operadores intentan registrar un préstamo cuando solamente queda una unidad disponible, únicamente una operación podrá completarse correctamente.
- La operación que no consiga reservar la última unidad disponible debe recibir una respuesta HTTP 409 Conflict.
- El sistema debe impedir que las unidades disponibles sean inferiores a cero.
- El inventario debe permanecer consistente después de finalizar ambas solicitudes.
- La operación exitosa debe registrar el préstamo y actualizar las unidades disponibles.
- La operación rechazada no debe generar un préstamo ni modificar las unidades disponibles.

## 5. Reglas de negocio

Las siguientes seis reglas agrupan las condiciones establecidas para el dominio Music School.

### RN-01. Límite de préstamos por estudiante

Cada estudiante podrá tener como máximo un instrumento sin devolver.

No se permitirá registrar un nuevo préstamo mientras exista otro instrumento pendiente de devolución.

### RN-02. Plazo y vencimiento de préstamos

Cada préstamo tendrá un plazo de 21 días, calculado a partir de su fecha de registro.

Los estudiantes que tengan préstamos vencidos y pendientes de devolución no podrán recibir nuevos instrumentos hasta realizar la devolución correspondiente.

### RN-03. Disponibilidad e integridad del inventario

Las unidades disponibles de cada instrumento deberán permanecer siempre dentro del siguiente intervalo:

**0 ≤ unidades disponibles ≤ unidades totales**

Los préstamos disminuirán las unidades disponibles y las devoluciones las incrementarán.

### RN-04. Conservación del historial y baja lógica

Los registros de préstamos y devoluciones no podrán eliminarse físicamente.

Los datos congelados en cada operación deberán conservar la información original del instrumento y del estudiante al momento de realizarse la operación.

Los cambios posteriores en el catálogo no deberán modificar la información histórica de los préstamos y devoluciones.

Los instrumentos retirados del catálogo deberán manejarse mediante baja lógica, sin eliminar los registros históricos asociados.

### RN-05. Control de concurrencia

Cuando dos operadores intenten entregar simultáneamente la última unidad disponible de un instrumento, solamente una operación podrá completarse.

La operación que no consiga la disponibilidad deberá responder con HTTP 409 Conflict.

### RN-06. Manejo de fechas y comunicación con el usuario

Las fechas y horas de las operaciones deberán almacenarse y procesarse en UTC.

Los mensajes y textos presentados al usuario deberán estar en español.

## 6. Requisitos funcionales

Los siguientes requisitos funcionales describen las operaciones que debe permitir el sistema Music School. Cada requisito está relacionado con una historia de usuario y debe cumplir las reglas de negocio establecidas.

| Código | Requisito funcional | Historia relacionada |
|---|---|---|
| RF-01 | Registrar modelos de instrumentos, asignarles un código único, una categoría y sus unidades totales y disponibles. | HU-01 |
| RF-02 | Consultar el catálogo de instrumentos activos, mostrando su categoría y unidades disponibles. | HU-02 |
| RF-03 | Registrar y consultar la información de los estudiantes. | HU-03 |
| RF-04 | Registrar préstamos asociados a estudiantes e instrumentos, validando la disponibilidad, el límite de préstamos pendientes y el plazo de 21 días. | HU-04 |
| RF-05 | Registrar devoluciones de préstamos, actualizar la disponibilidad y conservar el historial de la operación. | HU-05 |
| RF-06 | Identificar y consultar los préstamos vencidos que permanezcan pendientes de devolución. | HU-06 |
| RF-07 | Consultar y controlar las unidades totales y disponibles de cada modelo de instrumento, manteniendo la integridad del inventario. | HU-07 |
| RF-08 | Consultar y conservar el historial de préstamos y devoluciones, manteniendo la información original de cada operación. | HU-08 |
| RF-09 | Generar un reporte de los modelos de instrumentos más solicitados, ordenados según la cantidad de préstamos registrados. | HU-09 |
| RF-10 | Controlar las solicitudes de préstamos simultáneas, evitando inconsistencias en el inventario y respondiendo con HTTP 409 Conflict cuando no exista disponibilidad. | HU-10 |

## 7. Requisitos no funcionales

Los siguientes requisitos establecen las condiciones de calidad, seguridad, integridad, mantenibilidad, despliegue y verificabilidad del sistema Music School.

### RNF-01. Seguridad

El sistema debe validar las operaciones en el backend para evitar modificaciones no autorizadas o datos inconsistentes.

Las credenciales y secretos deben gestionarse mediante variables de entorno. Las contraseñas, cuando existan, deben almacenarse utilizando mecanismos seguros de hash.

**Verificación:**
- Comprobar que las validaciones de las operaciones se ejecuten en Laravel.
- Verificar que los secretos no estén escritos directamente en el código fuente.
- Comprobar que las contraseñas no se almacenen en texto plano.
- Comprobar que las operaciones rechazadas por las validaciones no modifiquen los datos almacenados.

### RNF-02. Integridad de datos

La base de datos debe mantener la integridad referencial y las restricciones definidas para el inventario y los préstamos.

Las operaciones que modifiquen las unidades disponibles deben ejecutarse de manera consistente, incluso cuando existan solicitudes simultáneas.

**Verificación:**
- Comprobar que las unidades disponibles nunca sean inferiores a cero.
- Comprobar que las unidades disponibles nunca superen las unidades totales.
- Verificar que los préstamos y las devoluciones actualicen correctamente el inventario.
- Ejecutar pruebas de concurrencia para comprobar que solamente una operación pueda entregar la última unidad disponible.
- Verificar que una operación rechazada por falta de disponibilidad no genere un préstamo ni modifique el inventario.

### RNF-03. Mantenibilidad

El código debe mantener separación de responsabilidades entre frontend, backend y persistencia.

Los identificadores de clases, métodos, variables y demás elementos del código deben escribirse en inglés. Los mensajes visibles para el usuario deben estar en español.

**Verificación:**
- Revisar la organización del código fuente.
- Comprobar la separación de responsabilidades entre React y Laravel.
- Revisar los nombres de clases, métodos, variables y tablas.
- Verificar que los mensajes presentados al usuario estén en español.

### RNF-04. Portabilidad y despliegue

Los servicios del proyecto deben poder ejecutarse mediante contenedores Docker.

La infraestructura debe permitir levantar los servicios requeridos mediante un solo comando.

**Verificación:**
- Ejecutar el proyecto desde una configuración limpia.
- Comprobar que los contenedores se inicien correctamente.
- Comprobar la conexión entre el backend y la base de datos.
- Verificar que el despliegue pueda realizarse mediante un solo comando.

### RNF-05. Verificabilidad

El proyecto debe contar con pruebas automatizadas que permitan comprobar las funcionalidades y reglas de negocio definidas en esta especificación.

La entrega debe contener al menos 15 archivos de pruebas automatizadas.

**Verificación:**
- Revisar la existencia de los archivos de pruebas.
- Ejecutar las pruebas automatizadas.
- Comprobar que las pruebas validen los comportamientos esperados y los escenarios de error.
- Verificar que existan al menos 15 archivos de pruebas automatizadas.
- Comprobar que las pruebas cubran las diez historias de usuario y las seis reglas de negocio.

## 8. Restricciones del sistema

1. El frontend debe desarrollarse con React.
2. El backend debe desarrollarse con PHP y Laravel.
3. La persistencia debe utilizar MySQL.
4. La comunicación entre frontend y backend debe realizarse mediante una API REST.
5. Los datos intercambiados mediante la API deben utilizar JSON.
6. El sistema debe ejecutarse mediante contenedores Docker.
7. Los identificadores del código deben estar en inglés.
8. Los mensajes visibles para el usuario deben estar en español.
9. Las fechas y horas deben manejarse en UTC.
10. No se deben desarrollar funcionalidades fuera de la especificación.

## 9. Criterios generales de aceptación

El sistema Music School se considerará funcionalmente aceptable cuando se verifique el cumplimiento de las siguientes condiciones:

- Se puedan registrar y consultar modelos de instrumentos con sus respectivos códigos, categorías y unidades.
- Se encuentren disponibles las cinco categorías iniciales: cuerdas, vientos, percusión, teclados y electrónicos.
- Se puedan registrar y consultar estudiantes.
- Se puedan registrar préstamos asociados a estudiantes e instrumentos existentes.
- Se puedan registrar devoluciones y actualizar correctamente las unidades disponibles.
- Se aplique el límite máximo de un instrumento pendiente de devolución por estudiante.
- Se establezca un plazo de 21 días para cada préstamo.
- Se identifiquen los préstamos vencidos y se impidan nuevos préstamos a estudiantes que tengan préstamos vencidos pendientes de devolución.
- Las unidades disponibles permanezcan siempre entre cero y las unidades totales.
- Se conserve el historial de préstamos y devoluciones sin eliminación física ni modificación de los datos congelados.
- Los instrumentos retirados del catálogo utilicen baja lógica.
- Se genere el reporte de los modelos de instrumentos más solicitados, ordenados por cantidad de préstamos registrados.
- Se controle la concurrencia cuando dos operadores intenten entregar la última unidad disponible: una operación debe completarse y la otra debe recibir HTTP 409 Conflict.
- Las fechas y horas de las operaciones se almacenen y procesen en UTC.
- Los mensajes y textos visibles para el usuario se presenten en español.
- El proyecto pueda ejecutarse mediante contenedores Docker utilizando un solo comando.
- Se disponga de al menos 15 archivos de pruebas automatizadas que permitan verificar las diez historias de usuario y las seis reglas de negocio.

## 10. Trazabilidad de requisitos

La siguiente matriz relaciona las historias de usuario con sus requisitos funcionales, reglas de negocio y requisitos no funcionales aplicables. También permite identificar los requisitos transversales que afectan al desarrollo y validación del sistema.

| Historia | RF | Reglas de negocio | RNF |
|---|---|---|---|
| HU-01 | RF-01 | RN-03 | RNF-01, RNF-02 |
| HU-02 | RF-02 | RN-04 | RNF-01 |
| HU-03 | RF-03 | Ninguna directa | RNF-01 |
| HU-04 | RF-04 | RN-01, RN-02, RN-03, RN-04, RN-05, RN-06 | RNF-01, RNF-02 |
| HU-05 | RF-05 | RN-03, RN-04, RN-06 | RNF-01, RNF-02 |
| HU-06 | RF-06 | RN-02, RN-06 | RNF-01, RNF-02 |
| HU-07 | RF-07 | RN-03, RN-05 | RNF-01, RNF-02 |
| HU-08 | RF-08 | RN-04 | RNF-01, RNF-02 |
| HU-09 | RF-09 | RN-04 | RNF-01, RNF-02 |
| HU-10 | RF-10 | RN-03, RN-05 | RNF-01, RNF-02 |

### 10.1 Requisitos transversales

Los siguientes requisitos no funcionales aplican de manera general al proyecto y no se limitan a una historia de usuario específica.

| Requisito | Historias y alcance relacionado |
|---|---|
| RNF-03. Mantenibilidad | Todas las historias y componentes del sistema. |
| RNF-04. Portabilidad y despliegue | Proyecto completo: frontend, backend y base de datos. |
| RNF-05. Verificabilidad | Las diez historias de usuario y las seis reglas de negocio. |

## 11. Relación con los demás documentos

Esta especificación servirá como referencia para construir los siguientes artefactos del proyecto. Todos los documentos deberán mantener coherencia con los requisitos funcionales, reglas de negocio, requisitos no funcionales y restricciones establecidos en este documento.

| Documento | Relación |
|---|---|
| constitution.md | Establece los principios, lineamientos y restricciones generales del proyecto. |
| plan.md | Define la planificación y organización de las actividades de desarrollo. |
| architecture.md | Describe la arquitectura técnica y la distribución de responsabilidades del sistema. |
| data-model.md | Define el modelo de datos, las entidades, sus atributos y relaciones. |
| api-contract.md | Especifica los endpoints, métodos HTTP, estructuras JSON y respuestas de la API. |
| tasks.md | Descompone el trabajo de implementación en las 23 tareas establecidas. |
| adr/ | Contiene el registro de al menos 3 decisiones arquitectónicas y sus justificaciones. |

Los artefactos deberán respetar el alcance definido en esta especificación y no introducir funcionalidades que no estén contempladas en ella.

## 12. Control de cambios

| Versión | Descripción | Estado |
|---|---|---|
| 1.0 | Creación inicial de la especificación de Music School. | Borrador |
