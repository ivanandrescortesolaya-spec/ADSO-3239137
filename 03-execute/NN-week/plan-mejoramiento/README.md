
Este proyecto es la solución del plan de mejoramiento del aprendiz A12, ficha 3239137, dominio music-school

# Music School

Sistema para administrar instrumentos musicales, categorías, estudiantes, préstamos y devoluciones.

El proyecto cuenta con **23 tareas documentadas como completadas**, integración mediante Docker Compose, pruebas automatizadas aprobadas y evidencias técnicas registradas en `docs/evidence.md`.

## Tecnologías verificadas

| Componente | Versión o requisito |
|---|---|
| PHP | `^8.3`, declarado en `api/composer.json` |
| Laravel | `^13.17`, declarado en `api/composer.json` |
| React | `^19.3.1`, declarado en `app/package.json` |
| Vite | `^8.3.6`, declarado en `app/package.json` |
| MySQL | Imagen `mysql:8.4` |
| Node.js | `>=20`, requerido por `tool/package.json` |
| Docker | Docker Compose |
| Comunicación | API HTTP con JSON |

Composer y npm administran las dependencias declaradas en sus manifiestos. Los componentes `api/` y `app/` incluyen archivos de bloqueo.

Docker Compose integra MySQL, Laravel, React y el sitio público estático.

## Estructura del repositorio

```text
.
|-- README.md
|-- api/
|   |-- app/
|   |   |-- Http/Controllers/Api/
|   |   |-- Models/
|   |   `-- Services/
|   |-- bootstrap/
|   |-- config/
|   |-- database/
|   |   |-- factories/
|   |   |-- migrations/
|   |   `-- seeders/
|   |-- public/
|   |-- resources/
|   |-- routes/
|   |-- tests/
|   |   |-- Feature/
|   |   `-- Unit/
|   |-- .env.example
|   |-- artisan
|   |-- composer.json
|   |-- composer.lock
|   `-- phpunit.xml
|-- app/
|   |-- public/
|   |-- src/
|   |   |-- pages/
|   |   `-- services/
|   |-- package.json
|   |-- package-lock.json
|   `-- vite.config.js
|-- docs/
|   |-- adr/
|   |   |-- ADR-001.md
|   |   |-- ADR-002.md
|   |   `-- ADR-003.md
|   |-- evidence/
|   |   `-- concurrency-test.md
|   |-- api-contract.md
|   |-- architecture.md
|   |-- constitution.md
|   |-- data-model.md
|   |-- evidence.md
|   |-- plan.md
|   |-- spec.md
|   `-- tasks.md
|-- infra/
|   |-- docker-compose.yml
|   |-- Dockerfile.api
|   |-- Dockerfile.app
|   `-- .env.example
|-- page/
|   |-- index.html
|   |-- script.js
|   `-- styles.css
`-- tool/
    |-- src/
    |-- categories.json
    |-- instruments.json
    |-- .env.example
    |-- package.json
    `-- README.md
```

## Funcionalidades implementadas

El sistema permite:

- Consultar y administrar categorías de instrumentos.
- Registrar, consultar, actualizar y desactivar instrumentos.
- Controlar las unidades disponibles del inventario.
- Registrar y consultar estudiantes.
- Registrar préstamos de instrumentos.
- Consultar préstamos activos, vencidos e históricos.
- Registrar devoluciones.
- Consultar los instrumentos más solicitados.
- Administrar las operaciones desde una interfaz React.
- Presentar información general mediante un sitio público independiente.
- Inicializar categorías e instrumentos mediante una herramienta que consume la API.

## Reglas de negocio

Las reglas del sistema están documentadas en `docs/spec.md`.

### Préstamos

- Un estudiante no puede mantener más de un préstamo pendiente de devolución.
- El plazo de devolución es de **21 días**.
- No se permiten préstamos de instrumentos inactivos.
- No se permiten préstamos cuando no existen unidades disponibles.
- Los préstamos vencidos se identifican mediante la fecha límite y la ausencia de una devolución.
- Las fechas de las operaciones se gestionan en UTC.

### Inventario

- Las unidades disponibles no pueden ser negativas.
- Las unidades disponibles no pueden superar el total registrado.
- El inventario se actualiza cuando se registra un préstamo o una devolución.
- Las operaciones críticas utilizan transacciones de base de datos.

### Concurrencia

El backend utiliza transacciones y bloqueos mediante `lockForUpdate()` para proteger las operaciones de inventario.

En la prueba manual de concurrencia documentada:

- Primera solicitud: HTTP `201 Created`.
- Segunda solicitud: HTTP `409 Conflict`.
- Disponibilidad final: `0` unidades.

La evidencia se encuentra en `docs/evidence/concurrency-test.md` y `docs/tasks.md`.

### Historial

Los préstamos y las devoluciones se conservan en registros separados para mantener el historial de las operaciones.

### Categorías

La implementación también incorpora activación y desactivación de categorías.

El backend impide utilizar categorías inactivas para registrar nuevos instrumentos o préstamos y rechaza su desactivación cuando existen préstamos pendientes asociados.

Este comportamiento adicional se distingue de los requisitos originales documentados en `docs/spec.md`.

## Requisitos de ejecución

Para ejecutar el proyecto mediante Docker se necesita:

- Docker Desktop o Docker Engine.
- Docker Compose.
- Puertos locales disponibles: `8000`, `5173`, `3308` y `8080`.

Para ejecutar componentes manualmente se necesita:

- PHP compatible con `^8.3`.
- Composer.
- Node.js y npm.
- Una instancia de MySQL compatible.

## Configuración y ejecución con Docker Compose

Los comandos siguientes están preparados para PowerShell y deben ejecutarse desde la raíz del proyecto.

### 1. Configurar variables de entorno

Crear el archivo local de infraestructura:

```powershell
Copy-Item infra/.env.example infra/.env
```

Editar `infra/.env` y establecer contraseñas privadas para las variables de base de datos, incluyendo:

- `DB_PASSWORD`
- `DB_ROOT_PASSWORD`

Los archivos `.env` contienen configuración privada y no deben publicarse en GitHub.

### 2. Iniciar los servicios

```powershell
docker compose --env-file infra/.env -f infra/docker-compose.yml up -d
```

Docker Compose integra cuatro servicios principales:

| Servicio | Dirección local |
|---|---|
| API Laravel | `http://localhost:8000/api` |
| Frontend React | `http://localhost:5173` |
| Sitio público | `http://localhost:8080` |
| MySQL | `127.0.0.1:3308` |

La base de datos principal se denomina `music_school`.

### 3. Comprobar los contenedores

```powershell
docker compose --env-file infra/.env -f infra/docker-compose.yml ps
```

Los servicios esperados son:

- `music-school-api`
- `music-school-app`
- `music-school-db`
- `music-school-page`

### 4. Ejecutar migraciones

Con los servicios iniciados y la configuración de Laravel preparada:

```powershell
docker compose --env-file infra/.env -f infra/docker-compose.yml exec -T api php artisan migrate --force
```

Para comprobar el estado de las migraciones:

```powershell
docker compose --env-file infra/.env -f infra/docker-compose.yml exec -T api php artisan migrate:status
```

### 5. Comprobar la API

La API se encuentra disponible en:

`http://localhost:8000/api`

El endpoint de salud de Laravel se encuentra en:

`http://localhost:8000/up`

Para comprobarlo desde PowerShell:

```powershell
curl.exe -I http://localhost:8000/up
```

### 6. Detener los servicios

```powershell
docker compose --env-file infra/.env -f infra/docker-compose.yml down
```

Este comando detiene los servicios sin solicitar la eliminación de los volúmenes persistentes.

## Ejecución manual de Laravel

Esta opción es alternativa a la ejecución del backend mediante Docker.

### 1. Preparar Laravel

```powershell
Copy-Item api/.env.example api/.env

Set-Location api

composer install

php artisan key:generate
```

Configurar en `api/.env` los datos de conexión a MySQL.

Si se utiliza MySQL publicado por Docker desde Windows:

- Host: `127.0.0.1`
- Puerto: `3308`
- Base de datos: `music_school`
- Usuario: el configurado en Docker Compose.
- Contraseña: la definida localmente.

### 2. Ejecutar migraciones

```powershell
php artisan migrate
```

### 3. Iniciar Laravel

```powershell
php artisan serve --host=0.0.0.0 --port=8000
```

API:

`http://localhost:8000/api`

## Ejecución manual de React

Esta opción es alternativa a ejecutar React mediante Docker.

Desde la raíz del proyecto:

```powershell
Set-Location app

npm install

npm run dev
```

El frontend utiliza la API disponible en:

`http://localhost:8000/api`

Para generar la compilación de producción:

```powershell
npm run build
```

Para ejecutar el linter:

```powershell
npm run lint
```

## Herramienta de inicialización de datos

La herramienta ubicada en `tool/` registra información inicial mediante solicitudes HTTP a la API.

No ejecuta consultas SQL directas contra MySQL.

### Datos iniciales

Las categorías definidas son:

| Código | Categoría |
|---|---|
| CAT-01 | Cuerdas |
| CAT-02 | Vientos |
| CAT-03 | Percusión |
| CAT-04 | Teclados |
| CAT-05 | Electrónicos |

También se dispone de **10 instrumentos iniciales** definidos en `tool/instruments.json`.

### Ejecución

Con la API iniciada, desde la raíz del repositorio:

```powershell
Set-Location tool

Copy-Item .env.example .env

npm install

npm run seed
```

Verificar que `API_BASE_URL` en `tool/.env` corresponda a la dirección de la API.

La herramienta evita duplicar los registros existentes.

En una ejecución repetida verificada se obtuvo:

```text
CATEGORIAS:
Creadas: 0
Existentes: 5
Errores: 0

INSTRUMENTOS:
Creados: 0
Existentes: 10
Errores: 0
```

La evidencia de ejecución está registrada en `docs/evidence.md`.

## Pruebas automatizadas

El backend cuenta con **16 archivos de pruebas automatizadas**.

La última ejecución verificada obtuvo:

| Indicador | Resultado |
|---|---:|
| Pruebas aprobadas | 56 |
| Aserciones | 138 |
| Errores | 0 |
| Archivos de pruebas | 16 |

### Ejecutar pruebas mediante Docker

Desde la raíz del proyecto:

```powershell
docker compose --env-file infra/.env -f infra/docker-compose.yml --profile testing run --rm api-test php artisan test
```

El servicio `api-test` utiliza la base de datos:

`music_school_test`

La API principal utiliza:

`music_school`

**Importante:** las pruebas utilizan operaciones que pueden reinicializar tablas mediante `RefreshDatabase`. No deben ejecutarse contra la base de datos principal ni contra información que se necesite conservar.

### Verificar la compilación de React

```powershell
docker compose --env-file infra/.env -f infra/docker-compose.yml exec -T app npm run build
```

La compilación de producción fue verificada correctamente.

### Prueba de concurrencia

La evidencia manual de concurrencia se encuentra en:

`docs/evidence/concurrency-test.md`

Esta prueba verifica que dos solicitudes simultáneas no puedan prestar la misma última unidad disponible.

La prueba manual no se presenta como una prueba automatizada.

## Documentación técnica

| Archivo | Contenido |
|---|---|
| `docs/constitution.md` | Principios y restricciones del proyecto. |
| `docs/spec.md` | Historias de usuario, requisitos y reglas de negocio. |
| `docs/plan.md` | Plan de implementación. |
| `docs/tasks.md` | Seguimiento de las 23 tareas. |
| `docs/architecture.md` | Arquitectura del sistema. |
| `docs/data-model.md` | Modelo de datos y relaciones. |
| `docs/api-contract.md` | Contrato de la API. |
| `docs/evidence.md` | Evidencias técnicas y resultados de pruebas. |
| `docs/evidence/concurrency-test.md` | Evidencia de concurrencia. |
| `docs/adr/ADR-001.md` | Decisión arquitectónica 001. |
| `docs/adr/ADR-002.md` | Decisión arquitectónica 002. |
| `docs/adr/ADR-003.md` | Decisión arquitectónica 003. |

También existen documentos específicos en:

- `api/README.md`
- `app/README.md`
- `tool/README.md`

## Estado del proyecto

El plan de trabajo contiene exactamente 23 tareas.

| Indicador | Resultado |
|---|---:|
| Tareas planificadas | 23 |
| Tareas completadas | 23 |
| Tareas pendientes | 0 |
| Avance del plan de tareas | 100 % |

La implementación, las pruebas y las evidencias se encuentran registradas en el repositorio.

El estado de las tareas no sustituye la evaluación formal ni la calificación del plan de mejoramiento.

## Seguridad

- Los archivos `.env` deben mantenerse fuera del control de versiones.
- Las contraseñas de MySQL deben configurarse mediante variables de entorno.
- No se deben publicar claves privadas ni credenciales.
- Los archivos `.env.example` sirven como plantillas de configuración.
- La base de pruebas `music_school_test` debe permanecer separada de la base principal `music_school`.
- No se deben ejecutar pruebas destructivas sobre información que deba conservarse.
- Los puertos de desarrollo deben utilizarse únicamente en entornos controlados.

## Evidencias de validación

Durante la revisión técnica del proyecto se verificaron:

- Ejecución integrada mediante Docker Compose.
- Disponibilidad de los cuatro servicios principales.
- Respuesta HTTP 200 del sitio público.
- Funcionamiento de la API.
- Ejecución de la herramienta de inicialización de datos.
- Pruebas automatizadas aprobadas.
- Compilación de producción de React.
- Control de concurrencia con respuestas HTTP 201 y 409.
- Separación entre la base de datos principal y la base de pruebas.

Los resultados detallados se encuentran en `docs/evidence.md`.

