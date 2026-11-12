import { config } from './config.js';

export async function apiRequest(endpoint, options = {}) {
  const url = `${config.apiBaseUrl}${endpoint}`;

  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...config.headers,
        ...options.headers
      }
    });
  } catch (error) {
    throw new Error(
      `No fue posible conectar con la API: ${error.message}`
    );
  }

  const responseText = await response.text();
  let data = {};

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      const error = new Error(
        `La API respondio con un formato no valido. HTTP ${response.status}`
      );

      error.status = response.status;
      throw error;
    }
  }

  if (!response.ok) {
    const validationMessages = data.errors
      ? Object.values(data.errors).flat().join(' ')
      : '';

    const error = new Error(
      data.mensaje ||
      data.message ||
      validationMessages ||
      `Error HTTP ${response.status}`
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}