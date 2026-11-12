
# Music School - Seed Tool

## Descripcion

Herramienta desarrollada en Node.js para inicializar los datos de Music School mediante solicitudes HTTP a la API REST de Laravel.

Permite registrar categorias e instrumentos sin insertar datos directamente en la base de datos.

## Tecnologias

- Node.js 20 o superior.
- JavaScript ES Modules.
- Fetch API.
- API REST de Laravel.

## Estructura

```text
tool/
├── src/
│   ├── api.js
│   ├── config.js
│   └── seed.js
├── .env
├── .env.example
├── .gitignore
├── categories.json
├── instruments.json
├── package.json
└── README.md
```

## Requisitos

- Node.js 20 o superior.
- API de Music School funcionando.
- Base de datos configurada y disponible.
- Archivo `.env` correctamente configurado.

## Configuracion

Crear el archivo `.env` en la carpeta `tool/`:

```env
API_BASE_URL=http://localhost:8000/api
```

## Ejecucion

Desde la terminal:

```bash
cd tool
npm run seed
```

## Funcionamiento

El proceso realiza las siguientes operaciones:

1. Lee las categorias definidas en `categories.json`.
2. Consulta las categorias existentes en la API.
3. Registra solamente las categorias que no existen.
4. Lee los instrumentos definidos en `instruments.json`.
5. Consulta las categorias para obtener sus identificadores.
6. Consulta los instrumentos existentes.
7. Registra solamente los instrumentos que no existen.
8. Muestra un resumen de registros creados, existentes y errores.

## Idempotencia

La herramienta verifica los codigos de las categorias e instrumentos antes de realizar una solicitud de creacion.

Esto permite ejecutar el proceso varias veces sin generar registros duplicados.

## Comunicacion con la API

La herramienta utiliza solicitudes HTTP:

- GET `/categories`
- POST `/categories`
- GET `/instruments`
- POST `/instruments`

No ejecuta instrucciones SQL ni modifica directamente la base de datos.

## Resultado esperado

Al finalizar, muestra:

- Cantidad de categorias creadas.
- Cantidad de categorias existentes.
- Cantidad de instrumentos creados.
- Cantidad de instrumentos existentes.
- Cantidad de errores.

## Seguridad

El archivo `.env` contiene la configuracion local y no debe publicarse en el repositorio.

El archivo `.env.example` sirve como referencia para configurar la herramienta.
