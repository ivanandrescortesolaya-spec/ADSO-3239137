# Especificacion de requisitos — Music School

**Identificador:** music-school  
**Proyecto:** Sistema de prestamo de instrumentos musicales  
**Ficha:** ADSO 3239137  
**Version:** 1.0
**Estado:** Borrador para validacion  

---

## 1. Proposito

El presente documento establece los requisitos funcionales, reglas de negocio, requisitos no funcionales y criterios de aceptacion del sistema Music School.

El sistema tiene como finalidad gestionar el catalogo de instrumentos musicales, controlar sus unidades disponibles, administrar los prestamos y devoluciones, y generar reportes de los instrumentos mas solicitados.

Esta especificacion constituye la referencia principal para el diseño, desarrollo, implementacion y validacion del producto.

## 2. Alcance del sistema

Music School permitira:

- Gestionar el catalogo de instrumentos musicales.
- Organizar los instrumentos en cinco categorias.
- Consultar las unidades totales y disponibles de cada instrumento.
- Gestionar la informacion de los estudiantes.
- Registrar prestamos de instrumentos.
- Registrar devoluciones.
- Controlar los plazos de devolucion.
- Identificar prestamos vencidos.
- Conservar el historial de operaciones.
- Generar reportes de los instrumentos mas solicitados.
- Evitar inconsistencias en el inventario cuando existan operaciones simultaneas.

### 2.1 Categorias de instrumentos

El sistema debe incluir cinco categorias iniciales:

| Codigo | Categoria |
|---|---|
| CAT-01 | Cuerdas |
| CAT-02 | Vientos |
| CAT-03 | Percusion |
| CAT-04 | Teclados |
| CAT-05 | Electronicos |

Estas categorias deben estar disponibles mediante el sembrador de datos.

### 2.2 Identificacion de instrumentos y ejemplares

El sistema distinguira entre el modelo de instrumento y sus unidades fisicas.

- **Modelo:** representa el tipo de instrumento y se identifica mediante un codigo de modelo.
- **Ejemplares:** representan las unidades fisicas disponibles de un modelo.
- **Unidades totales:** cantidad total de ejemplares registrados.
- **Unidades disponibles:** cantidad de ejemplares que pueden entregarse en prestamo.

La disponibilidad debe actualizarse cuando se registren prestamos y devoluciones.

### 2.3 Tecnologias del proyecto

| Componente | Tecnologia |
|---|---|
| Frontend | React |
| Backend | PHP con Laravel |
| Base de datos | MySQL |
| Comunicacion | API REST |
| Intercambio de informacion | JSON |
| Infraestructura | Docker |

## 3. Actores del sistema

### 3.1 Estudiante

Persona que solicita instrumentos musicales en calidad de prestamo.

Responsabilidades y necesidades:

- Consultar los instrumentos disponibles.
- Consultar la informacion de los instrumentos.
- Solicitar un prestamo.
- Realizar la devolucion del instrumento mediante el monitor.
- Conocer las fechas de vencimiento de sus prestamos.

### 3.2 Monitor u operador

Responsable de gestionar las operaciones de prestamo y devolucion.

Responsabilidades:

- Consultar el catalogo de instrumentos.
- Consultar la informacion de los estudiantes.
- Registrar prestamos.
- Registrar devoluciones.
- Consultar el estado de las operaciones.
- Verificar la disponibilidad de instrumentos.

El sistema debe impedir que dos operadores entreguen simultaneamente la ultima unidad disponible.

## 4. Historias de usuario

### HU-01. Gestion de instrumentos

**Como** monitor,  
**quiero** registrar modelos de instrumentos musicales y sus unidades fisicas,  
**para** mantener organizado el catalogo y controlar las existencias.

Criterios de aceptacion:

- El sistema debe permitir registrar modelos de instrumentos.
- Cada modelo debe tener un codigo identificador unico.
- Cada modelo debe pertenecer a una categoria.
- El modelo debe registrar sus unidades totales y disponibles.
- No se deben aceptar cantidades negativas.
- Las unidades disponibles no pueden superar las unidades totales.

### HU-02. Consulta del catalogo

**Como** estudiante,  
**quiero** consultar el catalogo de instrumentos musicales,  
**para** conocer los instrumentos y sus unidades disponibles.

Criterios de aceptacion:

- El sistema debe mostrar los instrumentos activos.
- Debe mostrar la categoria correspondiente.
- Debe mostrar las unidades disponibles.
- Los instrumentos dados de baja no deben mostrarse como disponibles para nuevos prestamos ni permitir que se registren nuevos prestamos sobre ellos.

### HU-03. Gestion de estudiantes

**Como** monitor,  
**quiero** registrar y consultar estudiantes,  
**para** identificar correctamente a las personas que solicitan instrumentos.

Criterios de aceptacion:

- El sistema debe permitir registrar estudiantes.
- Cada estudiante debe tener un identificador.
- El sistema debe permitir consultar la informacion registrada.
- Los prestamos deben estar asociados a un estudiante existente.

### HU-04. Registro de prestamos

**Como** monitor,  
**quiero** registrar el prestamo de un instrumento a un estudiante,  
**para** controlar la entrega de instrumentos musicales.

Criterios de aceptacion:

- El prestamo debe estar asociado a un estudiante.
- El modelo de instrumento debe tener unidades disponibles.
- El estudiante no debe tener otro instrumento sin devolver.
- El sistema debe registrar la fecha del prestamo.
- La fecha de vencimiento debe establecerse a 21 dias.
- La operacion debe actualizar las unidades disponibles.
- La operacion debe conservar la informacion original del instrumento.
- El sistema debe impedir el prestamo cuando el estudiante tenga un prestamo vencido y pendiente de devolucion.

### HU-05. Registro de devoluciones

**Como** monitor,  
**quiero** registrar la devolucion de un instrumento,  
**para** actualizar su disponibilidad y conservar el historial de la operacion.

**Criterios de aceptacion:**

- El sistema debe identificar el prestamo correspondiente.
- No se debe permitir registrar dos devoluciones para el mismo prestamo.
- La devolucion debe registrar su fecha y hora en UTC.
- Las unidades disponibles deben incrementarse correctamente al registrar la devolucion.
- Las unidades disponibles nunca deben superar las unidades totales.
- La devolucion debe conservarse como registro historico.
- La informacion original del prestamo debe mantenerse sin modificaciones.
- El sistema debe identificar el prestamo como devuelto mediante el registro asociado en la tabla de devoluciones (returns), sin modificar la informacion original del prestamo.

### HU-06. Control de prestamos vencidos

**Como** monitor,  
**quiero** identificar los prestamos vencidos,  
**para** impedir nuevos prestamos a estudiantes que tengan instrumentos pendientes de devolucion y cuyo plazo haya vencido.

**Criterios de aceptacion:**

- El sistema debe calcular la fecha de vencimiento a partir de la fecha de registro del prestamo.
- El plazo de cada prestamo sera de 21 dias.
- El sistema debe identificar como vencidos los prestamos cuya fecha de vencimiento haya sido superada y que no tengan una devolucion registrada.
- El sistema debe permitir consultar los prestamos vencidos y pendientes de devolucion.
- El estudiante que tenga un prestamo vencido y pendiente de devolucion no podra recibir nuevos instrumentos.
- El bloqueo debe mantenerse hasta que se registre la devolucion correspondiente.
- Las fechas y horas utilizadas para determinar el vencimiento deben manejarse en UTC.

### HU-07. Control de inventario

**Como** monitor,  
**quiero** consultar y mantener las cantidades de instrumentos disponibles,  
**para** evitar inconsistencias en el inventario.

**Criterios de aceptacion:**

- Las unidades disponibles nunca podran ser inferiores a cero.
- Las unidades disponibles nunca podran superar las unidades totales.
- Los prestamos deben disminuir las unidades disponibles en una unidad por cada instrumento prestado.
- Las devoluciones deben incrementar las unidades disponibles en una unidad por cada instrumento devuelto.
- El sistema no debe permitir registrar un prestamo cuando no existan unidades disponibles.
- Las operaciones que modifiquen el inventario deben mantener la integridad de los datos.
- Cuando se realicen operaciones simultaneas sobre la ultima unidad disponible, solamente una podra completarse y la otra debera recibir HTTP 409 Conflict. 

### HU-08. Conservacion del historial

**Como** monitor,  
**quiero** conservar los registros de prestamos y devoluciones,  
**para** consultar las operaciones realizadas sin perder la informacion historica.

**Criterios de aceptacion:**

- Los prestamos no podran eliminarse fisicamente.
- Las devoluciones no podran eliminarse fisicamente.
- Los datos congelados en cada operacion deben conservar la informacion original del instrumento y del estudiante.
- Los cambios posteriores realizados en el catalogo no deben modificar la informacion historica de los prestamos y devoluciones.
- Los instrumentos retirados del catalogo deben gestionarse mediante baja logica.
- Los instrumentos dados de baja no deben estar disponibles para nuevos prestamos.
- La baja logica de un instrumento no debe eliminar ni modificar los registros historicos asociados.

### HU-09. Reporte de instrumentos mas solicitados

**Como** monitor,  
**quiero** consultar un reporte de los instrumentos mas solicitados,  
**para** identificar cuales tienen mayor demanda.

**Criterios de aceptacion:**

- El reporte debe utilizar la informacion historica de los prestamos registrados.
- El sistema debe calcular la frecuencia de solicitudes de cada modelo de instrumento.
- Los resultados deben mostrar los instrumentos ordenados desde el mas solicitado hasta el menos solicitado.
- Cada resultado debe identificar el instrumento y la cantidad de prestamos registrados.
- Los resultados deben corresponder a las operaciones registradas en el sistema.
- El reporte debe considerar los prestamos historicos, incluso cuando el instrumento haya sido retirado del catalogo.
- La consulta del reporte no debe modificar ni eliminar los datos historicos.

### HU-10. Control de concurrencia en prestamos

**Como** monitor,  
**quiero** que el sistema controle los prestamos simultaneos,  
**para** evitar entregar una misma unidad a dos estudiantes.

**Criterios de aceptacion:**

- El sistema debe controlar las operaciones simultaneas que modifiquen las unidades disponibles.
- Si dos operadores intentan registrar un prestamo cuando solamente queda una unidad disponible, unicamente una operacion podra completarse correctamente.
- La operacion que no consiga reservar la ultima unidad disponible debe recibir una respuesta HTTP 409 Conflict.
- El sistema debe impedir que las unidades disponibles sean inferiores a cero.
- El inventario debe permanecer consistente despues de finalizar ambas solicitudes.
- La operacion exitosa debe registrar el prestamo y actualizar las unidades disponibles.
- La operacion rechazada no debe generar un prestamo ni modificar las unidades disponibles.

## 5. Reglas de negocio

Las siguientes seis reglas agrupan las condiciones establecidas para el dominio Music School.

### RN-01. Limite de prestamos por estudiante

Cada estudiante podra tener como maximo un instrumento sin devolver.

No se permitira registrar un nuevo prestamo mientras exista otro instrumento pendiente de devolucion.

### RN-02. Plazo y vencimiento de prestamos

Cada prestamo tendra un plazo de 21 dias, calculado a partir de su fecha de registro.

Los estudiantes que tengan prestamos vencidos y pendientes de devolucion no podran recibir nuevos instrumentos hasta realizar la devolucion correspondiente.

### RN-03. Disponibilidad e integridad del inventario

Las unidades disponibles de cada instrumento deberan permanecer siempre dentro del siguiente intervalo:

**0 ≤ unidades disponibles ≤ unidades totales**

Los prestamos disminuiran las unidades disponibles y las devoluciones las incrementaran.

### RN-04. Conservacion del historial y baja logica

Los registros de prestamos y devoluciones no podran eliminarse fisicamente.

Los datos congelados en cada operacion deberan conservar la informacion original del instrumento y del estudiante al momento de realizarse la operacion.

Los cambios posteriores en el catalogo no deberan modificar la informacion historica de los prestamos y devoluciones.

Los instrumentos retirados del catalogo deberan manejarse mediante baja logica, sin eliminar los registros historicos asociados.

### RN-05. Control de concurrencia

Cuando dos operadores intenten entregar simultaneamente la ultima unidad disponible de un instrumento, solamente una operacion podra completarse.

La operacion que no consiga la disponibilidad debera responder con HTTP 409 Conflict.

### RN-06. Manejo de fechas y comunicacion con el usuario

Las fechas y horas de las operaciones deberan almacenarse y procesarse en UTC.

Los mensajes y textos presentados al usuario deberan estar en español.

## 6. Requisitos funcionales

Los siguientes requisitos funcionales describen las operaciones que debe permitir el sistema Music School. Cada requisito esta relacionado con una historia de usuario y debe cumplir las reglas de negocio establecidas.

| Codigo | Requisito funcional | Historia relacionada |
|---|---|---|
| RF-01 | Registrar modelos de instrumentos, asignarles un codigo unico, una categoria y sus unidades totales y disponibles. | HU-01 |
| RF-02 | Consultar el catalogo de instrumentos activos, mostrando su categoria y unidades disponibles. | HU-02 |
| RF-03 | Registrar y consultar la informacion de los estudiantes. | HU-03 |
| RF-04 | Registrar prestamos asociados a estudiantes e instrumentos, validando la disponibilidad, el limite de prestamos pendientes y el plazo de 21 dias. | HU-04 |
| RF-05 | Registrar devoluciones de prestamos, actualizar la disponibilidad y conservar el historial de la operacion. | HU-05 |
| RF-06 | Identificar y consultar los prestamos vencidos que permanezcan pendientes de devolucion. | HU-06 |
| RF-07 | Consultar y controlar las unidades totales y disponibles de cada modelo de instrumento, manteniendo la integridad del inventario. | HU-07 |
| RF-08 | Consultar y conservar el historial de prestamos y devoluciones, manteniendo la informacion original de cada operacion. | HU-08 |
| RF-09 | Generar un reporte de los modelos de instrumentos mas solicitados, ordenados segun la cantidad de prestamos registrados. | HU-09 |
| RF-10 | Controlar las solicitudes de prestamos simultaneas, evitando inconsistencias en el inventario y respondiendo con HTTP 409 Conflict cuando no exista disponibilidad. | HU-10 |

## 7. Requisitos no funcionales

Los siguientes requisitos establecen las condiciones de calidad, seguridad, integridad, mantenibilidad, despliegue y verificabilidad del sistema Music School.

### RNF-01. Seguridad

El sistema debe validar las operaciones en el backend para evitar modificaciones no autorizadas o datos inconsistentes.

Las credenciales y secretos deben gestionarse mediante variables de entorno. Las contraseñas, cuando existan, deben almacenarse utilizando mecanismos seguros de hash.

**Verificacion:**
- Comprobar que las validaciones de las operaciones se ejecuten en Laravel.
- Verificar que los secretos no esten escritos directamente en el codigo fuente.
- Comprobar que las contraseñas no se almacenen en texto plano.
- Comprobar que las operaciones rechazadas por las validaciones no modifiquen los datos almacenados.

### RNF-02. Integridad de datos

La base de datos debe mantener la integridad referencial y las restricciones definidas para el inventario y los prestamos.

Las operaciones que modifiquen las unidades disponibles deben ejecutarse de manera consistente, incluso cuando existan solicitudes simultaneas.

**Verificacion:**
- Comprobar que las unidades disponibles nunca sean inferiores a cero.
- Comprobar que las unidades disponibles nunca superen las unidades totales.
- Verificar que los prestamos y las devoluciones actualicen correctamente el inventario.
- Ejecutar pruebas de concurrencia para comprobar que solamente una operacion pueda entregar la ultima unidad disponible.
- Verificar que una operacion rechazada por falta de disponibilidad no genere un prestamo ni modifique el inventario.

### RNF-03. Mantenibilidad

El codigo debe mantener separacion de responsabilidades entre frontend, backend y persistencia.

Los identificadores de clases, metodos, variables y demas elementos del codigo deben escribirse en ingles. Los mensajes visibles para el usuario deben estar en español.

**Verificacion:**
- Revisar la organizacion del codigo fuente.
- Comprobar la separacion de responsabilidades entre React y Laravel.
- Revisar los nombres de clases, metodos, variables y tablas.
- Verificar que los mensajes presentados al usuario esten en español.

### RNF-04. Portabilidad y despliegue

Los servicios del proyecto deben poder ejecutarse mediante contenedores Docker.

La infraestructura debe permitir levantar los servicios requeridos mediante un solo comando.

**Verificacion:**
- Ejecutar el proyecto desde una configuracion limpia.
- Comprobar que los contenedores se inicien correctamente.
- Comprobar la conexion entre el backend y la base de datos.
- Verificar que el despliegue pueda realizarse mediante un solo comando.

### RNF-05. Verificabilidad

El proyecto debe contar con pruebas automatizadas que permitan comprobar las funcionalidades y reglas de negocio definidas en esta especificacion.

La entrega debe contener al menos 15 archivos de pruebas automatizadas.

**Verificacion:**
- Revisar la existencia de los archivos de pruebas.
- Ejecutar las pruebas automatizadas.
- Comprobar que las pruebas validen los comportamientos esperados y los escenarios de error.
- Verificar que existan al menos 15 archivos de pruebas automatizadas.
- Comprobar que las pruebas cubran las diez historias de usuario y las seis reglas de negocio.

## 8. Restricciones del sistema

1. El frontend debe desarrollarse con React.
2. El backend debe desarrollarse con PHP y Laravel.
3. La persistencia debe utilizar MySQL.
4. La comunicacion entre frontend y backend debe realizarse mediante una API REST.
5. Los datos intercambiados mediante la API deben utilizar JSON.
6. El sistema debe ejecutarse mediante contenedores Docker.
7. Los identificadores del codigo deben estar en ingles.
8. Los mensajes visibles para el usuario deben estar en español.
9. Las fechas y horas deben manejarse en UTC.
10. No se deben desarrollar funcionalidades fuera de la especificacion.

## 9. Criterios generales de aceptacion

El sistema Music School se considerara funcionalmente aceptable cuando se verifique el cumplimiento de las siguientes condiciones:

- Se puedan registrar y consultar modelos de instrumentos con sus respectivos codigos, categorias y unidades.
- Se encuentren disponibles las cinco categorias iniciales: cuerdas, vientos, percusion, teclados y electronicos.
- Se puedan registrar y consultar estudiantes.
- Se puedan registrar prestamos asociados a estudiantes e instrumentos existentes.
- Se puedan registrar devoluciones y actualizar correctamente las unidades disponibles.
- Se aplique el limite maximo de un instrumento pendiente de devolucion por estudiante.
- Se establezca un plazo de 21 dias para cada prestamo.
- Se identifiquen los prestamos vencidos y se impidan nuevos prestamos a estudiantes que tengan prestamos vencidos pendientes de devolucion.
- Las unidades disponibles permanezcan siempre entre cero y las unidades totales.
- Se conserve el historial de prestamos y devoluciones sin eliminacion fisica ni modificacion de los datos congelados.
- Los instrumentos retirados del catalogo utilicen baja logica.
- Se genere el reporte de los modelos de instrumentos mas solicitados, ordenados por cantidad de prestamos registrados.
- Se controle la concurrencia cuando dos operadores intenten entregar la ultima unidad disponible: una operacion debe completarse y la otra debe recibir HTTP 409 Conflict.
- Las fechas y horas de las operaciones se almacenen y procesen en UTC.
- Los mensajes y textos visibles para el usuario se presenten en español.
- El proyecto pueda ejecutarse mediante contenedores Docker utilizando un solo comando.
- Se disponga de al menos 15 archivos de pruebas automatizadas que permitan verificar las diez historias de usuario y las seis reglas de negocio.

## 10. Trazabilidad de requisitos

La siguiente matriz relaciona las historias de usuario con sus requisitos funcionales, reglas de negocio y requisitos no funcionales aplicables. Tambien permite identificar los requisitos transversales que afectan al desarrollo y validacion del sistema.

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

Los siguientes requisitos no funcionales aplican de manera general al proyecto y no se limitan a una historia de usuario especifica.

| Requisito | Historias y alcance relacionado |
|---|---|
| RNF-03. Mantenibilidad | Todas las historias y componentes del sistema. |
| RNF-04. Portabilidad y despliegue | Proyecto completo: frontend, backend y base de datos. |
| RNF-05. Verificabilidad | Las diez historias de usuario y las seis reglas de negocio. |

## 11. Relacion con los demas documentos

Esta especificacion servira como referencia para construir los siguientes artefactos del proyecto. Todos los documentos deberan mantener coherencia con los requisitos funcionales, reglas de negocio, requisitos no funcionales y restricciones establecidos en este documento.

| Documento | Relacion |
|---|---|
| constitution.md | Establece los principios, lineamientos y restricciones generales del proyecto. |
| plan.md | Define la planificacion y organizacion de las actividades de desarrollo. |
| architecture.md | Describe la arquitectura tecnica y la distribucion de responsabilidades del sistema. |
| data-model.md | Define el modelo de datos, las entidades, sus atributos y relaciones. |
| api-contract.md | Especifica los endpoints, metodos HTTP, estructuras JSON y respuestas de la API. |
| tasks.md | Descompone el trabajo de implementacion en las 23 tareas establecidas. |
| adr/ | Contiene el registro de al menos 3 decisiones arquitectonicas y sus justificaciones. |

Los artefactos deberan respetar el alcance definido en esta especificacion y mantener la trazabilidad entre las historias de usuario, los requisitos funcionales, las reglas de negocio y los requisitos no funcionales. No deberan introducir funcionalidades que no esten contempladas en ella.

## 12. Control de cambios

| Version | Fecha | Descripcion | Estado |
|---|---|---|---|
| 1.0 | 07/11/2026 | Creacion inicial de la especificacion de Music School. | Borrador |
| 1.1 | 07/11/2026 | Ajustes en los criterios de aceptacion de las historias HU-02 y HU-05 para mejorar la coherencia con el modelo de datos. | Borrador para validacion |