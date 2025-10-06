import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        try {
          const userProfile = await authService.getProfile();
          setUsuario(userProfile);
        } catch (error) {
          console.error('Error al cargar perfil:', error);
          logout();
        }
      }
      setCargando(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { accessToken, refreshToken, usuario } = response;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setToken(accessToken);
      setUsuario(usuario);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const registro = async (datosUsuario) => {
    try {
      const response = await authService.registro(datosUsuario);
      const { accessToken, refreshToken, usuario } = response;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setToken(accessToken);
      setUsuario(usuario);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUsuario(null);
  };

  const value = {
    usuario,
    token,
    login,
    registro,
    logout,
    cargando,
    isAuthenticated: !!usuario,
    isAdmin: usuario?.rol === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};