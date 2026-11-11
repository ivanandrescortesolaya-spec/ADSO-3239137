# Infraestructura - Music School

## Descripción

Esta carpeta contiene la configuración necesaria para ejecutar la base de datos MySQL del proyecto Music School mediante Docker Compose.

## Requisitos

- Docker Desktop instalado y en ejecución.
- Docker Compose disponible.
- Archivo de configuración `.env`.

## Configuración inicial

1. Copiar el archivo de ejemplo:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Abrir el archivo `.env` y configurar las contraseñas:

   ```env
   DB_PASSWORD=change_this_password
   DB_ROOT_PASSWORD=change_this_root_password
   ```

   Reemplazar los valores de ejemplo por contraseñas propias.

## Iniciar la base de datos

Desde esta carpeta, ejecutar:

```powershell
docker compose up -d
```

## Verificar el servicio

Consultar el estado de los contenedores:

```powershell
docker compose ps
```

Consultar los registros de MySQL:

```powershell
docker compose logs mysql
```

## Detener el servicio

Para detener los contenedores:

```powershell
docker compose down
```

Este comando conserva los datos almacenados en el volumen de Docker.

## Persistencia de datos

La base de datos utiliza el volumen `music_school_data`.

Esto permite conservar la información aunque se detenga o se elimine el contenedor.

**Importante:** no compartir el archivo `.env` ni publicar contraseñas reales. El archivo `.env.example` sirve como plantilla de configuración.