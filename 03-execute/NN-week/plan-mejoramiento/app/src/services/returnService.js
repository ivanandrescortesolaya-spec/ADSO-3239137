
import api from "./api";

// Registrar la devolucion de un prestamo
export const createReturn = async (loanId) => {
  const response = await api.post(`/loans/${loanId}/returns`);
  return response.data;
};
