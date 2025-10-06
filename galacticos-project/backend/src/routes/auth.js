const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { autenticarToken } = require('../middleware/auth');
const Usuario = require('../models/Usuario'); 
const jwt = require('jsonwebtoken');

// Rutas públicas
router.post('/registro', authController.registro);
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) return res.status(401).json({ error: 'Usuario no encontrado' });

  const bcrypt = require('bcryptjs');
  const valid = await bcrypt.compare(password, usuario.password);
  if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

  const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ accessToken: token });
});

router.post('/refresh-token', authController.refreshToken);

// Rutas protegidas
router.get('/perfil', autenticarToken, authController.perfil);
router.post('/logout', autenticarToken, authController.logout);

module.exports = router;