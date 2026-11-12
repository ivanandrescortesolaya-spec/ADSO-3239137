
import api from "./api";

// Fetch all loans
export const getLoans = async () => {
  const response = await api.get("/loans");
  return response.data;
};

// Create a loan
export const createLoan = async (loan) => {
  const response = await api.post("/loans", loan);
  return response.data;
};

// Fetch overdue loans
export const getOverdueLoans = async () => {
  const response = await api.get("/loans/overdue");
  return response.data;
};

// Fetch a loan by ID
export const getLoan = async (id) => {
  const response = await api.get(`/loans/${id}`);
  return response.data;
};

