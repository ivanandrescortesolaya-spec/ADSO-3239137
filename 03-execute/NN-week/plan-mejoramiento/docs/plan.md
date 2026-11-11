# Plan de desarrollo — Music School

**Identificador:** music-school  
**Proyecto:** Sistema de prestamo de instrumentos musicales  
**Ficha:** ADSO 3239137  
**Codigo del aprendiz:** A12  
**Version:** 1.0  
**Estado:** Borrador para validacion  

---

## 1. Proposito

El presente documento establece la planificacion del desarrollo del proyecto Music School, un sistema destinado a gestionar el prestamo y devolucion de instrumentos musicales.

El plan organiza las actividades de trabajo en fases, define sus objetivos, entregables y dependencias, y establece una secuencia de ejecucion que permita desarrollar el sistema de acuerdo con los requisitos funcionales, reglas de negocio y requisitos no funcionales definidos en `spec.md`.

## 2. Objetivo general

Organizar y controlar las actividades necesarias para diseñar, implementar, probar y desplegar Music School, garantizando el cumplimiento de los requisitos establecidos en la especificacion del proyecto.

## 3. Objetivos especificos

- Organizar las actividades de desarrollo mediante fases de trabajo.
- Establecer los entregables correspondientes a cada fase.
- Definir las dependencias entre los artefactos de documentacion y los componentes del sistema.
- Garantizar la trazabilidad entre requisitos, diseño, implementacion y pruebas.
- Planificar la integracion del frontend, backend y base de datos.
- Establecer actividades de validacion y despliegue mediante Docker.

## 4. Alcance de la planificacion

La planificacion contempla las siguientes actividades:

- Elaboracion y validacion de la documentacion tecnica.
- Diseño de la arquitectura del sistema.
- Definicion del contrato de la API.
- Diseño e implementacion del modelo de datos.
- Desarrollo del backend utilizando PHP y Laravel.
- Desarrollo del frontend utilizando React.
- Implementacion de la infraestructura mediante Docker.
- Creacion de un sitio publico estatico para presentar el producto.
- Implementacion de un mecanismo de siembra de datos mediante la API.
- Elaboracion y ejecucion de pruebas automatizadas.
- Validacion de los requisitos funcionales y no funcionales.

El desarrollo debera respetar las diez historias de usuario, las seis reglas de negocio y los cinco requisitos no funcionales establecidos en `spec.md`.

## 5. Fases de desarrollo

### Fase 1. Organizacion y especificacion

**Objetivo:** establecer los lineamientos, requisitos y restricciones que orientaran el desarrollo.

**Actividades:**
- Definir los principios generales del proyecto.
- Identificar los actores del sistema.
- Documentar las diez historias de usuario.
- Definir los requisitos funcionales y no funcionales.
- Documentar las seis reglas de negocio.
- Establecer los criterios de aceptacion.
- Elaborar la matriz de trazabilidad.

**Entregables:**
- `constitution.md`
- `spec.md`

### Fase 2. Planificacion y diseño de la solucion

**Objetivo:** definir como se organizara y construira tecnicamente el sistema.

**Actividades:**
- Organizar las actividades de desarrollo.
- Definir la arquitectura general.
- Establecer la separacion de responsabilidades entre frontend, backend y persistencia.
- Documentar las decisiones arquitectonicas.
- Definir la estructura de comunicacion entre los componentes.

**Entregables:**

- Plan de desarrollo validado.
- `architecture.md`
- Directorio `adr/` con al menos tres registros de decisiones arquitectonicas.
### Fase 3. Diseño del modelo de datos y contrato de API

**Objetivo:** establecer la estructura de persistencia y las reglas de comunicacion entre los componentes del sistema.

**Actividades:**
- Identificar las entidades y sus atributos.
- Definir las claves primarias y foraneas.
- Establecer las relaciones entre las entidades.
- Definir las restricciones de integridad.
- Establecer MySQL como sistema gestor de base de datos del proyecto.
- Definir la correspondencia entre el modelo de datos y las migraciones de Laravel.
- Documentar el manejo de prestamos y devoluciones.
- Definir los endpoints y metodos HTTP.
- Especificar las estructuras de solicitudes y respuestas JSON.
- Documentar los codigos de respuesta HTTP.

**Entregables:**
- `data-model.md`
- `api-contract.md`

### Fase 4. Organizacion de tareas e implementacion

**Objetivo:** desarrollar los componentes funcionales del sistema de acuerdo con los requisitos y el diseño aprobado.

**Actividades:**
- Descomponer el trabajo en las 23 tareas establecidas.
- Implementar la estructura del backend con Laravel.
- Implementar la estructura del frontend con React.
- Configurar la conexion con la base de datos.
- Implementar la gestion de instrumentos y estudiantes.
- Implementar el registro de prestamos y devoluciones.
- Implementar el control de vencimientos.
- Implementar el inventario y el historial.
- Implementar el reporte de instrumentos mas solicitados.
- Implementar el control de concurrencia.
- Construir el sitio publico estatico.
- Implementar la siembra de datos mediante la API.

**Entregable:**
- `tasks.md`
- Codigo fuente de los componentes del sistema.

### Fase 5. Infraestructura e integracion

**Objetivo:** integrar los componentes y preparar el entorno de ejecucion del proyecto.

**Actividades:**
- Configurar los servicios mediante Docker.
- Configurar la base de datos.
- Configurar el backend y el frontend.
- Establecer la comunicacion entre los contenedores.
- Configurar las variables de entorno.
- Verificar que los servicios puedan levantarse mediante un solo comando.
- Comprobar la ejecucion desde una configuracion limpia.

**Entregable:**
- Configuracion de infraestructura en `infra/`.
- Aplicacion integrada y ejecutable.

### Fase 6. Pruebas y validacion

**Objetivo:** comprobar que el sistema cumpla los requisitos y las reglas de negocio definidas.

**Actividades:**
- Elaborar pruebas automatizadas para las funcionalidades.
- Verificar las diez historias de usuario.
- Comprobar las seis reglas de negocio.
- Validar las restricciones del inventario.
- Comprobar el limite de prestamos por estudiante.
- Verificar el calculo de los vencimientos.
- Probar el registro de devoluciones.
- Ejecutar pruebas de concurrencia.
- Comprobar las respuestas HTTP esperadas.
- Verificar el manejo de fechas UTC.
- Comprobar que los mensajes visibles esten en español.
- Ejecutar la totalidad de las pruebas automatizadas.

**Criterios de validacion:**
- Contar con al menos 15 archivos de pruebas automatizadas.
- Comprobar la cobertura de las diez historias de usuario y las seis reglas de negocio.
- Verificar los escenarios correctos y los escenarios de error.
- Comprobar que las operaciones rechazadas no generen modificaciones indebidas.

**Entregable:**
- Archivos de pruebas automatizadas.
- Resultados de ejecucion y validacion.

### Fase 7. Preparacion de la entrega

**Objetivo:** organizar y verificar los artefactos finales del proyecto para su entrega y sustentacion.

**Actividades:**
- Revisar la estructura del repositorio.
- Verificar la documentacion tecnica.
- Comprobar la configuracion de Docker.
- Verificar el funcionamiento del sistema.
- Revisar los archivos README.
- Comprobar que no se incluyan secretos ni dependencias innecesarias.
- Organizar los entregables en las carpetas establecidas.
- Preparar la explicacion tecnica de las decisiones implementadas.

**Entregables:**
- Proyecto organizado en el repositorio.
- Documentacion tecnica.
- Aplicacion ejecutable.
- Pruebas automatizadas.
- Material necesario para la sustentacion.

## 6. Dependencias entre fases

El desarrollo seguira una secuencia de dependencias para evitar inconsistencias entre los requisitos, el diseño y la implementacion.

| Fase | Depende de |
|---|---|
| Fase 1. Especificacion | Lineamientos iniciales del proyecto |
| Fase 2. Diseño | Fase 1 |
| Fase 3. Modelo de datos y API | Fases 1 y 2 |
| Fase 4. Implementacion | Fases 1, 2 y 3 |
| Fase 5. Infraestructura | Diseño e implementacion de componentes |
| Fase 6. Pruebas | Funcionalidades implementadas e integradas |
| Fase 7. Entrega | Validacion de los entregables anteriores |

Las actividades podran desarrollarse de manera iterativa cuando sus dependencias lo permitan, manteniendo la coherencia entre los artefactos.

## 7. Cronograma e hitos de desarrollo

El desarrollo de Music School se organizara mediante hitos de trabajo que permitiran controlar el avance de las actividades y verificar el cumplimiento de los entregables.

| Hito | Actividad | Entregable o resultado |
|---|---|---|
| Hito 1 | Finalizacion de la documentacion inicial. | `constitution.md` y `spec.md` |
| Hito 2 | Elaboracion del modelo de datos. | `data-model.md` |
| Hito 3 | Definicion de la planificacion y arquitectura. | `plan.md`, `architecture.md` y ADR. |
| Hito 4 | Definicion del contrato de comunicacion. | `api-contract.md` |
| Hito 5 | Organizacion de las actividades de implementacion. | `tasks.md` y 23 tareas definidas. |
| Hito 6 | Desarrollo e integracion de los componentes. | Backend, frontend, sitio publico e infraestructura. |
| Hito 7 | Ejecucion de pruebas y validacion. | Minimo 15 archivos de pruebas automatizadas. |
| Hito 8 | Preparacion de la entrega y sustentacion. | Proyecto completo y documentacion organizada. |

Las fechas especificas de ejecucion y finalizacion de cada hito se estableceran de acuerdo con el avance real del proyecto y las fechas oficiales de entrega del plan de mejoramiento.

El seguimiento se realizara mediante la revision de los entregables, el estado de las tareas y los registros de cambios en el repositorio.

## 8. Criterios generales de seguimiento

Para controlar el avance del proyecto se tendran en cuenta los siguientes criterios:

- Cada fase debera contar con sus entregables correspondientes.
- Las actividades deberan mantener relacion con los requisitos definidos.
- Los cambios deberan registrarse y documentarse.
- Los componentes deberan respetar la arquitectura establecida.
- Las pruebas deberan comprobar los comportamientos esperados.
- Los errores identificados deberan corregirse antes de considerar finalizada la validacion.
- Los commits deberan representar cambios reales, pequeños y descriptivos.

## 9. Riesgos y medidas de control

| Riesgo | Medida de control |
|---|---|
| Inconsistencia entre documentacion e implementacion | Mantener la trazabilidad y actualizar los documentos afectados. |
| Errores en las operaciones de inventario | Implementar transacciones y restricciones de integridad. |
| Conflictos por solicitudes simultaneas | Aplicar mecanismos de bloqueo y validar la disponibilidad. |
| Problemas de comunicacion entre servicios | Verificar la configuracion y conectividad de Docker. |
| Cobertura insuficiente de pruebas | Comprobar las diez historias y las seis reglas de negocio. |
| Exposicion de informacion sensible | Gestionar secretos mediante variables de entorno. |

## 10. Estructura de entregables

Los artefactos del proyecto se organizaran de acuerdo con la siguiente estructura:

```text
plan-mejoramiento/
│
├── docs/
│   ├── constitution.md
│   ├── spec.md
│   ├── plan.md
│   ├── architecture.md
│   ├── data-model.md
│   ├── api-contract.md
│   ├── tasks.md
│   │
│   └── adr/
│       ├── ADR-001.md
│       ├── ADR-002.md
│       └── ADR-003.md
│
├── api/
├── app/
├── page/
├── infra/
├── tool/
│
└── README.md
```

Esta estructura representa la organizacion prevista de los entregables y no implica que todos los componentes esten implementados.

## 11. Control de cambios

| Version | Fecha | Descripcion | Estado |
|---|---|---|---|
| 1.0 | 07/11/2026 | Creacion inicial del plan de desarrollo de Music School. | Borrador para validacion |