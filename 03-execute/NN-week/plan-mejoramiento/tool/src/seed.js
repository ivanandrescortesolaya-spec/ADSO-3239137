
import { readFile } from 'node:fs/promises';
import { apiRequest } from './api.js';

async function loadJsonFile(fileName) {
  const fileUrl = new URL(`../${fileName}`, import.meta.url);
  const content = await readFile(fileUrl, 'utf8');
  return JSON.parse(content);
}

function extractRecords(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  throw new Error('La API no devolvio una lista valida.');
}

async function seedCategories() {
  console.log('\n=== INICIALIZANDO CATEGORIAS ===\n');

  const categories = await loadJsonFile('categories.json');
  const response = await apiRequest('/categories');
  const existingCategories = extractRecords(response);

  const existingCodes = new Set(
    existingCategories.map(category => category.code)
  );

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const category of categories) {
    if (existingCodes.has(category.code)) {
      console.log(`[EXISTE] ${category.code} - ${category.name}`);
      skipped++;
      continue;
    }

    try {
      await apiRequest('/categories', {
        method: 'POST',
        body: JSON.stringify(category)
      });

      console.log(`[CREADA] ${category.code} - ${category.name}`);
      created++;
      existingCodes.add(category.code);
    } catch (error) {
      console.error(`[ERROR] ${category.code}: ${error.message}`);
      errors++;
    }
  }

  return { created, skipped, errors };
}

async function seedInstruments() {
  console.log('\n=== INICIALIZANDO INSTRUMENTOS ===\n');

  const instruments = await loadJsonFile('instruments.json');

  // Fetch categories and preserve their activation status.
  const categoriesResponse = await apiRequest('/categories');
  const categories = extractRecords(categoriesResponse);

  const categoriesByCode = new Map(
    categories.map(category => [category.code, category])
  );

  // Fetch existing instruments.
  const instrumentsResponse = await apiRequest('/instruments');
  const existingInstruments = extractRecords(instrumentsResponse);

  const existingCodes = new Set(
    existingInstruments.map(instrument => instrument.code)
  );

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const instrument of instruments) {
    if (existingCodes.has(instrument.code)) {
      console.log(`[EXISTE] ${instrument.code} - ${instrument.name}`);
      skipped++;
      continue;
    }

    const category = categoriesByCode.get(instrument.category_code);

    if (!category) {
      console.error(
        `[ERROR] ${instrument.code}: no existe la categoria ${instrument.category_code}`
      );
      errors++;
      continue;
    }

    // Do not create instruments in inactive categories.
    if (category.is_active === false || category.is_active === 0) {
      console.log(
        `[OMITIDO] ${instrument.code} - ${instrument.name}: la categoria ${category.name} esta inactiva`
      );
      skipped++;
      continue;
    }

    const payload = {
      category_id: category.id,
      code: instrument.code,
      name: instrument.name,
      total_units: instrument.total_units
    };

    try {
      await apiRequest('/instruments', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      console.log(`[CREADO] ${instrument.code} - ${instrument.name}`);
      created++;
      existingCodes.add(instrument.code);
    } catch (error) {
      console.error(`[ERROR] ${instrument.code}: ${error.message}`);
      errors++;
    }
  }

  return { created, skipped, errors };
}

async function main() {
  console.log('\n====================================');
  console.log('   MUSIC SCHOOL - SEED TOOL');
  console.log('====================================');

  const categoryResults = await seedCategories();
  const instrumentResults = await seedInstruments();

  const totalErrors = categoryResults.errors + instrumentResults.errors;

  console.log('\n========== RESUMEN FINAL ==========');
  console.log('CATEGORIAS');
  console.log(`Creadas: ${categoryResults.created}`);
  console.log(`Existentes: ${categoryResults.skipped}`);
  console.log(`Errores: ${categoryResults.errors}`);

  console.log('\nINSTRUMENTOS');
  console.log(`Creados: ${instrumentResults.created}`);
  console.log(`Existentes: ${instrumentResults.skipped}`);
  console.log(`Omitidos: ${instrumentResults.skipped}`);
  console.log(`Errores: ${instrumentResults.errors}`);

  if (totalErrors > 0) {
    console.log('\nInicializacion finalizada con errores.');
    process.exitCode = 1;
  } else {
    console.log('\nInicializacion finalizada correctamente.');
  }
}

main().catch(error => {
  console.error('\nERROR GENERAL:', error.message);
  process.exitCode = 1;
});
