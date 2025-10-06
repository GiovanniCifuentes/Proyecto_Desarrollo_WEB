const { Queue } = require('bullmq');
const redisConnection = require('./redis');

const pdfQueue = new Queue('pdfQueue', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});

console.log('📄 Cola de PDFs configurada');

module.exports = pdfQueue;