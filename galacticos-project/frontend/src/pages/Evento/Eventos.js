import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Container, Button, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { eventosService } from '../../services/eventosService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './Eventos.css';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [ordenamiento, setOrdenamiento] = useState('fecha');

  // Función para cargar eventos
  const cargarEventos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventosService.listar();
      setEventos(response.data.eventos || []);
    } catch (err) {
      console.error('Error al cargar eventos:', err);
      setError('Error al cargar los eventos. Por favor, intenta de nuevo.');
      setEventos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarEventos();
  }, [cargarEventos]);

  // Observer para animaciones al hacer scroll
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const timeoutId = setTimeout(() => {
      document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
      });
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [eventos]);

  // Funciones de formateo
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const months = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    return {
      day: date.getDate(),
      month: months[date.getMonth()],
      year: date.getFullYear()
    };
  }, []);

  const formatTime = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }, []);


  // Funciones de filtrado y ordenamiento
  const eventosFiltrados = useCallback(() => {
    return eventos.filter(evento => {
      if (filtroTipo === 'todos') return true;
      return evento.tipo === filtroTipo;
    });
  }, [eventos, filtroTipo]);

  const eventosOrdenados = useCallback(() => {
    const filtrados = eventosFiltrados();
    return [...filtrados].sort((a, b) => {
      if (ordenamiento === 'fecha') {
        return new Date(a.fecha) - new Date(b.fecha);
      } else if (ordenamiento === 'nombre') {
        return a.nombre.localeCompare(b.nombre);
      } else if (ordenamiento === 'precio') {
        return (a.precio || 0) - (b.precio || 0);
      }
      return 0;
    });
  }, [eventosFiltrados, ordenamiento]);

  // Función para obtener tipos únicos de eventos
  const tiposEventos = useMemo(() => {
    return ['todos', ...new Set(eventos.map(evento => evento.tipo))];
  }, [eventos]);

  // Funciones de utilidad
  const getTipoIcon = useCallback((tipo) => {
    const iconos = {
      'todos': 'fa-list',
      'concierto': 'fa-music',
      'teatro': 'fa-theater-masks',
      'deporte': 'fa-futbol',
      'comedia': 'fa-laugh',
      'otro': 'fa-calendar'
    };
    return iconos[tipo] || 'fa-calendar';
  }, []);

  const getTipoLabel = useCallback((tipo) => {
    const etiquetas = {
      'todos': 'Todos',
      'concierto': 'Conciertos',
      'teatro': 'Teatro',
      'deporte': 'Deportes',
      'comedia': 'Comedia',
      'otro': 'Otros'
    };
    return etiquetas[tipo] || tipo.charAt(0).toUpperCase() + tipo.slice(1);
  }, []);

  const getTipoColor = useCallback((tipo) => {
    const colores = {
      'concierto': 'primary',
      'teatro': 'success',
      'deporte': 'warning',
      'comedia': 'info',
      'otro': 'secondary'
    };
    return colores[tipo] || 'secondary';
  }, []);

  // Estados de carga y error
  if (loading) {
    return (
      <div className="eventos-page-wrapper">
        <Container>
          <div className="text-center py-5">
            <LoadingSpinner message="Cargando eventos..." />
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="eventos-page-wrapper">
        <Container>
          <div className="text-center py-5">
            <div className="error-state">
              <i className="fas fa-exclamation-triangle text-warning mb-3" style={{ fontSize: '3rem' }}></i>
              <h3 className="text-white mb-3">Error al cargar eventos</h3>
              <p className="text-white-50 mb-4">{error}</p>
              <Button variant="primary" onClick={cargarEventos}>
                <i className="fas fa-refresh me-2"></i>
                Intentar de nuevo
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const eventosLista = eventosOrdenados();

  return (
    <div className="eventos-page-wrapper">
      {/* Header */}
      <div className="eventos-header">
        <Container>
          <div className="text-center py-5">
            <h1 className="display-4 fw-bold text-white mb-3">
              <i className="fas fa-calendar-alt me-3 text-primary"></i>
              Eventos
            </h1>
            <p className="lead text-white-50">
              Descubre los mejores eventos y experiencias
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-4">
        {/* Filtros y ordenamiento */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body className="p-4">
            <Row className="g-3">
              <Col md={6}>
                <h6 className="text-muted mb-3">
                  <i className="fas fa-filter me-2"></i>
                  Filtrar por categoría
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {tiposEventos.map(tipo => (
                    <Button
                      key={tipo}
                      variant={filtroTipo === tipo ? "primary" : "outline-primary"}
                      size="sm"
                      onClick={() => setFiltroTipo(tipo)}
                      className="rounded-pill"
                    >
                      <i className={`fas ${getTipoIcon(tipo)} me-1`}></i>
                      {getTipoLabel(tipo)}
                    </Button>
                  ))}
                </div>
              </Col>
              <Col md={6}>
                <h6 className="text-muted mb-3">
                  <i className="fas fa-sort me-2"></i>
                  Ordenar por
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    variant={ordenamiento === 'fecha' ? "primary" : "outline-primary"}
                    size="sm"
                    onClick={() => setOrdenamiento('fecha')}
                    className="rounded-pill"
                  >
                    <i className="fas fa-calendar me-1"></i>
                    Fecha
                  </Button>
                  <Button
                    variant={ordenamiento === 'nombre' ? "primary" : "outline-primary"}
                    size="sm"
                    onClick={() => setOrdenamiento('nombre')}
                    className="rounded-pill"
                  >
                    <i className="fas fa-sort-alpha-down me-1"></i>
                    Nombre
                  </Button>
                  <Button
                    variant={ordenamiento === 'precio' ? "primary" : "outline-primary"}
                    size="sm"
                    onClick={() => setOrdenamiento('precio')}
                    className="rounded-pill"
                  >
                    <i className="fas fa-dollar-sign me-1"></i>
                    Precio
                  </Button>
                </div>
              </Col>
            </Row>
            
            {/* Contador de resultados */}
            <div className="text-center mt-3 pt-3 border-top">
              <Badge bg="info" className="fs-6 px-3 py-2">
                <i className="fas fa-ticket-alt me-2"></i>
                Mostrando {eventosLista.length} de {eventos.length} eventos
              </Badge>
            </div>
          </Card.Body>
        </Card>

        {/* Lista de eventos */}
        {eventosLista.length > 0 ? (
          <Row className="g-4">
            {eventosLista.map((evento, index) => (
              <Col key={evento.id} lg={6} xl={4}>
                <Card className="h-100 border-0 shadow-sm fade-in-up" 
                      style={{ transitionDelay: `${index * 0.1}s` }}>
                  <div className="position-relative">
                    <Card.Img 
                      variant="top" 
                      src={evento.imagen || '/LogoAzul.png'} 
                      alt={evento.nombre}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <Badge 
                      bg={getTipoColor(evento.tipo)} 
                      className="position-absolute top-0 end-0 m-3"
                    >
                      <i className={`fas ${getTipoIcon(evento.tipo)} me-1`}></i>
                      {getTipoLabel(evento.tipo)}
                    </Badge>
                  </div>
                  
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex align-items-start mb-3">
                      <div className="text-center me-3">
                        <div className="bg-primary text-white rounded-3 p-2" style={{ minWidth: '60px' }}>
                          <div className="fw-bold fs-4">{formatDate(evento.fecha).day}</div>
                          <div className="small">{formatDate(evento.fecha).month}</div>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <Card.Title className="h5 mb-2">{evento.nombre}</Card.Title>
                        <div className="text-muted small mb-2">
                          <i className="fas fa-clock me-1"></i>
                          {formatTime(evento.fecha)}
                        </div>
                        {evento.ubicacion && (
                          <div className="text-muted small">
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {evento.ubicacion}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Card.Text className="text-muted small mb-3 flex-grow-1">
                      {evento.descripcion 
                        ? evento.descripcion.substring(0, 120) + (evento.descripcion.length > 120 ? '...' : '')
                        : 'No hay descripción disponible'}
                    </Card.Text>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      {evento.precio && (
                        <div className="text-end">
                          <div className="small text-muted">Desde</div>
                          <div className="fw-bold text-primary fs-5">Q{evento.precio}</div>
                        </div>
                      )}
                      <Button 
                        as={Link} 
                        to={`/eventos/${evento.id}`} 
                        variant="primary" 
                        size="sm"
                        className="ms-auto"
                      >
                        <i className="fas fa-ticket-alt me-1"></i>
                        Ver detalles
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-5">
              <i className="fas fa-calendar-times text-muted mb-3" style={{ fontSize: '4rem' }}></i>
              <h4 className="text-muted mb-3">
                {eventos.length === 0 
                  ? 'No hay eventos disponibles' 
                  : `No hay eventos de tipo "${getTipoLabel(filtroTipo)}"`
                }
              </h4>
              <p className="text-muted mb-4">
                {eventos.length === 0 
                  ? 'Estamos preparando increíbles experiencias para ti. ¡Vuelve pronto!'
                  : 'Prueba con otro tipo de evento o selecciona "Todos" para ver todos los eventos disponibles.'
                }
              </p>
              {eventos.length > 0 && (
                <Button 
                  variant="primary" 
                  onClick={() => setFiltroTipo('todos')}
                >
                  <i className="fas fa-list me-2"></i>
                  Ver Todos los Eventos
                </Button>
              )}
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default Eventos;