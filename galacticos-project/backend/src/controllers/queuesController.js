const pdfQueue = require('../queues/pdfQueue');
const emailQueue = require('../queues/emailQueue');

const queuesController = {
  async getEstadisticas(req, res) {
    try {
      const [pdfStats, emailStats] = await Promise.all([
        pdfQueue.getJobCounts(),
        emailQueue.getJobCounts()
      ]);

      res.json({
        pdfQueue: pdfStats,
        emailQueue: emailStats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas de colas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getTrabajosPdf(req, res) {
    try {
      const { tipo = 'waiting', page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      let trabajos = [];
      switch (tipo) {
        case 'waiting':
          trabajos = await pdfQueue.getWaiting(offset, offset + parseInt(limit) - 1);
          break;
        case 'active':
          trabajos = await pdfQueue.getActive(offset, offset + parseInt(limit) - 1);
          break;
        case 'completed':
          trabajos = await pdfQueue.getCompleted(offset, offset + parseInt(limit) - 1);
          break;
        case 'failed':
          trabajos = await pdfQueue.getFailed(offset, offset + parseInt(limit) - 1);
          break;
        case 'delayed':
          trabajos = await pdfQueue.getDelayed(offset, offset + parseInt(limit) - 1);
          break;
        default:
          return res.status(400).json({ error: 'Tipo de trabajo no válido' });
      }

      res.json({
        trabajos,
        tipo,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    } catch (error) {
      console.error('Error obteniendo trabajos PDF:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getTrabajosEmail(req, res) {
    try {
      const { tipo = 'waiting', page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      let trabajos = [];
      switch (tipo) {
        case 'waiting':
          trabajos = await emailQueue.getWaiting(offset, offset + parseInt(limit) - 1);
          break;
        case 'active':
          trabajos = await emailQueue.getActive(offset, offset + parseInt(limit) - 1);
          break;
        case 'completed':
          trabajos = await emailQueue.getCompleted(offset, offset + parseInt(limit) - 1);
          break;
        case 'failed':
          trabajos = await emailQueue.getFailed(offset, offset + parseInt(limit) - 1);
          break;
        case 'delayed':
          trabajos = await emailQueue.getDelayed(offset, offset + parseInt(limit) - 1);
          break;
        default:
          return res.status(400).json({ error: 'Tipo de trabajo no válido' });
      }

      res.json({
        trabajos,
        tipo,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    } catch (error) {
      console.error('Error obteniendo trabajos Email:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async reintentarTrabajo(req, res) {
    try {
      const { queue, jobId } = req.params;
      const targetQueue = queue === 'pdf' ? pdfQueue : emailQueue;

      const job = await targetQueue.getJob(jobId);
      if (!job) {
        return res.status(404).json({ error: 'Trabajo no encontrado' });
      }

      await job.retry();

      res.json({ message: 'Trabajo reintentado exitosamente' });
    } catch (error) {
      console.error('Error reintentando trabajo:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async eliminarTrabajo(req, res) {
    try {
      const { queue, jobId } = req.params;
      const targetQueue = queue === 'pdf' ? pdfQueue : emailQueue;

      const job = await targetQueue.getJob(jobId);
      if (!job) {
        return res.status(404).json({ error: 'Trabajo no encontrado' });
      }

      await job.remove();

      res.json({ message: 'Trabajo eliminado exitosamente' });
    } catch (error) {
      console.error('Error eliminando trabajo:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

module.exports = queuesController;