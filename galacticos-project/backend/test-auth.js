const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testAuth() {
  try {
    console.log('🔍 Probando autenticación...\n');

    // 1. Registrar un nuevo usuario
    console.log('1. Registrando usuario...');
    const registroData = {
      nombre: 'Juan Pérez',
      email: 'juan@galacticos.com',
      password: 'password123'
    };

    const registroResponse = await axios.post(`${API_BASE}/auth/registro`, registroData);
    console.log('✅ Registro exitoso:', registroResponse.data.message);
    console.log('   Usuario ID:', registroResponse.data.usuario.id);
    console.log('   Token recibido:', registroResponse.data.accessToken ? 'SÍ' : 'NO');

    const accessToken = registroResponse.data.accessToken;

    // 2. Obtener perfil (ruta protegida)
    console.log('\n2. Obteniendo perfil...');
    const perfilResponse = await axios.get(`${API_BASE}/auth/perfil`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log('✅ Perfil obtenido:', perfilResponse.data.usuario.email);

    // 3. Probar login
    console.log('\n3. Probando login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'juan@galacticos.com',
      password: 'password123'
    });
    console.log('✅ Login exitoso:', loginResponse.data.message);

    console.log('\n🎉 Todas las pruebas de autenticación pasaron!');

  } catch (error) {
    if (error.response) {
      console.error('❌ Error:', error.response.data);
      console.error('   Status:', error.response.status);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

testAuth();