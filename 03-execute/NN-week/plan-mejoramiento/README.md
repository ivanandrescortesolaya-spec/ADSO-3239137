Este proyecto es la solución del plan de mejoramiento del aprendiz A12, ficha 3239137, dominio music-school

# Music School

Sistema para administrar instrumentos, estudiantes, prestamos y devoluciones. Este README describe archivos y comportamientos que existen en el repositorio; no declara que todos los requisitos del plan esten terminados.

## Tecnologias verificadas

| Componente | Version o requisito comprobable |
|---|---|
| PHP | `^8.3`, declarado en `api/composer.json` |
| Laravel | `^13.17`, declarado en `api/composer.json` |
| React | `^19.3.1`, declarado en `app/package.json` |
| Vite | `^8.3.6`, declarado en `app/package.json` |
| MySQL | Imagen `mysql:8.4` en `infra/docker-compose.yml` |
| Node.js para la herramienta de datos | `>=20`, declarado en `tool/package.json` |
| Comunicacion | API HTTP con JSON |

Composer y npm instalan las dependencias declaradas en sus manifiestos. `api/` y `app/` tambien incluyen archivos de bloqueo. El archivo Compose solo inicia MySQL; Laravel y React se ejecutan por separado.

## Estructura del repositorio

```text
.
|-- README.md
|-- api/
|   |-- app/Http/Controllers/Api/
|   |-- app/Models/
|   |-- app/Services/
|   |-- bootstrap/  config/  public/  resources/  routes/
|   |-- database/factories/  migrations/  seeders/
|   |-- tests/
|   |   |-- Feature/    (14 archivos *Test.php)
|   |   `-- Unit/       (1 archivo *Test.php)
|   |-- .env.example
|   |-- artisan
|   |-- composer.json  composer.lock
|   `-- phpunit.xml
|-- app/
|   |-- public/
|   |-- src/pages/
|   |-- src/services/
|   |-- package.json  package-lock.json
|   `-- vite.config.js
|-- docs/
|   |-- adr/           (ADR-001.md a ADR-003.md)
|   |-- evidence/       (concurrency-test.md)
|   |-- api-contract.md  architecture.md  constitution.md
|   |-- data-model.md  evidence.md  plan.md  spec.md  tasks.md
|-- infra/
|   |-- docker-compose.yml
|   `-- .env.example
|-- page/
|   |-- index.html  script.js  styles.css
`-- tool/
    |-- src/  categories.json  instruments.json
    |-- .env.example  package.json  README.md
```

El frontend contiene paginas para dashboard, categorias, estudiantes, prestamos y devoluciones. En `api/database/migrations/` se encuentran las migraciones de usuarios, cache, trabajos, categorias, instrumentos, estudiantes, prestamos, devoluciones, roles y estado de categoria.

## Reglas de negocio de la especificacion

`docs/spec.md` presenta seis reglas agrupadas. La implementacion actual aplica, entre otras, estas validaciones en Laravel:

- Un estudiante no puede mantener mas de un prestamo pendiente.
- El vencimiento se calcula a 21 dias y se consultan prestamos vencidos sin devolucion.
- El prestamo y la devolucion actualizan el inventario dentro de transacciones; el servicio de prestamos bloquea el estudiante y el instrumento.
- Los prestamos y devoluciones se conservan en tablas separadas; un prestamo esta pendiente cuando no tiene un registro relacionado en `returns`.
- La disponibilidad se verifica antes de registrar el prestamo; el conflicto por falta de unidades responde HTTP 409.
- Las fechas de las operaciones se registran en UTC.

Los instrumentos cuentan con `is_active` y un endpoint de desactivacion. La API tambien incluye un reporte agrupado por prestamos registrados. Estas referencias describen implementaciones presentes, no certifican por si solas todos los criterios de aceptacion de `docs/spec.md`.

### Comportamiento adicional de categorias

El codigo tambien incorpora estado activo para categorias. La interfaz administrativa permite activarlas y desactivarlas; el backend impide crear o actualizar instrumentos usando una categoria inactiva y rechaza nuevos prestamos de instrumentos asociados a categorias inactivas. La desactivacion se rechaza si hay prestamos sin devolucion. Estas reglas son comportamiento adicional de la implementacion y no se presentan como requisitos textuales del documento original `docs/spec.md`.

## Requisitos locales

- PHP que cumpla `^8.3` y Composer para Laravel.
- Node.js y npm para React. `tool/package.json` requiere Node.js `>=20`.
- Docker con el complemento `docker compose`, o una instancia MySQL compatible. La configuracion del contenedor usa la imagen MySQL 8.4.
- Para ejecutar las pruebas: una base MySQL accesible y una base `music_school_test`, segun `api/phpunit.xml`.

## Configurar y ejecutar

Los siguientes pasos usan PowerShell desde la raiz del repositorio. Los archivos `.env` locales estan ignorados por Git. No publiques sus valores.

### 1. Iniciar MySQL con Docker

Crear la configuracion local a partir de la plantilla y asignar valores privados a las variables solicitadas:

```powershell
Copy-Item infra/.env.example infra/.env
```

Edita `infra/.env` y establece valores locales para `DB_PASSWORD` y `DB_ROOT_PASSWORD`. Luego inicia el servicio:

```powershell
docker compose --env-file infra/.env -f infra/docker-compose.yml up -d
```

Compose crea el contenedor `music-school-db`, publica MySQL en el puerto `3306` y crea la base `music_school`. No crea contenedores para Laravel ni React.

### 2. Instalar y ejecutar Laravel

En otra terminal, copia la plantilla de Laravel:

```powershell
Copy-Item api/.env.example api/.env
Set-Location api
composer install
php artisan key:generate
```

En `api/.env`, configura la conexion MySQL local. Usa la base `music_school`, el usuario configurado en `infra/docker-compose.yml`, `127.0.0.1` y el mismo valor local de `DB_PASSWORD` definido para Compose. Ejecuta las migraciones y los seeders disponibles:

```powershell
php artisan migrate --seed
```

Inicia la API:

```powershell
php artisan serve --host=0.0.0.0 --port=8000
```

La API queda disponible en `http://localhost:8000/api`. El endpoint de salud de Laravel esta en `/up`.

### 3. Instalar y ejecutar React

En una terminal separada:

```powershell
Set-Location app
npm install
npm run dev
```

Vite muestra en la terminal la direccion local de la interfaz. El cliente API actual usa `http://localhost:8000/api`; no existe un `app/.env.example` ni una variable de entorno configurada para cambiar esa direccion.

Para compilar la aplicacion:

```powershell
npm run build
```

Para ejecutar el linter definido en `app/package.json`:

```powershell
npm run lint
```

### 4. Ejecutar la herramienta opcional de datos

La herramienta `tool/` envia solicitudes HTTP a la API; no conecta directamente con MySQL. Copia su plantilla, confirma que `API_BASE_URL` apunte a la API iniciada y ejecuta desde esa carpeta:

```powershell
Set-Location tool
Copy-Item .env.example .env
npm run seed
```

## Pruebas automatizadas

Hay **15 archivos de pruebas `*Test.php`**: 14 en `api/tests/Feature/` y 1 en `api/tests/Unit/`. La cantidad de archivos no es la cantidad de casos de prueba. En una ejecucion verificada de `php artisan test` se reportaron 54 casos y 135 aserciones.

`api/phpunit.xml` configura las pruebas para MySQL en `127.0.0.1:3306`, base `music_school_test` y usuario `music_school_user`. El Compose de desarrollo crea `music_school`, no la base de pruebas. Crea `music_school_test` y concede acceso al usuario de pruebas antes de ejecutar la suite. Por ejemplo, con el cliente MySQL dentro del contenedor:

```powershell
docker exec -it music-school-db mysql -u root -p
```

Ingresa la contrasena local de root cuando el cliente la solicite y ejecuta en el prompt SQL:

```sql
CREATE DATABASE music_school_test;
GRANT ALL PRIVILEGES ON music_school_test.* TO 'music_school_user'@'%';
```

Configura `DB_PASSWORD` en el entorno local de pruebas para que coincida con la clave asignada a `music_school_user`. Desde `api/`, ejecuta cualquiera de los comandos definidos para las pruebas:

```powershell
php artisan test
```

O usa el script de Composer, que limpia la configuracion antes de lanzar Artisan:

```powershell
composer test
```

Las pruebas usan `RefreshDatabase`; ejecutalas contra la base dedicada `music_school_test`, nunca contra datos que quieras conservar.

## Documentacion y evidencias disponibles

| Ruta | Contenido |
|---|---|
| `docs/spec.md` | Historias de usuario, requisitos y reglas de negocio. |
| `docs/constitution.md` | Principios y restricciones del proyecto. |
| `docs/plan.md` y `docs/tasks.md` | Plan de trabajo y seguimiento de tareas. |
| `docs/architecture.md` | Arquitectura descrita para el sistema. |
| `docs/data-model.md` | Entidades, relaciones y reglas de persistencia. |
| `docs/api-contract.md` | Contrato documentado de la API. |
| `docs/adr/ADR-001.md` a `ADR-003.md` | Decisiones arquitectonicas. |
| `docs/evidence.md` | Registro de evidencias del proyecto. |
| `docs/evidence/concurrency-test.md` | Evidencia escrita de una prueba manual de concurrencia. |
| `api/README.md`, `app/README.md`, `tool/README.md` | README presentes en cada componente. |

La evidencia de concurrencia es un documento del repositorio; no debe interpretarse como una ejecucion automatizada de concurrencia.

## Seguridad de configuracion

- Usa `api/.env.example`, `infra/.env.example` y `tool/.env.example` como plantillas para los archivos locales `.env`.
- No copies contrasenas ni claves reales al README, al codigo o a archivos versionados.
- No hay plantilla `app/.env.example`; la URL de la API esta actualmente escrita en `app/src/services/api.js`.
- Los archivos `.env` estan incluidos en las reglas de `.gitignore`.
