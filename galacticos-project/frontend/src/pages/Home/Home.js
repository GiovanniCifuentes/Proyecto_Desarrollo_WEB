import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventosService } from '../../services/eventosService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './Home.css';

const Home = () => {
  const { isAuthenticated, usuario } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('todos');

  useEffect(() => {
    // Cargar eventos
    eventosService.listar()
      .then(response => {
        setEventos(response.data.eventos || []);
      })
      .catch(() => setEventos([]))
      .finally(() => setLoadingEventos(false));

    // Observer para animaciones al hacer scroll
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

    setTimeout(() => {
      document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  const formatDate = (dateString) => {
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
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Función para filtrar eventos por tipo y limitar a 3
  const eventosFiltrados = eventos.filter(evento => {
    if (filtroTipo === 'todos') return true;
    return evento.tipo === filtroTipo;
  }).slice(0, 3); // Limitar a solo 3 eventos

  // Función para obtener tipos únicos de eventos
  const tiposEventos = ['todos', ...new Set(eventos.map(evento => evento.tipo))];

  // Función para obtener el icono según el tipo de evento
  const getTipoIcon = (tipo) => {
    const iconos = {
      'todos': 'fa-list',
      'concierto': 'fa-music',
      'teatro': 'fa-theater-masks',
      'deporte': 'fa-futbol',
      'comedia': 'fa-laugh',
      'otro': 'fa-calendar'
    };
    return iconos[tipo] || 'fa-calendar';
  };

  // Función para obtener la etiqueta según el tipo de evento
  const getTipoLabel = (tipo) => {
    const etiquetas = {
      'todos': 'Todos',
      'concierto': 'Conciertos',
      'teatro': 'Teatro',
      'deporte': 'Deportes',
      'comedia': 'Comedia',
      'otro': 'Otros'
    };
    return etiquetas[tipo] || tipo.charAt(0).toUpperCase() + tipo.slice(1);
  };

  return (
    <div className="home-wrapper">
      <Container fluid className="content-container p-0">
        
        {/* Hero Section con diseño mejorado */}
        <section className="hero-section-new">
          <div className="hero-overlay"></div>
          <Container className="hero-content">
            <Row className="justify-content-center text-center">
              <Col lg={10} xl={8}>
                {/* Logo de Galácticos */}
                <div className="hero-logo-container fade-in-up mb-4">
                  <img 
                    src="/LogoBlanco.png" 
                    alt="Galácticos S.A." 
                    className="hero-logo-main"
                  />
                </div>
                
                <div className="hero-badge fade-in-up mb-3">
                  <i className="fas fa-star me-2"></i>
                  Plataforma #1 en Gestión de Eventos
                </div>
                
                <h1 className="hero-title-new fade-in-up mb-4">
                  Descubre y Reserva los
                  <span className="title-highlight"> Mejores Eventos</span>
                </h1>
                
                <p className="hero-subtitle-new fade-in-up mb-5">
                  Accede a experiencias únicas, compra tus entradas de forma segura 
                  y recibe tu código QR al instante. Todo en un solo lugar.
                </p>
                
                {isAuthenticated ? (
                  <>
                    <div className="welcome-message fade-in-up mb-4">
                      <i className="fas fa-user-circle me-2"></i>
                      ¡Hola, {usuario.nombre}! Explora nuestros eventos
                    </div>
                    <div className="hero-buttons fade-in-up">
                      <Button as={Link} to="/eventos" variant="primary" size="lg" className="hero-btn hero-btn-primary">
                        <i className="fas fa-calendar-alt me-2"></i>
                        Explorar Eventos
                      </Button>
                      <Button as={Link} to="/reservas" variant="outline-light" size="lg" className="hero-btn hero-btn-secondary">
                        <i className="fas fa-ticket-alt me-2"></i>
                        Mis Reservas
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="hero-buttons fade-in-up">
                    <Button as={Link} to="/registro" variant="primary" size="lg" className="hero-btn hero-btn-primary">
                      <i className="fas fa-rocket me-2"></i>
                      Comenzar Ahora
                    </Button>
                    <Button as={Link} to="/login" variant="outline-light" size="lg" className="hero-btn hero-btn-secondary">
                      Iniciar Sesión
                    </Button>
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </section>

        {/* Features Section - Solo 3 características principales */}
        <section className="features-section-new">
          <Container>
            <div className="section-header text-center mb-5">
              <h2 className="section-title-new fade-in-up">
                ¿Por qué elegir Galácticos?
              </h2>
              <p className="section-subtitle fade-in-up">
                La forma más simple y segura de reservar tus eventos favoritos
              </p>
            </div>

            <Row className="g-4 justify-content-center">
              <Col lg={4} md={6} className="fade-in-up" style={{ transitionDelay: '0.1s' }}>
                <div className="feature-card-new">
                  <div className="feature-icon-new primary-gradient">
                    <i className="fas fa-bolt"></i>
                  </div>
                  <h3 className="feature-title-new">Reserva Instantánea</h3>
                  <p className="feature-text-new">
                    Compra tus entradas en segundos con nuestro sistema optimizado. 
                    Sin complicaciones, sin esperas.
                  </p>
                  <div className="feature-badge">
                    <i className="fas fa-check-circle me-1"></i>
                    Proceso Simplificado
                  </div>
                </div>
              </Col>

              <Col lg={4} md={6} className="fade-in-up" style={{ transitionDelay: '0.2s' }}>
                <div className="feature-card-new">
                  <div className="feature-icon-new success-gradient">
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  <h3 className="feature-title-new">Entradas Digitales</h3>
                  <p className="feature-text-new">
                    Recibe tu código QR al instante por email. Accede a tus eventos 
                    desde cualquier dispositivo móvil.
                  </p>
                  <div className="feature-badge">
                    <i className="fas fa-check-circle me-1"></i>
                    100% Digital
                  </div>
                </div>
              </Col>

              <Col lg={4} md={6} className="fade-in-up" style={{ transitionDelay: '0.3s' }}>
                <div className="feature-card-new">
                  <div className="feature-icon-new warning-gradient">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h3 className="feature-title-new">Seguridad Garantizada</h3>
                  <p className="feature-text-new">
                    Protección de datos con autenticación JWT. Tus pagos y 
                    datos personales siempre protegidos.
                  </p>
                  <div className="feature-badge">
                    <i className="fas fa-check-circle me-1"></i>
                    Certificado SSL
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Eventos Section con Grid Moderno */}
        <section className="eventos-section">
          <Container>
            <div className="section-header text-center mb-5">
              <h2 className="section-title-new fade-in-up">
                <i className="fas fa-calendar-alt me-3"></i>
                Próximos Eventos
              </h2>
              <p className="section-subtitle fade-in-up">
                Descubre y reserva los mejores eventos disponibles
              </p>
              
              {/* Filtro por tipo de evento */}
              <div className="eventos-filter fade-in-up">
                <div className="filter-buttons">
                  {tiposEventos.map(tipo => (
                    <Button
                      key={tipo}
                      variant={filtroTipo === tipo ? "primary" : "outline-primary"}
                      size="sm"
                      className="filter-btn"
                      onClick={() => setFiltroTipo(tipo)}
                    >
                      <i className={`fas ${getTipoIcon(tipo)} me-2`}></i>
                      {getTipoLabel(tipo)}
                    </Button>
                  ))}
                </div>
                <div className="filter-info mt-3">
                  <small className="text-muted">
                    Mostrando {eventosFiltrados.length} de {eventos.length} eventos
                  </small>
                </div>
              </div>
            </div>
            
            {loadingEventos ? (
              <div className="text-center py-5">
                <LoadingSpinner message="Cargando eventos..." />
              </div>
            ) : eventos.length > 0 ? (
              <div className="eventos-lista">
                {eventosFiltrados.map((evento, index) => (
                  <div key={evento.id} className="evento-card fade-in-up" style={{ transitionDelay: `${index * 0.1}s` }}>
                    <div className="evento-imagen">
                      <img 
                        src={evento.imagen || '/LogoAzul.png'} 
                        alt={evento.nombre}
                        className="evento-img"
                      />
                    </div>
                    
                    <div className="evento-info">
                      <div className="evento-fecha">
                        <i className="fas fa-calendar-alt"></i>
                        <span>{formatDate(evento.fecha).day} {formatDate(evento.fecha).month} {formatDate(evento.fecha).year}</span>
                      </div>
                      
                      <div className="evento-details">
                        <h3 className="evento-nombre">{evento.nombre}</h3>
                        <div className="evento-hora">
                          <i className="fas fa-clock me-2"></i>
                          {formatTime(evento.fecha)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="evento-accion">
                      <Button as={Link} to={`/eventos/${evento.id}`} variant="primary" className="btn-ver-evento">
                        <i className="fas fa-eye me-2"></i>
                        Ver Evento
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="fas fa-calendar-times"></i>
                </div>
                <h3>
                  {eventos.length === 0 
                    ? 'No hay eventos disponibles' 
                    : `No hay eventos de tipo "${getTipoLabel(filtroTipo)}"`
                  }
                </h3>
                <p>
                  {eventos.length === 0 
                    ? 'Estamos preparando increíbles experiencias para ti. ¡Vuelve pronto!'
                    : 'Prueba con otro tipo de evento o selecciona "Todos" para ver todos los eventos disponibles.'
                  }
                </p>
                {eventos.length > 0 && (
                  <Button 
                    variant="primary" 
                    onClick={() => setFiltroTipo('todos')}
                    className="mt-3"
                  >
                    <i className="fas fa-list me-2"></i>
                    Ver Todos los Eventos
                  </Button>
                )}
              </div>
            )}

            {/* Botón para ver todos los eventos */}
            <div className="text-center mt-5 fade-in-up">
              <Button as={Link} to="/eventos" variant="primary" size="lg" className="btn-ver-todos">
                <i className="fas fa-calendar-alt me-2"></i>
                Ver Todos los Eventos
                <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            </div>
          </Container>
        </section>

        {/* Trust Section */}
        <section className="trust-section">
          <Container>
            <Row className="align-items-center">
              <Col lg={6} className="fade-in-up">
                <h2 className="trust-title mb-4">
                  Confianza y Calidad en Cada Evento
                </h2>
                <p className="trust-text mb-4">
                  Galácticos S.A. se dedica a ofrecer las mejores experiencias en eventos. 
                  Nuestra plataforma garantiza transparencia y calidad en cada reserva.
                </p>
                <div className="trust-features">
                  <div className="trust-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Eventos verificados y de calidad</span>
                  </div>
                  <div className="trust-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Mejores Precios</span>
                  </div>
                  <div className="trust-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Atención personalizada</span>
                  </div>
                </div>
              </Col>
              <Col lg={6} className="fade-in-up">
                <div className="trust-logos">
                  <div className="trust-badge">
                    <i className="fas fa-shield-alt"></i>
                    <span>Protección SSL</span>
                  </div>
                  <div className="trust-badge">
                    <i className="fas fa-qrcode"></i>
                    <span>Códigos QR</span>
                  </div>
                  <div className="trust-badge">
                    <i className="fas fa-certificate"></i>
                    <span>Plataforma Certificada</span>
                  </div>
                  <div className="trust-badge">
                    <i className="fas fa-star"></i>
                    <span>Mejores Experiencias</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

      </Container>
    </div>
  );
};

export default Home;