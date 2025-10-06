const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

// Importar modelos
const Usuario = require('./Usuario');
const Evento = require('./Evento');
const Reserva = require('./Reserva');

// Inicializar modelos
Usuario.initialize(sequelize);
Evento.initialize(sequelize);
Reserva.initialize(sequelize);

// Configurar asociaciones
Usuario.associate({ Reserva });
Evento.associate({ Reserva });
Reserva.associate({ Usuario, Evento });

module.exports = {
  sequelize,
  Usuario,
  Evento,
  Reserva
};
