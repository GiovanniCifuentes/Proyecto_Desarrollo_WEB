const { Reserva, Evento, Usuario } = require('../models');
const { crearReservaSchema, actualizarReservaSchema } = require('../validation/reservas');
const pdfQueue = require('../queues/pdfQueue');
const emailQueue = require('../queues/emailQueue');

const reservasController = {
  async listarReservas(req, res) {
    try {
      const { page = 1, limit = 10, estado } = req.query;
      const offset = (page - 1) * limit;

      // Los clientes solo ven sus reservas, los administradores ven todas
      const whereClause = req.usuario.rol === 'admin' ? {} : { usuario_id: req.usuario.id };
      
      if (estado) {
        whereClause.estado = estado;
      }

      const reservas = await Reserva.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          {
            model: Evento,
            as: 'evento',
            attributes: ['id', 'nombre', 'fecha', 'precio', 'ubicacion']
          },
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        reservas: reservas.rows,
        total: reservas.count,
        totalPages: Math.ceil(reservas.count / limit),
        currentPage: parseInt(page)
      });
    } catch (error) {
      console.error('Error listando reservas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async obtenerReserva(req, res) {
    try {
      const { id } = req.params;

      const reserva = await Reserva.findByPk(id, {
        include: [
          {
            model: Evento,
            as: 'evento',
            attributes: ['id', 'nombre', 'fecha', 'precio', 'descripcion', 'ubicacion']
          },
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email']
          }
        ]
      });

      if (!reserva) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      // Verificar que el usuario tiene permisos para ver esta reserva
      if (req.usuario.rol !== 'admin' && reserva.usuario_id !== req.usuario.id) {
        return res.status(403).json({ error: 'No tienes permisos para ver esta reserva' });
      }

      res.json({ reserva });
    } catch (error) {
      console.error('Error obteniendo reserva:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async crearReserva(req, res) {
    try {
      const { error, value } = crearReservaSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { evento_id, cantidad_entradas } = value;

      // Verificar que el evento existe
      const evento = await Evento.findByPk(evento_id);
      if (!evento) {
        return res.status(404).json({ error: 'Evento no encontrado' });
      }

      // Verificar aforo disponible
      if (!evento.tieneAforoDisponible(cantidad_entradas)) {
        return res.status(400).json({ 
          error: `No hay suficiente aforo disponible. Solo quedan ${evento.aforo_maximo - evento.aforo_actual} entradas` 
        });
      }

      // Crear la reserva
      const reserva = await Reserva.create({
        usuario_id: req.usuario.id,
        evento_id,
        cantidad_entradas,
        estado: 'confirmada'
      });

      // Actualizar aforo del evento
      await evento.actualizarAforo(cantidad_entradas, 'sumar');

      // Generar código QR
      reserva.generarCodigoQR();
      await reserva.save();

      // Cargar datos relacionados para las colas
      const reservaConDatos = await Reserva.findByPk(reserva.id, {
        include: [
          {
            model: Evento,
            as: 'evento',
            attributes: ['id', 'nombre', 'fecha', 'precio', 'ubicacion']
          },
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email']
          }
        ]
      });

      // Agregar trabajos a las colas
      await pdfQueue.add('generar-pdf-entrada', {
        reserva: reservaConDatos.toJSON()
      });

      await emailQueue.add('enviar-email-confirmacion', {
        reserva: reservaConDatos.toJSON()
      });

      res.status(201).json({
        message: 'Reserva creada exitosamente. Se generará tu entrada y recibirás un email de confirmación.',
        reserva: reservaConDatos
      });

    } catch (error) {
      console.error('Error creando reserva:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async cancelarReserva(req, res) {
    try {
      const { id } = req.params;

      const reserva = await Reserva.findByPk(id, {
        include: [
          {
            model: Evento,
            as: 'evento'
          }
        ]
      });

      if (!reserva) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      // Verificar permisos
      if (req.usuario.rol !== 'admin' && reserva.usuario_id !== req.usuario.id) {
        return res.status(403).json({ error: 'No tienes permisos para cancelar esta reserva' });
      }

      // Verificar que no esté ya cancelada
      if (reserva.estado === 'cancelada') {
        return res.status(400).json({ error: 'La reserva ya está cancelada' });
      }

      // Verificar que el evento no haya pasado
      const ahora = new Date();
      if (new Date(reserva.evento.fecha) < ahora) {
        return res.status(400).json({ error: 'No se puede cancelar una reserva de un evento que ya pasó' });
      }

      // Actualizar estado y aforo
      await reserva.update({ estado: 'cancelada' });
      await reserva.evento.actualizarAforo(reserva.cantidad_entradas, 'restar');

      res.json({ 
        message: 'Reserva cancelada exitosamente',
        reserva 
      });

    } catch (error) {
      console.error('Error cancelando reserva:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async actualizarReserva(req, res) {
    try {
      if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Solo los administradores pueden actualizar reservas' });
      }

      const { id } = req.params;

      const { error, value } = actualizarReservaSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const reserva = await Reserva.findByPk(id);
      if (!reserva) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      await reserva.update(value);

      res.json({
        message: 'Reserva actualizada exitosamente',
        reserva
      });
    } catch (error) {
      console.error('Error actualizando reserva:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

module.exports = reservasController;