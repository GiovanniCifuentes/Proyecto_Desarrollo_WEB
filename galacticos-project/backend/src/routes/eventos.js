const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');
const { autenticarToken, autorizarRoles } = require('../middleware/auth');

router.get('/', eventosController.listarEventos);
router.get('/:id', eventosController.obtenerEvento);
router.get('/:id/aforo', eventosController.obtenerAforoDisponible);

// Protegido
router.post('/', autenticarToken, autorizarRoles('admin'), eventosController.crearEvento);
router.put('/:id', autenticarToken, autorizarRoles('admin'), eventosController.actualizarEvento);
router.delete('/:id', autenticarToken, autorizarRoles('admin'), eventosController.eliminarEvento);

module.exports = router;
