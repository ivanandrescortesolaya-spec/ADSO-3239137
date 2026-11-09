
import api from "./api";

// Registrar la devolución de un préstamo
export const createReturn = async (loanId) => {
  const response = await api.post(`/loans/${loanId}/returns`);
  return response.data;
};
