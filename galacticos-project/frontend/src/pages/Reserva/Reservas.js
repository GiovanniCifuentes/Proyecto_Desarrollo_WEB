import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { reservasService } from '../../services/reservasService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './Reservas.css';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reservasService.getAll()
      .then(data => {
        setReservas(Array.isArray(data.reservas) ? data.reservas : []);
      })
      .catch((error) => {
        console.error("Error al cargar reservas:", error);
        setReservas([]);
      })
      .finally(() => setLoading(false));
  }, []);

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

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'confirmada':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'cancelada':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Función para obtener el icono del estado
  const getEstadoIcon = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'confirmada':
        return 'fa-check-circle';
      case 'pendiente':
        return 'fa-clock';
      case 'cancelada':
        return 'fa-times-circle';
      default:
        return 'fa-info-circle';
    }
  };

  if (loading) {
    return (
      <div className="reservas-wrapper">
        <Container className="py-5">
          <div className="text-center">
            <LoadingSpinner message="Cargando tus reservas..." />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="reservas-wrapper">
      <Container className="py-4">
        {/* Header */}
        <div className="reservas-header text-center mb-5">
          <h1 className="reservas-titulo">
            <i className="fas fa-ticket-alt me-3"></i>
            Mis Reservas
          </h1>
          <p className="reservas-subtitulo">
            Gestiona y visualiza todas tus reservas de eventos
          </p>
        </div>

        {/* Estadísticas */}
        <Row className="mb-5 justify-content-center">
          <Col md={4}>
            <div className="stat-card">
              <div className="stat-icon total">
                <i className="fas fa-list"></i>
              </div>
              <div className="stat-info">
                <div className="stat-number">{reservas.length}</div>
                <div className="stat-label">Total Reservas</div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Lista de reservas */}
        {reservas.length === 0 ? (
          <div className="empty-reservas">
            <div className="empty-icon">
              <i className="fas fa-calendar-times"></i>
            </div>
            <h3>No tienes reservas todavía</h3>
            <p>Explora nuestros eventos y realiza tu primera reserva para vivir experiencias únicas.</p>
            <Button variant="primary" size="lg" href="/eventos">
              <i className="fas fa-calendar-alt me-2"></i>
              Explorar Eventos
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {reservas.map((reserva, index) => (
              <Col lg={6} xl={4} key={reserva.id}>
                <Card className={`reserva-card fade-in-up`} style={{ transitionDelay: `${index * 0.1}s` }}>
                  {/* Imagen del evento */}
                  <div className="reserva-imagen">
                    <img 
                      src={reserva.evento?.imagen || '/LogoAzul.png'} 
                      alt={reserva.evento?.nombre || 'Evento'}
                      className="reserva-img"
                    />
                    <div className="reserva-estado">
                      <Badge 
                        bg={getEstadoColor(reserva.estado)}
                        className="estado-badge"
                      >
                        <i className={`fas ${getEstadoIcon(reserva.estado)} me-1`}></i>
                        {reserva.estado || 'Sin estado'}
                      </Badge>
                    </div>
                  </div>

                  <Card.Body className="reserva-body">
                    {/* Información del evento */}
                    <div className="reserva-info">
                      <h5 className="reserva-titulo-evento">
                        {reserva.evento?.nombre || 'Evento no disponible'}
                      </h5>
                      
                      {reserva.evento?.fecha && (
                        <div className="reserva-fecha">
                          <i className="fas fa-calendar-alt me-2"></i>
                          {formatDate(reserva.evento.fecha)}
                        </div>
                      )}
                      
                      {reserva.evento?.fecha && (
                        <div className="reserva-hora">
                          <i className="fas fa-clock me-2"></i>
                          {formatTime(reserva.evento.fecha)}
                        </div>
                      )}
                      
                      {reserva.evento?.ubicacion && (
                        <div className="reserva-ubicacion">
                          <i className="fas fa-map-marker-alt me-2"></i>
                          {reserva.evento.ubicacion}
                        </div>
                      )}
                    </div>

                    {/* Información de la reserva */}
                    <div className="reserva-details">
                      <div className="reserva-cantidad">
                        <i className="fas fa-ticket-alt me-2"></i>
                        <strong>{reserva.cantidad_entradas || 0} Entrada{(reserva.cantidad_entradas || 0) !== 1 ? 's' : ''}</strong>
                      </div>
                      
                      {reserva.evento?.precio && (
                        <div className="reserva-precio">
                          <strong>Q{(reserva.evento.precio * (reserva.cantidad_entradas || 1)).toFixed(2)}</strong>
                        </div>
                      )}
                    </div>

                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Reservas;

