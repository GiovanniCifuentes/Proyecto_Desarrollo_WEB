import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { eventosService } from '../services/eventosService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventosService.listar()
      .then(response => {
        setEventos(response.data.eventos); // Asegúrate de acceder al array
      })
      .catch(() => setEventos([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Cargando eventos..." />;

  return (
    <Container>
      <h2 className="mb-4">Eventos</h2>
      <Row>
        {Array.isArray(eventos) && eventos.map((evento) => (
          <Col md={4} className="mb-4" key={evento.id}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{evento.nombre}</Card.Title>
                <Card.Text>{evento.descripcion}</Card.Text>
                <Button as={Link} to={`/eventos/${evento.id}`} variant="primary">
                  Ver Detalle
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Eventos;
