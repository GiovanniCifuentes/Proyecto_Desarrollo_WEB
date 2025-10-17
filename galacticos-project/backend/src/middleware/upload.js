const { upload } = require('../config/cloudinary');

// Middleware para manejar errores de multer
const handleUploadError = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 5MB' });
    }
    if (err.message) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(400).json({ error: 'Error al subir la imagen' });
  }
  next();
};

// Middleware para subir una sola imagen con el campo 'imagen'
const uploadSingleImage = (req, res, next) => {
  const uploadSingle = upload.single('imagen');
  
  uploadSingle(req, res, (err) => {
    if (err) {
      return handleUploadError(err, req, res, next);
    }
    
    // Si se subió un archivo, agregar la URL al body
    if (req.file) {
      req.body.imagen = req.file.path; // Cloudinary devuelve la URL en file.path
      console.log(`✅ Imagen subida: ${req.file.path}`);
    }
    
    next();
  });
};

// Middleware opcional - si no se sube imagen, continuar
const uploadSingleImageOptional = (req, res, next) => {
  const uploadSingle = upload.single('imagen');
  
  uploadSingle(req, res, (err) => {
    // Si el error no es por falta de archivo, manejarlo
    if (err && err.code !== 'LIMIT_UNEXPECTED_FILE') {
      return handleUploadError(err, req, res, next);
    }
    
    // Si se subió un archivo, agregar la URL al body
    if (req.file) {
      req.body.imagen = req.file.path;
      console.log(`✅ Imagen subida: ${req.file.path}`);
    }
    
    next();
  });
};

module.exports = {
  uploadSingleImage,
  uploadSingleImageOptional,
  handleUploadError
};



