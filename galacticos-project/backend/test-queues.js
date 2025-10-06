const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';
let accessToken = '';

async function testQueues() {
  try {
    console.log('🔍 Probando sistema de colas...\n');

    // 1. Login como admin
    console.log('1. Login como admin...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@galacticos.com',
      password: 'admin123'
    });
    
    accessToken = loginResponse.data.accessToken;
    console.log('✅ Login exitoso como admin');

    // 2. Obtener estadísticas de colas
    console.log('\n2. Obteniendo estadísticas de colas...');
    const statsResponse = await axios.get(`${API_BASE}/queues/estadisticas`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('✅ Estadísticas de colas:');
    console.log('   PDF Queue:', statsResponse.data.pdfQueue);
    console.log('   Email Queue:', statsResponse.data.emailQueue);

    // 3. Crear un evento de prueba
    console.log('\n3. Creando evento de prueba...');
    const eventoData = {
      nombre: 'Evento de Prueba para Colas',
      descripcion: 'Este evento es para probar el sistema de colas',
      fecha: '2025-12-31T20:00:00Z',
      aforo_maximo: 100,
      precio: 50.00,
      ubicacion: 'Sala de Pruebas'
    };

    const eventoResponse = await axios.post(`${API_BASE}/eventos`, eventoData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const eventoId = eventoResponse.data.evento.id;
    console.log('✅ Evento creado:', eventoResponse.data.evento.nombre);

    // 4. Login como cliente
    console.log('\n4. Login como cliente...');
    const clienteLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'juan@galacticos.com',
      password: 'password123'
    });
    
    const clienteToken = clienteLogin.data.accessToken;
    console.log('✅ Login exitoso como cliente');

    // 5. Crear reserva (esto activará las colas)
    console.log('\n5. Creando reserva para activar colas...');
    const reservaData = {
      evento_id: eventoId,
      cantidad_entradas: 1
    };

    const reservaResponse = await axios.post(`${API_BASE}/reservas`, reservaData, {
      headers: {
        'Authorization': `Bearer ${clienteToken}`
      }
    });

    console.log('✅ Reserva creada:', reservaResponse.data.message);
    console.log('   Se deberían activar los workers de PDF y Email');

    // 6. Esperar un momento y verificar las colas nuevamente
    console.log('\n6. Esperando procesamiento de colas...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    const statsFinal = await axios.get(`${API_BASE}/queues/estadisticas`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('✅ Estadísticas finales:');
    console.log('   PDF Queue:', statsFinal.data.pdfQueue);
    console.log('   Email Queue:', statsFinal.data.emailQueue);

    console.log('\n🎉 Prueba del sistema de colas completada!');

  } catch (error) {
    if (error.response) {
      console.error('❌ Error:', error.response.data);
      console.error('   Status:', error.response.status);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

testQueues();