import api from './api';

export const eventosService = {
  listar: () => api.get('/eventos'),
  async getAll(params = {}) {
    const response = await api.get('/eventos', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/eventos/${id}`);
    return response.data;
  },

  async create(eventoData) {
    const response = await api.post('/eventos', eventoData);
    return response.data;
  },

  async update(id, eventoData) {
    const response = await api.put(`/eventos/${id}`, eventoData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/eventos/${id}`);
    return response.data;
  },

  async getAforo(id) {
    const response = await api.get(`/eventos/${id}/aforo`);
    return response.data;
  }
};