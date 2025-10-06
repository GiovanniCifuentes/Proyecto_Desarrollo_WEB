const { Usuario } = require('../models');
const { generarTokens, verificarToken } = require('../utils/jwt');
const { registroSchema, loginSchema, refreshTokenSchema } = require('../validation/auth');

const authController = {
  async registro(req, res) {
    try {
      // Validar datos de entrada
      const { error, value } = registroSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { nombre, email, password, rol } = value;

      // Verificar si el usuario ya existe
      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      // Crear nuevo usuario
      const usuario = await Usuario.create({
        nombre,
        email,
        password,
        rol
      });

      // Generar tokens
      const { accessToken, refreshToken } = generarTokens(usuario);

      // Responder sin incluir la contraseña
      const usuarioResponse = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        createdAt: usuario.createdAt,
        updatedAt: usuario.updatedAt
      };

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        usuario: usuarioResponse,
        accessToken,
        refreshToken
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async login(req, res) {
    try {
      // Validar datos de entrada
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { email, password } = value;

      // Buscar usuario
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const passwordValida = await usuario.validarPassword(password);
      if (!passwordValida) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Generar tokens
      const { accessToken, refreshToken } = generarTokens(usuario);

      // Responder sin incluir la contraseña
      const usuarioResponse = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        createdAt: usuario.createdAt,
        updatedAt: usuario.updatedAt
      };

      res.json({
        message: 'Login exitoso',
        usuario: usuarioResponse,
        accessToken,
        refreshToken
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async refreshToken(req, res) {
    try {
      const { error, value } = refreshTokenSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { refreshToken } = value;

      // Verificar refresh token
      const decoded = verificarToken(refreshToken, true);

      // Buscar usuario
      const usuario = await Usuario.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!usuario) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }

      // Generar nuevos tokens
      const tokens = generarTokens(usuario);

      res.json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }
      });

    } catch (error) {
      console.error('Error refrescando token:', error);
      res.status(403).json({ error: 'Refresh token inválido o expirado' });
    }
  },

  async perfil(req, res) {
    try {
      // El usuario ya está en req.usuario gracias al middleware de autenticación
      res.json({
        usuario: req.usuario
      });
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async logout(req, res) {
    // En un sistema más avanzado, podrías invalidar el refresh token
    // Por ahora, el frontend simplemente elimina los tokens
    res.json({ message: 'Logout exitoso' });
  }
};

module.exports = authController;