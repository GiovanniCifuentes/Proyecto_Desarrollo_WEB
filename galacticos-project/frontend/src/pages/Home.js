import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, usuario } = useAuth();

  return (
    <Container>
      {/* Hero Section */}
      <Row className="py-5 mb-4 bg-light rounded">
        <Col lg={8} className="mx-auto text-center">
          <h1 className="display-4 fw-bold text-dark mb-4">
            Bienvenido a Galacticos S.A.
          </h1>
          <p className="lead mb-4">
            Descubre los mejores eventos y reserva tu lugar de forma rápida y segura. 
            Desde conciertos hasta conferencias, tenemos todo lo que necesitas.
          </p>
          {isAuthenticated ? (
            <div>
              <p className="h5 mb-3">¡Hola, {usuario.nombre}! ¿Qué te gustaría hacer?</p>
              <Button as={Link} to="/eventos" variant="primary" size="lg" className="me-3">
                Explorar Eventos
              </Button>
              <Button as={Link} to="/reservas" variant="outline-primary" size="lg">
                Ver Mis Reservas
              </Button>
            </div>
          ) : (
            <div>
              <Button as={Link} to="/registro" variant="primary" size="lg" className="me-3">
                Comenzar Ahora
              </Button>
              <Button as={Link} to="/login" variant="outline-primary" size="lg">
                Iniciar Sesión
              </Button>
            </div>
          )}
        </Col>
      </Row>

      {/* Features Section */}
      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="text-primary mb-3">
                <i className="fas fa-calendar-check fa-3x"></i>
              </div>
              <Card.Title>Reserva Fácil</Card.Title>
              <Card.Text>
                Reserva tus entradas en pocos clics. Sistema intuitivo y rápido.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="text-success mb-3">
                <i className="fas fa-qrcode fa-3x"></i>
              </div>
              <Card.Title>Entradas Digitales</Card.Title>
              <Card.Text>
                Recibe tu entrada con QR por email. Fácil y ecológico.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <div className="text-warning mb-3">
                <i className="fas fa-shield-alt fa-3x"></i>
              </div>
              <Card.Title>100% Seguro</Card.Title>
              <Card.Text>
                Sistema seguro con autenticación JWT y control de aforo en tiempo real.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Stats Section */}
      {isAuthenticated && (
        <Row>
          <Col>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <h3>¿Listo para tu próximo evento?</h3>
                <p className="mb-0">
                  Explora nuestra amplia variedad de eventos y vive experiencias únicas.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Home;