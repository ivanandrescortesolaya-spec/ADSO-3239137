
const apiBaseUrl = process.env.API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error(
    'No se encontró API_BASE_URL. Verifica el archivo .env de la herramienta.'
  );
}

export const config = {
  apiBaseUrl: apiBaseUrl.replace(/\/+$/, ''),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
};
