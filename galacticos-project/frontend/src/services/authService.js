import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async registro(datosUsuario) {
    const response = await api.post('/auth/registro', datosUsuario);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/perfil');
    return response.data.usuario;
  },

  async logout() {
    await api.post('/auth/logout');
  },

  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  }
};