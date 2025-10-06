const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

// Importar colas y workers
require('./src/queues/emailQueue');
require('./src/queues/pdfQueue');
require('./src/workers/emailWorker');
require('./src/workers/pdfWorker');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/entradas', express.static(path.join(__dirname, 'entradas')));

// Importar rutas
const authRoutes = require('./src/routes/auth');
const eventosRoutes = require('./src/routes/eventos');
const reservasRoutes = require('./src/routes/reservas');
const queuesRoutes = require('./src/routes/queues');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/queues', queuesRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor Galacticos S.A. funcionando',
    timestamp: new Date().toISOString()
  });
});

// Ruta para descargar entradas
app.get('/api/entradas/:filename', (req, res) => {
  const { filename } = req.params;
  const filepath = path.join(__dirname, 'entradas', filename);
  
  res.download(filepath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Archivo no encontrado' });
    }
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Algo salió mal en el servidor',
    message: err.message 
  });
});

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Entorno: ${process.env.NODE_ENV}`);
  console.log(`🗄️  Sistema de colas activo`);
  console.log(`🔐 Sistema de autenticación JWT activo`);
  console.log(`🎪 Sistema de eventos y reservas activo`);
  console.log(`👷 Workers de PDF y Email activos`);
  console.log(`📁 Servidor de archivos de entradas activo`);
});