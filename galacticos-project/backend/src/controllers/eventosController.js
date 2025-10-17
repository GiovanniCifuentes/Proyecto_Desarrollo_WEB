const { Evento, Reserva } = require('../models');
const { crearEventoSchema, actualizarEventoSchema } = require('../validation/eventos');
const { deleteImage } = require('../config/cloudinary');

const eventosController = {
  async listarEventos(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (search) {
        whereClause.nombre = {
          [require('sequelize').Op.iLike]: `%${search}%`
        };
      }

      const eventos = await Evento.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['fecha', 'ASC']],
        include: [{
          model: Reserva,
          as: 'reservas',
          attributes: ['id', 'estado']
        }]
      });

      res.json({
        eventos: eventos.rows,
        total: eventos.count,
        totalPages: Math.ceil(eventos.count / limit),
        currentPage: parseInt(page)
      });
    } catch (error) {
      console.error('Error listando eventos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async obtenerEvento(req, res) {
    try {
      const { id } = req.params;

      const evento = await Evento.findByPk(id, {
        include: [{
          model: Reserva,
          as: 'reservas',
          attributes: ['id', 'estado', 'cantidad_entradas']
        }]
      });

      if (!evento) {
        return res.status(404).json({ error: 'Evento no encontrado' });
      }

      res.json({ evento });
    } catch (error) {
      console.error('Error obteniendo evento:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async crearEvento(req, res) {
    try {
      // Solo administradores pueden crear eventos
      if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'No tienes permisos para crear eventos' });
      }

      // La imagen ya está en req.body.imagen gracias al middleware
      const { error, value } = crearEventoSchema.validate(req.body);
      if (error) {
        // Si hay error de validación y se subió una imagen, eliminarla de Cloudinary
        if (req.body.imagen && req.body.imagen.includes('cloudinary')) {
          await deleteImage(req.body.imagen);
        }
        return res.status(400).json({ error: error.details[0].message });
      }

      const evento = await Evento.create(value);

      res.status(201).json({
        message: 'Evento creado exitosamente',
        evento
      });
    } catch (error) {
      console.error('Error creando evento:', error);
      
      // Si hay error y se subió una imagen, eliminarla de Cloudinary
      if (req.body.imagen && req.body.imagen.includes('cloudinary')) {
        await deleteImage(req.body.imagen);
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async actualizarEvento(req, res) {
    try {
      if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'No tienes permisos para actualizar eventos' });
      }

      const { id } = req.params;

      const { error, value } = actualizarEventoSchema.validate(req.body);
      if (error) {
        // Si hay error de validación y se subió una nueva imagen, eliminarla
        if (req.body.imagen && req.body.imagen.includes('cloudinary')) {
          await deleteImage(req.body.imagen);
        }
        return res.status(400).json({ error: error.details[0].message });
      }

      const evento = await Evento.findByPk(id);
      if (!evento) {
        // Si no existe el evento y se subió una nueva imagen, eliminarla
        if (req.body.imagen && req.body.imagen.includes('cloudinary')) {
          await deleteImage(req.body.imagen);
        }
        return res.status(404).json({ error: 'Evento no encontrado' });
      }

      // Si se está actualizando la imagen y había una anterior, eliminar la anterior
      if (req.body.imagen && evento.imagen && evento.imagen.includes('cloudinary')) {
        await deleteImage(evento.imagen);
      }

      await evento.update(value);

      res.json({
        message: 'Evento actualizado exitosamente',
        evento
      });
    } catch (error) {
      console.error('Error actualizando evento:', error);
      
      // Si hay error y se subió una nueva imagen, eliminarla
      if (req.body.imagen && req.body.imagen.includes('cloudinary')) {
        await deleteImage(req.body.imagen);
      }
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async eliminarEvento(req, res) {
    try {
      if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'No tienes permisos para eliminar eventos' });
      }

      const { id } = req.params;

      const evento = await Evento.findByPk(id);
      if (!evento) {
        return res.status(404).json({ error: 'Evento no encontrado' });
      }

      // Verificar si hay reservas para este evento
      const reservasCount = await Reserva.count({ where: { evento_id: id } });
      if (reservasCount > 0) {
        return res.status(400).json({ 
          error: 'No se puede eliminar el evento porque tiene reservas asociadas' 
        });
      }

      // Si el evento tiene imagen en Cloudinary, eliminarla
      if (evento.imagen && evento.imagen.includes('cloudinary')) {
        await deleteImage(evento.imagen);
      }

      await evento.destroy();

      res.json({ message: 'Evento eliminado exitosamente' });
    } catch (error) {
      console.error('Error eliminando evento:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async obtenerAforoDisponible(req, res) {
    try {
      const { id } = req.params;

      const evento = await Evento.findByPk(id);
      if (!evento) {
        return res.status(404).json({ error: 'Evento no encontrado' });
      }

      const aforoDisponible = evento.aforo_maximo - evento.aforo_actual;

      res.json({
        evento: {
          id: evento.id,
          nombre: evento.nombre,
          aforo_maximo: evento.aforo_maximo,
          aforo_actual: evento.aforo_actual
        },
        aforo_disponible: aforoDisponible
      });
    } catch (error) {
      console.error('Error obteniendo aforo:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

module.exports = eventosController;