const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { autenticarToken } = require('../middleware/auth');

// Rutas públicas
router.post('/registro', authController.registro);
router.post('/login', authController.login);

router.post('/refresh-token', authController.refreshToken);

// Rutas protegidas
router.get('/perfil', autenticarToken, authController.perfil);
router.post('/logout', autenticarToken, authController.logout);

module.exports = router;