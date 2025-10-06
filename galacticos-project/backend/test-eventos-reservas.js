const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';
let accessToken = '';
let eventoId = '';
let reservaId = '';

async function testEventosReservas() {
  try {
    console.log('🔍 Probando eventos y reservas...\n');
     
    try {
    // 1. Login como admin
    console.log('1. Login como admin...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@galacticos.com',
      password: 'admin123'
    });
    
    accessToken = loginResponse.data.accessToken;
    console.log('✅ Login exitoso como admin');
    } catch (error) {
        console.error('❌ Error:', error.response ? error.response.data : error);
    }

    // 2. Crear un nuevo evento
    console.log('\n2. Creando nuevo evento...');
    const eventoData = {
      nombre: 'Concierto de Prueba',
      descripcion: 'Este es un evento de prueba para el sistema de reservas',
      fecha: '2025-12-31T20:00:00Z',
      aforo_maximo: 50,
      precio: 75.00,
      ubicacion: 'Auditorio Principal'
    };

    const eventoResponse = await axios.post(`${API_BASE}/eventos`, eventoData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    eventoId = eventoResponse.data.evento.id;
    console.log('✅ Evento creado:', eventoResponse.data.evento.nombre);

    // 3. Listar eventos
    console.log('\n3. Listando eventos...');
    const eventosResponse = await axios.get(`${API_BASE}/eventos`);
    console.log('✅ Eventos listados. Total:', eventosResponse.data.total);

    // 4. Obtener aforo del evento
    console.log('\n4. Obteniendo aforo del evento...');
    const aforoResponse = await axios.get(`${API_BASE}/eventos/${eventoId}/aforo`);
    console.log('✅ Aforo disponible:', aforoResponse.data.aforo_disponible);

    // 5. Login como cliente
    console.log('\n5. Login como cliente...');
    const clienteLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'juan@galacticos.com',
      password: 'password123'
    });
    
    const clienteToken = clienteLogin.data.accessToken;
    console.log('✅ Login exitoso como cliente');

    // 6. Crear reserva
    console.log('\n6. Creando reserva...');
    const reservaData = {
      evento_id: eventoId,
      cantidad_entradas: 2
    };

    const reservaResponse = await axios.post(`${API_BASE}/reservas`, reservaData, {
      headers: {
        'Authorization': `Bearer ${clienteToken}`
      }
    });

    reservaId = reservaResponse.data.reserva.id;
    console.log('✅ Reserva creada:', reservaResponse.data.message);

    // 7. Listar reservas del cliente
    console.log('\n7. Listando reservas del cliente...');
    const reservasResponse = await axios.get(`${API_BASE}/reservas`, {
      headers: {
        'Authorization': `Bearer ${clienteToken}`
      }
    });

    console.log('✅ Reservas listadas. Total:', reservasResponse.data.total);

    // 8. Verificar aforo actualizado
    console.log('\n8. Verificando aforo actualizado...');
    const aforoActualizado = await axios.get(`${API_BASE}/eventos/${eventoId}/aforo`);
    console.log('✅ Aforo disponible después de reserva:', aforoActualizado.data.aforo_disponible);

    console.log('\n🎉 Todas las pruebas de eventos y reservas pasaron!');

  } catch (error) {
    if (error.response) {
      console.error('❌ Error:', error.response.data);
      console.error('   Status:', error.response.status);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

testEventosReservas();