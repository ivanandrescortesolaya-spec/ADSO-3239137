import api from "./api";

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const createCategory = async (category) => {
  const response = await api.post("/categories", category);
  return response.data;
};

export const updateCategoryStatus = async (id, active) => {
  const action = active ? "activate" : "deactivate";
  const response = await api.patch(`/categories/${id}/${action}`);
  return response.data;
};
