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
    // Si es FormData, axios automáticamente establece el Content-Type correcto
    const config = eventoData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await api.post('/eventos', eventoData, config);
    return response.data;
  },

  async update(id, eventoData) {
    // Si es FormData, axios automáticamente establece el Content-Type correcto
    const config = eventoData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await api.put(`/eventos/${id}`, eventoData, config);
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