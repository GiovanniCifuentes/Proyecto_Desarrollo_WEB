import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import { eventosService } from '../services/eventosService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EventoDetalle = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
    const data = await eventosService.getById(id);
    setEvento(data.evento); // <-- SOLO el objeto evento
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
    };

    fetchEvento();
  }, [id]);

  if (loading) return <LoadingSpinner message="Cargando evento..." />;
  if (!evento) return <p>Evento no encontrado</p>;

  return (
    <Container>
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>{evento.titulo}</Card.Title>
          <Card.Text>{evento.descripcion}</Card.Text>
          <p>
            Aforo disponible:{' '}
            {evento.aforo_maximo !== undefined && evento.aforo_actual !== undefined
              ? evento.aforo_maximo - evento.aforo_actual
              : 'No disponible'}
          </p>

          <Button
            as={Link}
            to={`/eventos/${evento.id}/reservar`}
            variant="success"
          >
            Reservar Entradas
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EventoDetalle;

