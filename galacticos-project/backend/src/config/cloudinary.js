const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurar almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'galacticos-eventos', // Carpeta donde se guardarán las imágenes
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'limit' }, // Limitar tamaño
      { quality: 'auto' } // Optimizar calidad automáticamente
    ]
  }
});

// Configurar multer con el almacenamiento de Cloudinary
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  },
  fileFilter: (req, file, cb) => {
    // Validar tipo de archivo
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no válido. Solo se permiten imágenes (jpg, jpeg, png, gif, webp)'), false);
    }
  }
});

// Función para eliminar imagen de Cloudinary
const deleteImage = async (imageUrl) => {
  try {
    // Extraer el public_id de la URL de Cloudinary
    const urlParts = imageUrl.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = `galacticos-eventos/${publicIdWithExtension.split('.')[0]}`;
    
    await cloudinary.uploader.destroy(publicId);
    console.log(`✅ Imagen eliminada de Cloudinary: ${publicId}`);
  } catch (error) {
    console.error('Error eliminando imagen de Cloudinary:', error);
  }
};

module.exports = {
  cloudinary,
  upload,
  deleteImage
};



