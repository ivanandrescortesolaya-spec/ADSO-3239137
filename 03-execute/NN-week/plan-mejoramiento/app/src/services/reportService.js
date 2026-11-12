
import api from "./api";

// Fetch the most requested instruments report
export const getMostRequestedInstruments = async () => {
  const response = await api.get("/reports/most-requested-instruments");
  return response.data;
};
