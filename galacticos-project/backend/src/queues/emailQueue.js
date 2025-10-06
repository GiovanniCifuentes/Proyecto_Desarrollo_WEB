const { Queue } = require('bullmq');
const redisConnection = require('./redis');

const emailQueue = new Queue('emailQueue', {
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

// Métodos de utilidad para el monitoreo
emailQueue.getEstadisticas = async () => {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    emailQueue.getWaiting(),
    emailQueue.getActive(),
    emailQueue.getCompleted(),
    emailQueue.getFailed(),
    emailQueue.getDelayed()
  ]);

  return {
    waiting: waiting.length,
    active: active.length,
    completed: completed.length,
    failed: failed.length,
    delayed: delayed.length
  };
};

console.log('📧 Cola de emails configurada');

module.exports = emailQueue;