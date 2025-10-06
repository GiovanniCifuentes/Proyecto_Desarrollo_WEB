require('dotenv').config();
const IORedis = require('ioredis');
const connection = new IORedis(process.env.REDIS_URL);

connection.on('connect', () => {
  console.log('✅ Conectado a Redis');
});

connection.on('error', (err) => {
  console.error('❌ Error de Redis:', err);
});

module.exports = connection;