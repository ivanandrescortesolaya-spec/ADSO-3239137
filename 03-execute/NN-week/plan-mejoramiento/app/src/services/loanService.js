
import api from "./api";

// Consultar todos los préstamos
export const getLoans = async () => {
  const response = await api.get("/loans");
  return response.data;
};

// Registrar un préstamo
export const createLoan = async (loan) => {
  const response = await api.post("/loans", loan);
  return response.data;
};

// Consultar préstamos vencidos
export const getOverdueLoans = async () => {
  const response = await api.get("/loans/overdue");
  return response.data;
};

// Consultar un préstamo por su ID
export const getLoan = async (id) => {
  const response = await api.get(`/loans/${id}`);
  return response.data;
};

