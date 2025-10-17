require('dotenv').config();
const { sequelize } = require('../models');

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida');

    await sequelize.sync({ force: true });
    console.log('✅ Base de datos sincronizada');

    await seedDatabase();
    console.log('🎉 Base de datos inicializada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
    process.exit(1);
  }
}

async function seedDatabase() {
  const { Usuario, Evento } = require('../models');

  await Usuario.create({
    nombre: 'Administrador',
    email: 'admin@galacticos.com',
    password: 'admin123',
    rol: 'admin'
  });

  await Evento.bulkCreate([
    {
      nombre: 'Concierto de Rock',
      descripcion: 'Un concierto increíble de bandas de rock',
      fecha: new Date('2024-02-15T20:00:00'),
      aforo_maximo: 100,
      precio: 50.00,
      tipo: 'concierto',
      ubicacion: 'Estadio Nacional',
      imagen: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400'
    },
    {
      nombre: 'Conferencia Tech',
      descripcion: 'Conferencia sobre las últimas tecnologías',
      fecha: new Date('2024-02-20T10:00:00'),
      aforo_maximo: 200,
      precio: 25.00,
      tipo: 'otro',
      ubicacion: 'Centro de Convenciones',
      imagen: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'
    },
    {
      nombre: 'Obra de Teatro - Hamlet',
      descripcion: 'La clásica obra de Shakespeare',
      fecha: new Date('2024-03-10T19:00:00'),
      aforo_maximo: 150,
      precio: 35.00,
      tipo: 'teatro',
      ubicacion: 'Teatro Municipal',
      imagen: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400'
    },
    {
      nombre: 'Partido de Fútbol',
      descripcion: 'Final del torneo local',
      fecha: new Date('2024-03-25T16:00:00'),
      aforo_maximo: 500,
      precio: 20.00,
      tipo: 'deporte',
      ubicacion: 'Estadio Municipal',
      imagen: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400'
    },
    {
      nombre: 'Noche de Comedia Stand-Up',
      descripcion: 'Los mejores comediantes de la ciudad',
      fecha: new Date('2024-04-05T21:00:00'),
      aforo_maximo: 80,
      precio: 15.00,
      tipo: 'comedia',
      ubicacion: 'Comedy Club Downtown',
      imagen: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400'
    }
  ]);

  console.log('🌱 Datos de prueba insertados');
}

initializeDatabase();