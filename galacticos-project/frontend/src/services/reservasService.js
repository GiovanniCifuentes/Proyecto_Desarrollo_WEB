import api from './api';

export const reservasService = {
  async getAll(params = {}) {
    const response = await api.get('/reservas', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/reservas/${id}`);
    return response.data;
  },

  async create(reservaData) {
    const response = await api.post('/reservas', reservaData);
    return response.data;
  },

  async cancel(id) {
    const response = await api.patch(`/reservas/${id}/cancelar`);
    return response.data;
  }
};