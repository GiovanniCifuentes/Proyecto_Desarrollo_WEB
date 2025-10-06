const Joi = require('joi');

const crearReservaSchema = Joi.object({
  evento_id: Joi.number().integer().required().messages({
    'number.base': 'El evento_id debe ser un número',
    'any.required': 'El evento_id es requerido'
  }),
  cantidad_entradas: Joi.number().integer().min(1).required().messages({
    'number.base': 'La cantidad de entradas debe ser un número',
    'number.min': 'La cantidad de entradas debe ser al menos 1'
  })
});

const actualizarReservaSchema = Joi.object({
  estado: Joi.string().valid('pendiente', 'confirmada', 'cancelada')
});

module.exports = {
  crearReservaSchema,
  actualizarReservaSchema
};