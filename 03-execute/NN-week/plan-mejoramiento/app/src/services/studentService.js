
import api from "./api";

// Fetch all students
export const getStudents = async () => {
  const response = await api.get("/students");
  return response.data;
};

// Create a student
export const createStudent = async (student) => {
  const response = await api.post("/students", student);
  return response.data;
};

// Update a student's data
export const updateStudent = async (id, student) => {
  const response = await api.put(`/students/${id}`, student);
  return response.data;
};

// Fetch a student by ID
export const getStudent = async (id) => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};
