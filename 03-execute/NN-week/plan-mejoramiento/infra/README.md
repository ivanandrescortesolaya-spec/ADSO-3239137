# Music School Infrastructure

## Description

This directory contains the configuration required to run the Music School MySQL database with Docker Compose.

## Requirements

- Docker Desktop installed and running.
- Docker Compose available.
- Configuration file `.env`.

## Initial Configuration

1. Copy the example file:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Open `.env` and configure the passwords:

   ```env
   DB_PASSWORD=change_this_password
   DB_ROOT_PASSWORD=change_this_root_password
   ```

   Replace the example values with your own passwords.

## Start the Database

From this directory, run:

```powershell
docker compose up -d
```

## Verify the Service

Check the container status:

```powershell
docker compose ps
```

Check the MySQL logs:

```powershell
docker compose logs mysql
```

## Stop the Service

To stop the containers:

```powershell
docker compose down
```

This command preserves the data stored in the Docker volume.

## Data Persistence

The database uses the `music_school_data` volume.

This preserves the information when the container is stopped or removed.

**Important:** Do not share the `.env` file or publish real passwords. The `.env.example` file is a configuration template.
