# Music School Seed Tool

## Description

Node.js tool for initializing Music School data through requests to the Laravel REST API.

It registers categories and instruments without inserting data directly into the database.

## Technologies

- Node.js 20 or later.
- JavaScript ES modules.
- Fetch API.
- Laravel REST API.

## Structure

```text
tool/
|-- src/
|   |-- api.js
|   |-- config.js
|   `-- seed.js
|-- .env
|-- .env.example
|-- .gitignore
|-- categories.json
|-- instruments.json
|-- package.json
`-- README.md
```

## Requirements

- Node.js 20 or later.
- The Music School API is running.
- The database is configured and available.
- The `.env` file is configured correctly.

## Configuration

Create the `.env` file in the `tool/` directory:

```env
API_BASE_URL=http://localhost:8000/api
```

## Running the Tool

From a terminal:

```bash
cd tool
npm run seed
```

## Operation

The tool performs the following steps:

1. Reads the categories defined in `categories.json`.
2. Retrieves the categories already available through the API.
3. Registers only categories that do not already exist.
4. Reads the instruments defined in `instruments.json`.
5. Retrieves category identifiers from the API.
6. Retrieves the instruments already available through the API.
7. Registers only instruments that do not already exist.
8. Displays a summary of created, existing, and failed records.

## Idempotency

Before making a create request, the tool checks the category and instrument codes. This allows it to run repeatedly without creating duplicate records.

## API Communication

The tool uses the following HTTP requests:

- GET `/categories`
- POST `/categories`
- GET `/instruments`
- POST `/instruments`

It does not execute SQL statements or connect directly to the database.

## Expected Output

The final summary reports:

- The number of categories created.
- The number of existing categories.
- The number of instruments created.
- The number of existing instruments.
- The number of errors.

The tool's terminal messages remain in Spanish for its operator.

## Security

The `.env` file contains local configuration and must not be published to the repository.

The `.env.example` file provides a reference for configuring the tool.
