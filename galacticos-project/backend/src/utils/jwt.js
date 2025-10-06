const jwt = require('jsonwebtoken');

const generarTokens = (usuario) => {
  const accessToken = jwt.sign(
    { 
      id: usuario.id, 
      email: usuario.email, 
      rol: usuario.rol 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { 
      id: usuario.id, 
      email: usuario.email 
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

const verificarToken = (token, esRefresh = false) => {
  try {
    const secret = esRefresh ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET;
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};

module.exports = {
  generarTokens,
  verificarToken
};