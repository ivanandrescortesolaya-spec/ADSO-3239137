
import api from "./api";

// Consultar el reporte de instrumentos más solicitados
export const getMostRequestedInstruments = async () => {
  const response = await api.get("/reports/most-requested-instruments");
  return response.data;
};
