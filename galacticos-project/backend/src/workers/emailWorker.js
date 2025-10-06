const { Worker } = require('bullmq');
const redisConnection = require('../queues/redis');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configurar el transporter de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const emailWorker = new Worker('emailQueue', async (job) => {
  try {
    console.log(`📧 Procesando trabajo de email: ${job.id}`);
    const { reserva } = job.data;

    // Verificar si el archivo PDF existe
    const pdfPath = path.join(__dirname, '../../entradas', `entrada-${reserva.id}.pdf`);
    const attachments = [];

    if (fs.existsSync(pdfPath)) {
      attachments.push({
        filename: `entrada-${reserva.id}.pdf`,
        path: pdfPath
      });
    }

    // Configurar el email
    const mailOptions = {
      from: `"Galacticos S.A." <${process.env.EMAIL_USER}>`,
      to: reserva.usuario.email,
      subject: `Confirmación de Reserva - ${reserva.evento.nombre}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #333; }
                .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .details { background: #f9f9f9; padding: 15px; border-radius: 5px; }
                .footer { margin-top: 20px; padding: 10px; text-align: center; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Galacticos S.A.</h1>
                <h2>Confirmación de Reserva</h2>
            </div>
            <div class="content">
                <p>Hola <strong>${reserva.usuario.nombre}</strong>,</p>
                <p>Tu reserva ha sido confirmada exitosamente. Aquí están los detalles:</p>
                
                <div class="details">
                    <h3>Detalles del Evento</h3>
                    <p><strong>Evento:</strong> ${reserva.evento.nombre}</p>
                    <p><strong>Fecha:</strong> ${new Date(reserva.evento.fecha).toLocaleString()}</p>
                    <p><strong>Ubicación:</strong> ${reserva.evento.ubicacion || 'Por definir'}</p>
                    <p><strong>Precio por entrada:</strong> $${reserva.evento.precio}</p>
                    
                    <h3>Detalles de la Reserva</h3>
                    <p><strong>Número de reserva:</strong> ${reserva.id}</p>
                    <p><strong>Cantidad de entradas:</strong> ${reserva.cantidad_entradas}</p>
                    <p><strong>Total pagado:</strong> $${reserva.evento.precio * reserva.cantidad_entradas}</p>
                    <p><strong>Código de reserva:</strong> ${reserva.codigo_qr}</p>
                </div>
                
                <p>Tu entrada en PDF está adjunta a este email. Por favor, preséntala en la entrada del evento.</p>
                <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            </div>
            <div class="footer">
                <p>© 2024 Galacticos S.A. - Todos los derechos reservados</p>
            </div>
        </body>
        </html>
      `,
      attachments
    };

    // Enviar email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado: ${info.messageId} para reserva ${reserva.id}`);
    
    return {
      messageId: info.messageId,
      reservaId: reserva.id,
      email: reserva.usuario.email
    };
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    throw error;
  }
}, {
  connection: redisConnection,
  concurrency: 3
});

emailWorker.on('completed', (job) => {
  console.log(`🎉 Trabajo de email completado: ${job.id}`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`💥 Trabajo de email fallido: ${job.id}`, err);
});

console.log('👷 Email Worker iniciado');

module.exports = emailWorker;