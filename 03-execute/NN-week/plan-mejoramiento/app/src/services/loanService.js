
import api from "./api";

// Consultar todos los prestamos
export const getLoans = async () => {
  const response = await api.get("/loans");
  return response.data;
};

// Registrar un prestamo
export const createLoan = async (loan) => {
  const response = await api.post("/loans", loan);
  return response.data;
};

// Consultar prestamos vencidos
export const getOverdueLoans = async () => {
  const response = await api.get("/loans/overdue");
  return response.data;
};

// Consultar un prestamo por su ID
export const getLoan = async (id) => {
  const response = await api.get(`/loans/${id}`);
  return response.data;
};

