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
      precio: 50.00
    },
    {
      nombre: 'Conferencia Tech',
      descripcion: 'Conferencia sobre las últimas tecnologías',
      fecha: new Date('2024-02-20T10:00:00'),
      aforo_maximo: 200,
      precio: 25.00
    }
  ]);

  console.log('🌱 Datos de prueba insertados');
}

initializeDatabase();