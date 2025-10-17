import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reservasService } from '../../services/reservasService';
import { eventosService } from '../../services/eventosService';
import { Button, Alert, Container, Card, Row, Col, Badge } from 'react-bootstrap';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './ReservaEvento.css';

const ReservaEvento = () => {
  const { id: eventoId } = useParams();
  const [evento, setEvento] = useState(null);
  const [loadingEvento, setLoadingEvento] = useState(true);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const data = await eventosService.getById(eventoId);
        setEvento(data.evento);
      } catch (error) {
        console.error('Error al cargar el evento:', error);
        setError('No se pudo cargar la información del evento');
      } finally {
        setLoadingEvento(false);
      }
    };

    fetchEvento();
  }, [eventoId]);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para formatear la hora
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Configuración del teatro basada en aforo real
  const configuracionTeatro = {
    escenario: {
      id: 'escenario',
      nombre: 'Escenario',
      tipo: 'escenario',
      asientosTotales: 0,
      precio: 0,
      descripcion: 'Área del escenario'
    },
    primeraFila: {
      id: 'primera_fila',
      nombre: 'Primera Fila',
      tipo: 'premium',
      asientosTotales: Math.floor((evento?.aforo_maximo || 200) * 0.1),
      precio: evento?.precio ? Math.round(evento.precio * 1.5) : 150,
      descripcion: 'Primera fila con vista premium'
    },
    preferencial: {
      id: 'preferencial',
      nombre: 'Preferencial',
      tipo: 'preferencial',
      asientosTotales: Math.floor((evento?.aforo_maximo || 200) * 0.3),
      precio: evento?.precio ? Math.round(evento.precio * 1.2) : 120,
      descripcion: 'Zona preferencial con excelente vista'
    },
    general: {
      id: 'general',
      nombre: 'General',
      tipo: 'general',
      asientosTotales: Math.floor((evento?.aforo_maximo || 200) * 0.6),
      precio: evento?.precio || 80,
      descripcion: 'Zona general con vista completa'
    }
  };

  // Función para generar asientos individuales
  const generarAsientos = () => {
    const aforoMaximo = evento?.aforo_maximo || 200;
    const aforoActual = evento?.aforo_actual || 0;
    const asientosVendidos = Math.min(aforoActual, aforoMaximo);
    
    const asientos = [];
    let contadorVendidos = 0;
    
    Object.values(configuracionTeatro).forEach(zona => {
      if (zona.asientosTotales > 0) {
        for (let i = 1; i <= zona.asientosTotales; i++) {
          const asientoId = `${zona.id}_${i}`;
          const estaVendido = contadorVendidos < asientosVendidos;
          
          asientos.push({
            id: asientoId,
            numero: i,
            zona: zona.id,
            zonaNombre: zona.nombre,
            precio: zona.precio,
            tipo: zona.tipo,
            disponible: !estaVendido,
            seleccionado: false
          });
          
          if (estaVendido) contadorVendidos++;
        }
      }
    });
    
    return asientos;
  };

  const asientos = generarAsientos();

  // Función para manejar selección de asiento
  const seleccionarAsiento = (asientoId) => {
    const asiento = asientos.find(a => a.id === asientoId);
    if (!asiento || !asiento.disponible) return;

    setAsientosSeleccionados(prev => {
      const yaSeleccionado = prev.find(a => a.id === asientoId);
      if (yaSeleccionado) {
        // Deseleccionar
        return prev.filter(a => a.id !== asientoId);
      } else if (prev.length < 10) {
        // Seleccionar (máximo 10)
        return [...prev, { ...asiento, seleccionado: true }];
      }
      return prev; // No hacer nada si ya hay 10 seleccionados
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMensaje('');
  setError('');
  setLoading(true);

  try {
    const response = await reservasService.create({
        evento_id: Number(eventoId),
        cantidad_entradas: asientosSeleccionados.length
    });
    setMensaje(response.message || 'Reserva realizada con éxito');
    setTimeout(() => {
      navigate('/reservas');
    }, 2000);
  } catch (err) {
    setError(
      err.response?.data?.error ||
      'No se pudo realizar la reserva. Intenta nuevamente.'
    );
  } finally {
    setLoading(false);
  }
};

  if (loadingEvento) {
    return (
      <div className="reserva-evento-wrapper">
        <Container className="py-5">
          <div className="text-center">
            <LoadingSpinner message="Cargando información del evento..." />
          </div>
        </Container>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="reserva-evento-wrapper">
        <Container className="py-5">
          <div className="text-center">
            <h3>Evento no encontrado</h3>
            <p>El evento que buscas no existe o ha sido eliminado.</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="reserva-evento-wrapper">
      <Container className="py-4">
        {/* Header del evento */}
        <Row className="mb-4">
          <Col>
            <div className="evento-header">
              <h1 className="evento-titulo">{evento.nombre || evento.titulo}</h1>
              <p className="evento-subtitulo">
                <i className="fas fa-calendar-alt me-2"></i>
                {formatDate(evento.fecha)} a las {formatTime(evento.fecha)}
              </p>
            </div>
          </Col>
        </Row>

        {/* Contenido principal */}
        <Row className="g-4 mb-5">
          {/* Imagen del evento */}
          <Col lg={6}>
            <div className="evento-imagen-container">
              <img 
                src={evento.imagen || '/LogoAzul.png'} 
                alt={evento.nombre || evento.titulo}
                className="evento-imagen"
              />
              <div className="evento-badge">
                <i className="fas fa-ticket-alt me-2"></i>
                {evento.tipo?.charAt(0).toUpperCase() + evento.tipo?.slice(1)}
              </div>
            </div>
          </Col>

          {/* Información del evento */}
          <Col lg={6}>
            <Card className="evento-info-card">
              <Card.Body className="p-4">
                <div className="evento-datos">
                  <div className="dato-item">
                    <i className="fas fa-clock text-primary me-3"></i>
                    <div>
                      <strong>Hora:</strong>
                      <span className="ms-2">{formatTime(evento.fecha)}</span>
                    </div>
                  </div>

                  <div className="dato-item">
                    <i className="fas fa-map-marker-alt text-primary me-3"></i>
                    <div>
                      <strong>Ubicación:</strong>
                      <span className="ms-2">{evento.ubicacion || 'Por definir'}</span>
                    </div>
                  </div>

                  <div className="dato-item">
                    <i className="fas fa-users text-primary me-3"></i>
                    <div>
                      <strong>Aforo disponible:</strong>
                      <span className="ms-2">
                        {evento.aforo_maximo !== undefined && evento.aforo_actual !== undefined
                          ? evento.aforo_maximo - evento.aforo_actual
                          : 'Consultar disponibilidad'}
                      </span>
                    </div>
                  </div>

                  {evento.precio && (
                    <div className="dato-item">
                      <i className="fas fa-dollar-sign text-primary me-3"></i>
                      <div>
                        <strong>Precio desde:</strong>
                        <span className="ms-2 precio-destacado">Q{evento.precio}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="evento-descripcion mt-4">
                  <h5>Descripción del Evento</h5>
                  <p>{evento.descripcion || 'Descripción no disponible'}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Diagrama del Teatro */}
        <Row>
          <Col>
            <Card className="teatro-card">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">
                  <i className="fas fa-chair me-2"></i>
                  Selecciona tus Asientos (Máximo 10)
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="teatro-container">
                  {/* Escenario */}
                  <div className="escenario">
                    <div className="escenario-label">
                      <i className="fas fa-music me-2"></i>
                      ESCENARIO
                    </div>
                  </div>

                  {/* Separador */}
                  <div className="separador-teatro"></div>

                  {/* Asientos por zona */}
                  <div className="asientos-container">
                    {/* Primera Fila */}
                    <div className="zona-asientos primera-fila">
                      <div className="zona-label">Primera Fila - Q{configuracionTeatro.primeraFila.precio}</div>
                      <div className="asientos-grid">
                        {asientos.filter(a => a.zona === 'primera_fila').map(asiento => (
                          <div
                            key={asiento.id}
                            className={`asiento ${asiento.disponible ? 'disponible' : 'ocupado'} ${asientosSeleccionados.find(s => s.id === asiento.id) ? 'seleccionado' : ''}`}
                            onClick={() => seleccionarAsiento(asiento.id)}
                            title={`${asiento.zonaNombre} - Asiento ${asiento.numero} - Q${asiento.precio}`}
                          >
                            <span className="numero-asiento">{asiento.numero}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Zona Preferencial */}
                    <div className="zona-asientos preferencial">
                      <div className="zona-label">Preferencial - Q{configuracionTeatro.preferencial.precio}</div>
                      <div className="asientos-grid">
                        {asientos.filter(a => a.zona === 'preferencial').map(asiento => (
                          <div
                            key={asiento.id}
                            className={`asiento ${asiento.disponible ? 'disponible' : 'ocupado'} ${asientosSeleccionados.find(s => s.id === asiento.id) ? 'seleccionado' : ''}`}
                            onClick={() => seleccionarAsiento(asiento.id)}
                            title={`${asiento.zonaNombre} - Asiento ${asiento.numero} - Q${asiento.precio}`}
                          >
                            <span className="numero-asiento">{asiento.numero}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Zona General */}
                    <div className="zona-asientos general">
                      <div className="zona-label">General - Q{configuracionTeatro.general.precio}</div>
                      <div className="asientos-grid">
                        {asientos.filter(a => a.zona === 'general').map(asiento => (
                          <div
                            key={asiento.id}
                            className={`asiento ${asiento.disponible ? 'disponible' : 'ocupado'} ${asientosSeleccionados.find(s => s.id === asiento.id) ? 'seleccionado' : ''}`}
                            onClick={() => seleccionarAsiento(asiento.id)}
                            title={`${asiento.zonaNombre} - Asiento ${asiento.numero} - Q${asiento.precio}`}
                          >
                            <span className="numero-asiento">{asiento.numero}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Leyenda */}
                  <div className="leyenda-asientos">
                    <div className="leyenda-item">
                      <div className="asiento leyenda disponible"></div>
                      <span>Disponible</span>
                    </div>
                    <div className="leyenda-item">
                      <div className="asiento leyenda ocupado"></div>
                      <span>Ocupado</span>
                    </div>
                    <div className="leyenda-item">
                      <div className="asiento leyenda seleccionado"></div>
                      <span>Seleccionado</span>
                    </div>
                  </div>
                </div>

                {/* Información de asientos seleccionados */}
                {asientosSeleccionados.length > 0 && (
                  <div className="asientos-seleccionados">
                    <h5>
                      <i className="fas fa-check-circle text-success me-2"></i>
                      Asientos Seleccionados ({asientosSeleccionados.length}/10)
                    </h5>
                    <div className="selected-seats">
                      {asientosSeleccionados.map(asiento => (
                        <Badge key={asiento.id} bg="primary" className="me-2 mb-2">
                          {asiento.zonaNombre} - {asiento.numero} (Q{asiento.precio})
                        </Badge>
                      ))}
                    </div>
                    <div className="total-price">
                      <strong>Total: Q{asientosSeleccionados.reduce((sum, asiento) => sum + asiento.precio, 0)}</strong>
                    </div>
                  </div>
                )}

                {/* Mensajes */}
                {mensaje && <Alert variant="success">{mensaje}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Botón de reserva */}
                <div className="text-center mt-4">
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    variant="primary"
                    size="lg"
                    className="btn-reservar"
                    disabled={asientosSeleccionados.length === 0 || loading}
                  >
                    <i className="fas fa-ticket-alt me-2"></i>
                    {loading ? 'Procesando...' : `Reservar ${asientosSeleccionados.length} Entrada${asientosSeleccionados.length !== 1 ? 's' : ''}`}
            </Button>
                  
                  {asientosSeleccionados.length === 0 && (
                    <p className="text-muted mt-2 mb-0">
                      <i className="fas fa-info-circle me-1"></i>
                      Selecciona al menos un asiento para continuar
                    </p>
                  )}
                </div>
        </Card.Body>
      </Card>
          </Col>
        </Row>
    </Container>
    </div>
  );
};

export default ReservaEvento;