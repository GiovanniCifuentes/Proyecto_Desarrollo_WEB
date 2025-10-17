import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { eventosService } from '../../services/eventosService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './EventoDetalle.css';

const EventoDetalle = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  // Removido: no necesitamos selección de zona en EventoDetalle

  useEffect(() => {
    const fetchEvento = async () => {
      try {
    const data = await eventosService.getById(id);
        setEvento(data.evento);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
    };

    fetchEvento();
  }, [id]);

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
      asientosTotales: Math.floor((evento?.aforo_maximo || 200) * 0.1), // 10% del aforo
      precio: evento?.precio ? Math.round(evento.precio * 1.5) : 150,
      descripcion: 'Primera fila con vista premium'
    },
    preferencial: {
      id: 'preferencial',
      nombre: 'Preferencial',
      tipo: 'preferencial',
      asientosTotales: Math.floor((evento?.aforo_maximo || 200) * 0.3), // 30% del aforo
      precio: evento?.precio ? Math.round(evento.precio * 1.2) : 120,
      descripcion: 'Zona preferencial con excelente vista'
    },
    general: {
      id: 'general',
      nombre: 'General',
      tipo: 'general',
      asientosTotales: Math.floor((evento?.aforo_maximo || 200) * 0.6), // 60% del aforo
      precio: evento?.precio || 80,
      descripcion: 'Zona general con vista completa'
    }
  };

  // Función para generar vista de disponibilidad
  const generarVistaDisponibilidad = () => {
    const aforoMaximo = evento?.aforo_maximo || 200;
    const aforoActual = evento?.aforo_actual || 0;
    const asientosVendidos = Math.min(aforoActual, aforoMaximo);
    
    let contadorVendidos = 0;
    const zonas = [];

    Object.values(configuracionTeatro).forEach(zona => {
      if (zona.asientosTotales > 0) {
        // Calcular cuántos asientos vendidos van en esta zona (en orden)
        const asientosVendidosEnZona = Math.min(
          Math.floor((asientosVendidos - contadorVendidos) * (zona.asientosTotales / (aforoMaximo - configuracionTeatro.escenario.asientosTotales))),
          zona.asientosTotales
        );
        
        const asientosDisponiblesEnZona = zona.asientosTotales - asientosVendidosEnZona;
        
        zonas.push({
          ...zona,
          asientosVendidos: asientosVendidosEnZona,
          asientosDisponibles: asientosDisponiblesEnZona,
          porcentajeOcupado: Math.round((asientosVendidosEnZona / zona.asientosTotales) * 100)
        });
        
        contadorVendidos += asientosVendidosEnZona;
      }
    });

    return zonas;
  };

  const zonasDisponibilidad = generarVistaDisponibilidad();

  // Removido: no necesitamos selección de zona en EventoDetalle

  if (loading) {
    return (
      <div className="evento-detalle-wrapper">
        <div className="evento-detalle">
          <Container>
            <div className="text-center py-5">
              <LoadingSpinner message="Cargando evento..." />
            </div>
          </Container>
        </div>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="evento-detalle-wrapper">
        <div className="evento-detalle">
          <Container>
            <div className="text-center py-5">
              <h3>Evento no encontrado</h3>
              <p>El evento que buscas no existe o ha sido eliminado.</p>
              <Button as={Link} to="/eventos" variant="primary">
                Volver a Eventos
              </Button>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="evento-detalle-wrapper">
      <div className="evento-detalle">
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
        <Row className="g-4">
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
                      <i className="fas  text-primary me-3"></i>
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

        {/* Vista de Disponibilidad del Teatro */}
        <Row className="mt-5">
          <Col>
            <Card className="teatro-card">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">
                  <i className="fas fa-chart-bar me-2"></i>
                  Estado de Disponibilidad
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

                  {/* Estadísticas generales */}
                  <div className="estadisticas-generales">
                    <div className="stat-card">
                      <div className="stat-number">{evento?.aforo_maximo || 200}</div>
                      <div className="stat-label">Aforo Total</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{evento?.aforo_actual || 0}</div>
                      <div className="stat-label">Vendidos</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{(evento?.aforo_maximo || 200) - (evento?.aforo_actual || 0)}</div>
                      <div className="stat-label">Disponibles</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{Math.round(((evento?.aforo_actual || 0) / (evento?.aforo_maximo || 200)) * 100)}%</div>
                      <div className="stat-label">Ocupación</div>
                    </div>
                  </div>

                  {/* Zonas de disponibilidad */}
                  <div className="zonas-disponibilidad">
                    {zonasDisponibilidad.map(zona => (
                      <div 
                        key={zona.id}
                        className={`zona-disponibilidad ${zona.asientosDisponibles > 0 ? 'disponible' : 'agotada'}`}
                      >
                        <div className="zona-header">
                          <h5 className="zona-nombre">{zona.nombre}</h5>
                          <div className="zona-precio">Q{zona.precio}</div>
                        </div>
                        
                        <div className="zona-stats">
                          <div className="stat-item">
                            <span className="stat-value">{zona.asientosTotales}</span>
                            <span className="stat-label">Total</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-value vendidos">{zona.asientosVendidos}</span>
                            <span className="stat-label">Vendidos</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-value disponibles">{zona.asientosDisponibles}</span>
                            <span className="stat-label">Disponibles</span>
                          </div>
                        </div>

                        {/* Barra de progreso */}
                        <div className="progreso-ocupacion">
                          <div className="progreso-barra">
                            <div 
                              className="progreso-llenado" 
                              style={{ width: `${zona.porcentajeOcupado}%` }}
                            ></div>
                          </div>
                          <span className="progreso-texto">{zona.porcentajeOcupado}% ocupado</span>
                        </div>

                        {/* Estado de la zona */}
                        <div className="zona-estado">
                          {zona.asientosDisponibles === 0 ? (
                            <span className="estado-agotado">
                              <i className="fas fa-times-circle me-1"></i>
                              Agotado
                            </span>
                          ) : zona.asientosDisponibles <= 5 ? (
                            <span className="estado-pocos">
                              <i className="fas fa-exclamation-triangle me-1"></i>
                              Pocos disponibles
                            </span>
                          ) : (
                            <span className="estado-disponible">
                              <i className="fas fa-check-circle me-1"></i>
                              Disponible
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Botón para ver asientos */}
                  <div className="text-center mt-4">
          <Button
            as={Link}
            to={`/eventos/${evento.id}/reservar`}
                      variant="primary"
                      size="lg"
                      className="btn-reservar"
          >
                      <i className="fas fa-chair me-2"></i>
                      Ver Asientos Disponibles
                      <i className="fas fa-arrow-right ms-2"></i>
          </Button>
                    
                    <p className="text-muted mt-2 mb-0">
                      <i className="fas fa-info-circle me-1"></i>
                      Selecciona tus asientos preferidos en el siguiente paso
                    </p>
                  </div>
                </div>
        </Card.Body>
      </Card>
          </Col>
        </Row>
    </Container>
      </div>
    </div>
  );
};

export default EventoDetalle;

