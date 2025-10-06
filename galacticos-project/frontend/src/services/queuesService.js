import api from './api';

export const queuesService = {
  async getStats() {
    const response = await api.get('/queues/estadisticas');
    return response.data;
  },

  async getPdfJobs(tipo = 'waiting', page = 1, limit = 10) {
    const response = await api.get('/queues/pdf/trabajos', {
      params: { tipo, page, limit }
    });
    return response.data;
  },

  async getEmailJobs(tipo = 'waiting', page = 1, limit = 10) {
    const response = await api.get('/queues/email/trabajos', {
      params: { tipo, page, limit }
    });
    return response.data;
  },

  async retryJob(queue, jobId) {
    const response = await api.post(`/queues/${queue}/trabajos/${jobId}/reintentar`);
    return response.data;
  },

  async deleteJob(queue, jobId) {
    const response = await api.delete(`/queues/${queue}/trabajos/${jobId}/eliminar`);
    return response.data;
  }
};