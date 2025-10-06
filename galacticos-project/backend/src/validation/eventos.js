const Joi = require('joi');

const crearEventoSchema = Joi.object({
  nombre: Joi.string().min(2).max(255).required().messages({
    'string.empty': 'El nombre del evento es requerido',
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede exceder 255 caracteres'
  }),
  descripcion: Joi.string().required().messages({
    'string.empty': 'La descripción es requerida'
  }),
  fecha: Joi.date().greater('now').required().messages({
    'date.base': 'La fecha debe ser una fecha válida',
    'date.greater': 'La fecha debe ser futura'
  }),
  aforo_maximo: Joi.number().integer().min(1).required().messages({
    'number.base': 'El aforo máximo debe ser un número',
    'number.min': 'El aforo máximo debe ser al menos 1'
  }),
  precio: Joi.number().min(0).required().messages({
    'number.base': 'El precio debe ser un número',
    'number.min': 'El precio no puede ser negativo'
  }),
  ubicacion: Joi.string().optional().allow('')
});

const actualizarEventoSchema = Joi.object({
  nombre: Joi.string().min(2).max(255),
  descripcion: Joi.string(),
  fecha: Joi.date().greater('now'),
  aforo_maximo: Joi.number().integer().min(1),
  precio: Joi.number().min(0),
  ubicacion: Joi.string().optional().allow('')
}).min(1); // al menos un campo para actualizar

module.exports = {
  crearEventoSchema,
  actualizarEventoSchema
};