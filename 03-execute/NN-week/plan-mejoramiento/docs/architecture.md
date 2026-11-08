# Arquitectura del sistema — Music School

**Identificador:** music-school  
**Proyecto:** Sistema de préstamo de instrumentos musicales  
**Ficha:** ADSO 3239137  
**Código del aprendiz:** A12  
**Versión:** 1.1
**Estado:** Borrador para validación

---

## 1. Propósito

El presente documento describe la arquitectura técnica del sistema Music School, estableciendo la organización de sus componentes, responsabilidades, mecanismos de comunicación y distribución de la infraestructura.

La arquitectura define cómo se integrarán el frontend, backend, base de datos y demás componentes necesarios para gestionar el préstamo y devolución de instrumentos musicales.

Su diseño deberá respetar los principios establecidos en `constitution.md` y los requisitos funcionales, reglas de negocio y requisitos no funcionales definidos en `spec.md`.

## 2. Objetivo arquitectónico

Definir una arquitectura organizada, mantenible y segura que permita desarrollar Music School mediante componentes independientes en sus responsabilidades, con comunicación centralizada a través de una API REST.

## 3. Estilo arquitectónico

El sistema utilizará una arquitectura cliente-servidor con separación de responsabilidades por capas.

Se establecerán los siguientes componentes principales:

- **Frontend:** aplicación web desarrollada con React.
- **Backend:** aplicación desarrollada con PHP y Laravel.
- **Persistencia:** base de datos MySQL.
- **Sitio público:** página estática para presentar el producto.
- **Infraestructura:** servicios configurados mediante Docker.
- **Herramienta de inicialización:** mecanismo de siembra de datos mediante la API.

El backend utilizará una organización por capas para separar las responsabilidades de presentación de la API, lógica de negocio y acceso a datos.

## 4. Componentes principales

### 4.1. Frontend — React

**Tecnología:** React.

**Responsabilidad:**

Proporcionar la interfaz de usuario para interactuar con las funcionalidades del sistema.

**Funciones principales:**

- Consultar el catálogo de instrumentos.
- Consultar las unidades disponibles.
- Gestionar la información de los estudiantes.
- Registrar préstamos.
- Registrar devoluciones.
- Consultar préstamos vencidos.
- Consultar el historial de operaciones.
- Consultar el inventario.
- Visualizar el reporte de instrumentos más solicitados.

**Reglas de implementación:**

- Consumir los endpoints definidos en `api-contract.md`.
- Enviar solicitudes HTTP al backend.
- Presentar mensajes de usuario en español.
- Mantener la lógica de presentación separada de las reglas de negocio.
- No acceder directamente a la base de datos.

### 4.2. Backend — PHP y Laravel

**Tecnología:** PHP con Laravel.

**Responsabilidad:**

Centralizar la lógica de negocio, validar las operaciones y controlar el acceso a los datos.

**Funciones principales:**

- Gestionar instrumentos y categorías.
- Gestionar estudiantes.
- Registrar préstamos.
- Registrar devoluciones.
- Controlar los vencimientos.
- Validar la disponibilidad del inventario.
- Conservar la información histórica.
- Generar el reporte de instrumentos más solicitados.
- Controlar las operaciones simultáneas.
- Proporcionar respuestas HTTP y JSON.

**Organización interna:**

El backend se organizará mediante las siguientes capas:

**Controladores (Controllers)**

Reciben las solicitudes HTTP, validan la entrada inicial, invocan la lógica correspondiente y devuelven las respuestas.

**Servicios (Services)**

Contienen las reglas de negocio y coordinan las operaciones del sistema.

**Modelos (Models)**

Representan las entidades y permiten interactuar con la persistencia mediante Laravel Eloquent.

**Migraciones (Migrations)**

Definen la estructura de las tablas, relaciones y restricciones de la base de datos.

**Rutas (Routes)**

Definen los endpoints disponibles para la comunicación con el frontend y las herramientas autorizadas.

### 4.3. Base de datos — MySQL

**Tecnología:** MySQL.

**Responsabilidad:**

Almacenar y conservar la información del sistema, garantizando la integridad de los datos.

**Entidades principales:**

- `categories`
- `instruments`
- `students`
- `loans`
- `returns`

**Responsabilidades de persistencia:**

- Conservar las categorías de instrumentos.
- Registrar los instrumentos y sus unidades.
- Almacenar la información de los estudiantes.
- Conservar los préstamos realizados.
- Registrar las devoluciones.
- Mantener las relaciones entre las entidades.
- Aplicar las restricciones de integridad.
- Preservar la información histórica de las operaciones.

La estructura de la base de datos deberá corresponder con lo definido en `data-model.md`.

#### Acceso a datos y gestión del esquema

Laravel utilizará Eloquent ORM para interactuar con la base de datos MySQL mediante modelos que representan las entidades definidas en `data-model.md`.

Los modelos Eloquent permitirán consultar, crear, actualizar y relacionar los registros de las entidades del sistema, evitando que los controladores accedan directamente a la base de datos.

Las migraciones de Laravel definirán la estructura física de las tablas, sus columnas, claves primarias, claves foráneas, restricciones e índices necesarios.

Las tablas principales serán:

- `categories`
- `instruments`
- `students`
- `loans`
- `returns`

La estructura implementada mediante las migraciones deberá mantener correspondencia con el modelo de datos documentado en `docs/data-model.md`.

De esta manera, `data-model.md` será la referencia del diseño lógico y las migraciones Laravel serán el mecanismo para construir y mantener el esquema de la base de datos MySQL.

### 4.4. Sitio público estático

**Tecnología:** tecnologías web estáticas.

**Responsabilidad:**

Presentar el producto Music School mediante una página pública informativa.

La página deberá describir el propósito del sistema y sus principales características.

No reemplazará la aplicación funcional ni realizará operaciones de préstamo o devolución.

### 4.5. Infraestructura — Docker

**Tecnología:** Docker y Docker Compose.

**Responsabilidad:**

Permitir la ejecución integrada de los servicios requeridos por el proyecto.

La infraestructura contemplará:

- Servicio del backend.
- Servicio del frontend.
- Servicio de base de datos MySQL.
- Servicio o configuración necesaria para presentar el sitio público estático.

Los servicios deberán configurarse para iniciar mediante un solo comando, de acuerdo con el requisito de despliegue.

### 4.6. Herramienta de siembra de datos

**Responsabilidad:**

Facilitar la inicialización de información de prueba mediante los endpoints de la API.

Deberá permitir preparar los datos necesarios para validar las funcionalidades del sistema sin modificar directamente la base de datos por fuera de los mecanismos establecidos.

La información inicial deberá contemplar las cinco categorías de instrumentos definidas en `spec.md`.

## 5. Arquitectura lógica

La comunicación entre los componentes seguirá el siguiente flujo:

```text
                         USUARIO
                            |
                            v
                 +----------------------+
                 |      FRONTEND        |
                 |        React         |
                 +----------------------+
                            |
                            | HTTP / JSON
                            v
                 +----------------------+
                 |       BACKEND        |
                 |       Laravel        |
                 +----------------------+
                            |
                            v
                 +----------------------+
                 |     CONTROLADORES    |
                 |     (Controllers)    |
                 +----------------------+
                            |
                            v
                 +----------------------+
                 |       SERVICIOS      |
                 |  Reglas de negocio   |
                 +----------------------+
                            |
                            v
                 +----------------------+
                 |       MODELOS        |
                 |    Laravel Eloquent |
                 +----------------------+
                            |
                            v
                 +----------------------+
                 |        MySQL         |
                 |     Base de datos    |
                 +----------------------+

     +----------------------+       +----------------------+
     |    SITIO PÚBLICO     |       | HERRAMIENTA DE       |
     |    Página estática  |       | SIEMBRA DE DATOS     |
     +----------------------+       +----------------------+
                                            |
                                            | HTTP / JSON
                                            v
                                   +----------------------+
                                   |       BACKEND        |
                                   |       Laravel        |
                                   +----------------------+

              INFRAESTRUCTURA: DOCKER COMPOSE
       Administra los servicios y su configuración.
```

El frontend no tendrá acceso directo a MySQL. Todas las operaciones de consulta y modificación deberán realizarse mediante los endpoints del backend.

El sitio público estático será un componente independiente de presentación del producto.

## 6. Flujo de las operaciones principales

### 6.1. Registro de préstamos

1. El frontend envía la solicitud de préstamo al backend.
2. Laravel recibe y valida los datos de entrada.
3. El servicio de préstamos verifica que el estudiante exista y cumpla las reglas de préstamo.
4. Inicia una transacción en la base de datos.
5. Consulta y bloquea el registro del instrumento mediante `lockForUpdate()`.
6. Después de adquirir el bloqueo, verifica que el instrumento esté activo y tenga unidades disponibles.
7. Comprueba nuevamente las restricciones del estudiante antes de registrar la operación.
8. Registra el préstamo con la información histórica correspondiente.
9. Disminuye las unidades disponibles en una unidad.
10. Confirma la transacción mediante `commit()`.
11. Devuelve la respuesta al frontend.

Si alguna validación falla, la operación deberá cancelarse mediante `rollback()`, sin modificar indebidamente los datos. Si no hay unidades disponibles, el backend responderá con HTTP 409 Conflict.

### 6.2. Registro de devoluciones

1. El frontend envía la solicitud de devolución.
2. Laravel identifica el préstamo correspondiente.
3. Verifica que el préstamo no tenga una devolución registrada.
4. Inicia una transacción.
5. Registra la devolución con fecha y hora UTC.
6. Incrementa las unidades disponibles del instrumento.
7. Comprueba que las unidades disponibles no superen el total.
8. Confirma la transacción.
9. Devuelve la respuesta al frontend.

La información original del préstamo deberá conservarse sin modificaciones.

### 6.3. Control de concurrencia
#### Control de concurrencia en los préstamos

Cuando dos operadores intentan registrar simultáneamente un préstamo de la última unidad disponible de un instrumento, el backend debe garantizar que solo una operación pueda completarse.

Para ello, Laravel ejecutará el proceso dentro de una transacción de base de datos y utilizará un bloqueo de fila (`lockForUpdate()`) sobre el registro del instrumento.

El procedimiento será el siguiente:

1. Iniciar una transacción en la base de datos.
2. Consultar el instrumento y bloquear su registro mediante `lockForUpdate()`.
3. Una vez adquirido el bloqueo, verificar nuevamente que el instrumento esté activo y tenga unidades disponibles.
4. Si existe disponibilidad, registrar el préstamo y disminuir las unidades disponibles en una unidad.
5. Confirmar la transacción mediante `commit()`.
6. Si no hay unidades disponibles, cancelar la operación mediante `rollback()` y responder con el código HTTP `409 Conflict`.

De esta manera, si dos operadores intentan prestar la última unidad al mismo tiempo, el primero podrá completar la operación y el segundo recibirá una respuesta HTTP 409, evitando que el inventario quede con cantidades inconsistentes.

La validación de disponibilidad debe realizarse después de adquirir el bloqueo, no antes.

## 7. Reglas de seguridad e integridad

La arquitectura deberá cumplir los siguientes lineamientos:

- Las validaciones de negocio deberán ejecutarse en el backend.
- Los secretos y credenciales deberán gestionarse mediante variables de entorno.
- Las contraseñas, cuando existan, deberán almacenarse mediante mecanismos seguros de hash.
- El acceso a la base de datos deberá realizarse desde el backend.
- Las operaciones que modifiquen el inventario deberán ejecutarse mediante transacciones.
- Se deberán aplicar las restricciones de integridad definidas en `data-model.md`.
- Los préstamos y devoluciones no deberán eliminarse físicamente.
- Los instrumentos retirados deberán manejarse mediante baja lógica.
- Los datos históricos deberán conservar la información original de cada operación.
- Las fechas y horas deberán almacenarse y procesarse en UTC.
- Los mensajes visibles para el usuario deberán estar en español.

## 8. Contrato de comunicación

La comunicación entre frontend y backend se realizará mediante una API REST utilizando HTTP y JSON.

El contrato detallado de comunicación se documentará en `api-contract.md`.

Este documento deberá definir:

- Endpoints.
- Métodos HTTP.
- Parámetros de entrada.
- Estructuras de solicitudes.
- Estructuras de respuestas.
- Códigos de estado HTTP.
- Validaciones y errores.

Las respuestas deberán utilizar los códigos HTTP correspondientes al resultado de cada operación, incluyendo HTTP 409 Conflict para los conflictos de disponibilidad definidos en las reglas de negocio.

## 9. Organización de la infraestructura

La infraestructura se organizará mediante Docker Compose para facilitar la ejecución integrada del proyecto.

La estructura prevista será:

music-school/
├── docs/
│   ├── constitution.md
│   ├── spec.md
│   ├── plan.md
│   ├── architecture.md
│   ├── data-model.md
│   ├── api-contract.md
│   ├── tasks.md
│   └── adr/
├── api/
├── app/
├── page/
├── infra/
│   ├── docker-compose.yml
│   └── README.md
└── tool/

La configuración definitiva deberá corresponder con la ubicación real de los archivos de construcción y configuración de cada componente.

Los servicios deberán utilizar variables de entorno para la configuración de credenciales y conexiones.

La ejecución del proyecto deberá realizarse mediante un solo comando de Docker Compose.

#### Orquestación de servicios con Docker Compose

Docker Compose será el encargado de definir, configurar y coordinar los servicios necesarios para ejecutar Music School.

La configuración contemplará los siguientes servicios:

- **Backend:** aplicación desarrollada con PHP y Laravel, responsable de la lógica de negocio y la API REST.
- **Frontend:** aplicación desarrollada con React, responsable de la interfaz de usuario.
- **Base de datos:** MySQL, encargado del almacenamiento persistente de la información.
- **Sitio público:** aplicación estática destinada a presentar el producto.

Docker Compose permitirá establecer las configuraciones, puertos, variables de entorno, redes y dependencias necesarias entre los servicios.

El objetivo es que el entorno de desarrollo pueda iniciarse mediante un único comando:

`docker compose up -d`

La configuración definitiva de los servicios se establecerá en el archivo `infra/docker-compose.yml`.

## 10. Restricciones arquitectónicas

La solución deberá respetar las siguientes restricciones:

- El frontend se desarrollará utilizando React.
- El backend se desarrollará utilizando PHP y Laravel.
- La persistencia utilizará MySQL.
- La comunicación entre frontend y backend se realizará mediante API REST.
- Los datos se intercambiarán mediante JSON.
- La infraestructura utilizará Docker.
- Las reglas de negocio se centralizarán en el backend.
- Los identificadores del código se escribirán en inglés.
- Los mensajes visibles para el usuario se escribirán en español.
- No se introducirán funcionalidades fuera del alcance establecido en `spec.md`.

## 11. Relación con los demás documentos

| Documento | Relación arquitectónica |
|---|---|
| `constitution.md` | Establece los principios y restricciones que debe respetar la arquitectura. |
| `spec.md` | Define las funcionalidades, reglas de negocio y requisitos que debe soportar. |
| `plan.md` | Organiza las fases y actividades para diseñar e implementar la solución. |
| `data-model.md` | Define la estructura de persistencia y las relaciones de datos. |
| `api-contract.md` | Define la comunicación entre frontend y backend. |
| `tasks.md` | Descompone la implementación en las 23 tareas establecidas. |
| `adr/` | Registra las decisiones arquitectónicas y sus justificaciones. |

## 12. Decisiones arquitectónicas

Las decisiones relevantes de arquitectura deberán documentarse mediante registros ADR (Architecture Decision Records).

Se deberán elaborar al menos tres registros que documenten las decisiones adoptadas, sus contextos, alternativas y justificaciones.

Los registros deberán mantenerse en el directorio `docs/adr/`.

## 13. Control de cambios

| Versión | Fecha | Descripción | Estado |
|---|---|---|---|
| 1.0 | 07/11/2026 | Creación inicial del documento de arquitectura de Music School. | Borrador para validación |
| 1.1 | 08/11/2026 | Actualización del diagrama de arquitectura lógica, descripción del control de concurrencia, organización de infraestructura Docker Compose, acceso a datos mediante Eloquent y migraciones, y estructura de directorios. | Borrador para validación |