const Joi = require('joi');

const registroSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'El nombre es requerido',
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder 100 caracteres'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'El email debe ser válido',
    'string.empty': 'El email es requerido'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres',
    'string.empty': 'La contraseña es requerida'
  }),
  rol: Joi.string().valid('cliente', 'admin').default('cliente')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'El email debe ser válido',
    'string.empty': 'El email es requerido'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'La contraseña es requerida'
  })
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.empty': 'El refresh token es requerido'
  })
});

module.exports = {
  registroSchema,
  loginSchema,
  refreshTokenSchema
};