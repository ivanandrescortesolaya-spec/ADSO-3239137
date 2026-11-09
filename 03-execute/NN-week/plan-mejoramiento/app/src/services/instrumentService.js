
import api from "./api";

export const getInstruments = async () => {
  const response = await api.get("/instruments");
  return response.data;
};

export const createInstrument = async (instrument) => {
  const response = await api.post("/instruments", instrument);
  return response.data;
};

export const updateInstrument = async (id, instrument) => {
  const response = await api.put(`/instruments/${id}`, instrument);
  return response.data;
};

export const deactivateInstrument = async (id) => {
  const response = await api.patch(`/instruments/${id}/deactivate`);
  return response.data;
};
