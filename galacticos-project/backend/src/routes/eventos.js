const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');
const { autenticarToken, autorizarRoles } = require('../middleware/auth');
const { uploadSingleImageOptional } = require('../middleware/upload');

router.get('/', eventosController.listarEventos);
router.get('/:id', eventosController.obtenerEvento);
router.get('/:id/aforo', eventosController.obtenerAforoDisponible);

// Protegido - Incluye upload de imagen
router.post('/', autenticarToken, autorizarRoles('admin'), uploadSingleImageOptional, eventosController.crearEvento);
router.put('/:id', autenticarToken, autorizarRoles('admin'), uploadSingleImageOptional, eventosController.actualizarEvento);
router.delete('/:id', autenticarToken, autorizarRoles('admin'), eventosController.eliminarEvento);

module.exports = router;
