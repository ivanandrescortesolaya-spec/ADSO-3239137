
import api from "./api";

// Consultar todos los estudiantes
export const getStudents = async () => {
  const response = await api.get("/students");
  return response.data;
};

// Registrar un estudiante
export const createStudent = async (student) => {
  const response = await api.post("/students", student);
  return response.data;
};

// Actualizar los datos de un estudiante
export const updateStudent = async (id, student) => {
  const response = await api.put(`/students/${id}`, student);
  return response.data;
};

// Consultar un estudiante por su ID
export const getStudent = async (id) => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};
