const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservasController');
const { autenticarToken, autorizarRoles } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.get('/', autenticarToken, reservasController.listarReservas);
router.get('/:id', autenticarToken, reservasController.obtenerReserva);
router.post('/', autenticarToken, reservasController.crearReserva);
router.patch('/:id/cancelar', autenticarToken, reservasController.cancelarReserva);

// Solo admin puede actualizar reservas
router.put('/:id', autenticarToken, autorizarRoles('admin'), reservasController.actualizarReserva);

module.exports = router;