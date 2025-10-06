const express = require('express');
const router = express.Router();
const queuesController = require('../controllers/queuesController');
const { autenticarToken, autorizarRoles } = require('../middleware/auth');

// Todas las rutas requieren autenticación y rol de admin
router.get('/estadisticas', autenticarToken, autorizarRoles('admin'), queuesController.getEstadisticas);
router.get('/pdf/trabajos', autenticarToken, autorizarRoles('admin'), queuesController.getTrabajosPdf);
router.get('/email/trabajos', autenticarToken, autorizarRoles('admin'), queuesController.getTrabajosEmail);
router.post('/:queue/trabajos/:jobId/reintentar', autenticarToken, autorizarRoles('admin'), queuesController.reintentarTrabajo);
router.delete('/:queue/trabajos/:jobId/eliminar', autenticarToken, autorizarRoles('admin'), queuesController.eliminarTrabajo);

module.exports = router;