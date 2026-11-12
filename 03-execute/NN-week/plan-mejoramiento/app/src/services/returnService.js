
import api from "./api";

// Record a loan return
export const createReturn = async (loanId) => {
  const response = await api.post(`/loans/${loanId}/returns`);
  return response.data;
};
