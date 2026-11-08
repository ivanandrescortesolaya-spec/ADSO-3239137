# Plan de desarrollo — Music School

**Identificador:** music-school  
**Proyecto:** Sistema de préstamo de instrumentos musicales  
**Ficha:** ADSO 3239137  
**Código del aprendiz:** A12  
**Versión:** 1.0  
**Estado:** Borrador para validación  

---

## 1. Propósito

El presente documento establece la planificación del desarrollo del proyecto Music School, un sistema destinado a gestionar el préstamo y devolución de instrumentos musicales.

El plan organiza las actividades de trabajo en fases, define sus objetivos, entregables y dependencias, y establece una secuencia de ejecución que permita desarrollar el sistema de acuerdo con los requisitos funcionales, reglas de negocio y requisitos no funcionales definidos en `spec.md`.

## 2. Objetivo general

Organizar y controlar las actividades necesarias para diseñar, implementar, probar y desplegar Music School, garantizando el cumplimiento de los requisitos establecidos en la especificación del proyecto.

## 3. Objetivos específicos

- Organizar las actividades de desarrollo mediante fases de trabajo.
- Establecer los entregables correspondientes a cada fase.
- Definir las dependencias entre los artefactos de documentación y los componentes del sistema.
- Garantizar la trazabilidad entre requisitos, diseño, implementación y pruebas.
- Planificar la integración del frontend, backend y base de datos.
- Establecer actividades de validación y despliegue mediante Docker.

## 4. Alcance de la planificación

La planificación contempla las siguientes actividades:

- Elaboración y validación de la documentación técnica.
- Diseño de la arquitectura del sistema.
- Definición del contrato de la API.
- Diseño e implementación del modelo de datos.
- Desarrollo del backend utilizando PHP y Laravel.
- Desarrollo del frontend utilizando React.
- Implementación de la infraestructura mediante Docker.
- Creación de un sitio público estático para presentar el producto.
- Implementación de un mecanismo de siembra de datos mediante la API.
- Elaboración y ejecución de pruebas automatizadas.
- Validación de los requisitos funcionales y no funcionales.

El desarrollo deberá respetar las diez historias de usuario, las seis reglas de negocio y los cinco requisitos no funcionales establecidos en `spec.md`.

## 5. Fases de desarrollo

### Fase 1. Organización y especificación

**Objetivo:** establecer los lineamientos, requisitos y restricciones que orientarán el desarrollo.

**Actividades:**
- Definir los principios generales del proyecto.
- Identificar los actores del sistema.
- Documentar las diez historias de usuario.
- Definir los requisitos funcionales y no funcionales.
- Documentar las seis reglas de negocio.
- Establecer los criterios de aceptación.
- Elaborar la matriz de trazabilidad.

**Entregables:**
- `constitution.md`
- `spec.md`

### Fase 2. Planificación y diseño de la solución

**Objetivo:** definir cómo se organizará y construirá técnicamente el sistema.

**Actividades:**
- Organizar las actividades de desarrollo.
- Definir la arquitectura general.
- Establecer la separación de responsabilidades entre frontend, backend y persistencia.
- Documentar las decisiones arquitectónicas.
- Definir la estructura de comunicación entre los componentes.

**Entregables:**

- Plan de desarrollo validado.
- `architecture.md`
- Directorio `adr/` con al menos tres registros de decisiones arquitectónicas.
### Fase 3. Diseño del modelo de datos y contrato de API

**Objetivo:** establecer la estructura de persistencia y las reglas de comunicación entre los componentes del sistema.

**Actividades:**
- Identificar las entidades y sus atributos.
- Definir las claves primarias y foráneas.
- Establecer las relaciones entre las entidades.
- Definir las restricciones de integridad.
- Establecer MySQL como sistema gestor de base de datos del proyecto.
- Definir la correspondencia entre el modelo de datos y las migraciones de Laravel.
- Documentar el manejo de préstamos y devoluciones.
- Definir los endpoints y métodos HTTP.
- Especificar las estructuras de solicitudes y respuestas JSON.
- Documentar los códigos de respuesta HTTP.

**Entregables:**
- `data-model.md`
- `api-contract.md`

### Fase 4. Organización de tareas e implementación

**Objetivo:** desarrollar los componentes funcionales del sistema de acuerdo con los requisitos y el diseño aprobado.

**Actividades:**
- Descomponer el trabajo en las 23 tareas establecidas.
- Implementar la estructura del backend con Laravel.
- Implementar la estructura del frontend con React.
- Configurar la conexión con la base de datos.
- Implementar la gestión de instrumentos y estudiantes.
- Implementar el registro de préstamos y devoluciones.
- Implementar el control de vencimientos.
- Implementar el inventario y el historial.
- Implementar el reporte de instrumentos más solicitados.
- Implementar el control de concurrencia.
- Construir el sitio público estático.
- Implementar la siembra de datos mediante la API.

**Entregable:**
- `tasks.md`
- Código fuente de los componentes del sistema.

### Fase 5. Infraestructura e integración

**Objetivo:** integrar los componentes y preparar el entorno de ejecución del proyecto.

**Actividades:**
- Configurar los servicios mediante Docker.
- Configurar la base de datos.
- Configurar el backend y el frontend.
- Establecer la comunicación entre los contenedores.
- Configurar las variables de entorno.
- Verificar que los servicios puedan levantarse mediante un solo comando.
- Comprobar la ejecución desde una configuración limpia.

**Entregable:**
- Configuración de infraestructura en `infra/`.
- Aplicación integrada y ejecutable.

### Fase 6. Pruebas y validación

**Objetivo:** comprobar que el sistema cumpla los requisitos y las reglas de negocio definidas.

**Actividades:**
- Elaborar pruebas automatizadas para las funcionalidades.
- Verificar las diez historias de usuario.
- Comprobar las seis reglas de negocio.
- Validar las restricciones del inventario.
- Comprobar el límite de préstamos por estudiante.
- Verificar el cálculo de los vencimientos.
- Probar el registro de devoluciones.
- Ejecutar pruebas de concurrencia.
- Comprobar las respuestas HTTP esperadas.
- Verificar el manejo de fechas UTC.
- Comprobar que los mensajes visibles estén en español.
- Ejecutar la totalidad de las pruebas automatizadas.

**Criterios de validación:**
- Contar con al menos 15 archivos de pruebas automatizadas.
- Comprobar la cobertura de las diez historias de usuario y las seis reglas de negocio.
- Verificar los escenarios correctos y los escenarios de error.
- Comprobar que las operaciones rechazadas no generen modificaciones indebidas.

**Entregable:**
- Archivos de pruebas automatizadas.
- Resultados de ejecución y validación.

### Fase 7. Preparación de la entrega

**Objetivo:** organizar y verificar los artefactos finales del proyecto para su entrega y sustentación.

**Actividades:**
- Revisar la estructura del repositorio.
- Verificar la documentación técnica.
- Comprobar la configuración de Docker.
- Verificar el funcionamiento del sistema.
- Revisar los archivos README.
- Comprobar que no se incluyan secretos ni dependencias innecesarias.
- Organizar los entregables en las carpetas establecidas.
- Preparar la explicación técnica de las decisiones implementadas.

**Entregables:**
- Proyecto organizado en el repositorio.
- Documentación técnica.
- Aplicación ejecutable.
- Pruebas automatizadas.
- Material necesario para la sustentación.

## 6. Dependencias entre fases

El desarrollo seguirá una secuencia de dependencias para evitar inconsistencias entre los requisitos, el diseño y la implementación.

| Fase | Depende de |
|---|---|
| Fase 1. Especificación | Lineamientos iniciales del proyecto |
| Fase 2. Diseño | Fase 1 |
| Fase 3. Modelo de datos y API | Fases 1 y 2 |
| Fase 4. Implementación | Fases 1, 2 y 3 |
| Fase 5. Infraestructura | Diseño e implementación de componentes |
| Fase 6. Pruebas | Funcionalidades implementadas e integradas |
| Fase 7. Entrega | Validación de los entregables anteriores |

Las actividades podrán desarrollarse de manera iterativa cuando sus dependencias lo permitan, manteniendo la coherencia entre los artefactos.

## 7. Cronograma e hitos de desarrollo

El desarrollo de Music School se organizará mediante hitos de trabajo que permitirán controlar el avance de las actividades y verificar el cumplimiento de los entregables.

| Hito | Actividad | Entregable o resultado |
|---|---|---|
| Hito 1 | Finalización de la documentación inicial. | `constitution.md` y `spec.md` |
| Hito 2 | Elaboración del modelo de datos. | `data-model.md` |
| Hito 3 | Definición de la planificación y arquitectura. | `plan.md`, `architecture.md` y ADR. |
| Hito 4 | Definición del contrato de comunicación. | `api-contract.md` |
| Hito 5 | Organización de las actividades de implementación. | `tasks.md` y 23 tareas definidas. |
| Hito 6 | Desarrollo e integración de los componentes. | Backend, frontend, sitio público e infraestructura. |
| Hito 7 | Ejecución de pruebas y validación. | Mínimo 15 archivos de pruebas automatizadas. |
| Hito 8 | Preparación de la entrega y sustentación. | Proyecto completo y documentación organizada. |

Las fechas específicas de ejecución y finalización de cada hito se establecerán de acuerdo con el avance real del proyecto y las fechas oficiales de entrega del plan de mejoramiento.

El seguimiento se realizará mediante la revisión de los entregables, el estado de las tareas y los registros de cambios en el repositorio.

## 8. Criterios generales de seguimiento

Para controlar el avance del proyecto se tendrán en cuenta los siguientes criterios:

- Cada fase deberá contar con sus entregables correspondientes.
- Las actividades deberán mantener relación con los requisitos definidos.
- Los cambios deberán registrarse y documentarse.
- Los componentes deberán respetar la arquitectura establecida.
- Las pruebas deberán comprobar los comportamientos esperados.
- Los errores identificados deberán corregirse antes de considerar finalizada la validación.
- Los commits deberán representar cambios reales, pequeños y descriptivos.

## 9. Riesgos y medidas de control

| Riesgo | Medida de control |
|---|---|
| Inconsistencia entre documentación e implementación | Mantener la trazabilidad y actualizar los documentos afectados. |
| Errores en las operaciones de inventario | Implementar transacciones y restricciones de integridad. |
| Conflictos por solicitudes simultáneas | Aplicar mecanismos de bloqueo y validar la disponibilidad. |
| Problemas de comunicación entre servicios | Verificar la configuración y conectividad de Docker. |
| Cobertura insuficiente de pruebas | Comprobar las diez historias y las seis reglas de negocio. |
| Exposición de información sensible | Gestionar secretos mediante variables de entorno. |

## 10. Estructura de entregables

Los artefactos del proyecto se organizarán de acuerdo con la siguiente estructura:

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

Esta estructura representa la organización prevista de los entregables y no implica que todos los componentes estén implementados.

## 11. Control de cambios

| Versión | Fecha | Descripción | Estado |
|---|---|---|---|
| 1.0 | 07/11/2026 | Creación inicial del plan de desarrollo de Music School. | Borrador para validación |