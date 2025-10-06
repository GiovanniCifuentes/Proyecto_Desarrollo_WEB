const { Worker } = require('bullmq');
const redisConnection = require('../queues/redis');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Asegurarnos de que exista la carpeta de entradas
const entradasDir = path.join(__dirname, '../../entradas');
if (!fs.existsSync(entradasDir)) {
  fs.mkdirSync(entradasDir, { recursive: true });
}

const pdfWorker = new Worker('pdfQueue', async (job) => {
  try {
    console.log(`📄 Procesando trabajo de PDF: ${job.id}`);
    const { reserva } = job.data;

    // Generar código QR
    const qrCodeData = `Reserva: ${reserva.id}\nEvento: ${reserva.evento.nombre}\nUsuario: ${reserva.usuario.nombre}\nEntradas: ${reserva.cantidad_entradas}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    // Crear documento PDF
    const doc = new PDFDocument();
    const filename = `entrada-${reserva.id}.pdf`;
    const filepath = path.join(entradasDir, filename);

    // Pipe the PDF to a file
    doc.pipe(fs.createWriteStream(filepath));

    // Agregar contenido al PDF
    doc.fontSize(20).text('Galacticos S.A.', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text('Entrada para Evento', { align: 'center' });
    doc.moveDown();

    // Información del evento
    doc.fontSize(12).text(`Evento: ${reserva.evento.nombre}`);
    doc.text(`Fecha: ${new Date(reserva.evento.fecha).toLocaleString()}`);
    doc.text(`Ubicación: ${reserva.evento.ubicacion || 'Por definir'}`);
    doc.text(`Precio por entrada: $${reserva.evento.precio}`);
    doc.moveDown();

    // Información de la reserva
    doc.text(`Número de reserva: ${reserva.id}`);
    doc.text(`Cantidad de entradas: ${reserva.cantidad_entradas}`);
    doc.text(`Total pagado: $${reserva.evento.precio * reserva.cantidad_entradas}`);
    doc.text(`Código de reserva: ${reserva.codigo_qr}`);
    doc.moveDown();

    // Agregar QR code (como imagen base64)
    doc.text('Código QR de la reserva:');
    doc.image(qrCodeImage, {
      fit: [150, 150],
      align: 'center'
    });

    doc.moveDown();
    doc.fontSize(10).text('Gracias por su reserva. Presente este código QR en la entrada del evento.', { align: 'center' });

    // Finalizar PDF
    doc.end();

    // Esperar a que se escriba el archivo
    await new Promise((resolve, reject) => {
      doc.on('end', resolve);
      doc.on('error', reject);
    });

    console.log(`✅ PDF generado: ${filename}`);
    
    return {
      filename,
      filepath,
      reservaId: reserva.id
    };
  } catch (error) {
    console.error('❌ Error generando PDF:', error);
    throw error;
  }
}, {
  connection: redisConnection,
  concurrency: 5
});

pdfWorker.on('completed', (job) => {
  console.log(`🎉 Trabajo de PDF completado: ${job.id}`);
});

pdfWorker.on('failed', (job, err) => {
  console.error(`💥 Trabajo de PDF fallido: ${job.id}`, err);
});

console.log('👷 PDF Worker iniciado');

module.exports = pdfWorker;