import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reservasService } from '../services/reservasService';
import { Button, Form, Alert, Container, Card } from 'react-bootstrap';

const ReservaEvento = () => {
  const { id: eventoId } = useParams();
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMensaje('');
  setError('');
  setLoading(true);

  try {
    const response = await reservasService.create({
      evento_id: Number(eventoId), // <-- convierte a número aquí
      cantidad_entradas: cantidad
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

  return (
    <Container className="py-5">
      <Card>
        <Card.Body>
          <h2 className="mb-4">Reservar Entradas</h2>
          {mensaje && <Alert variant="success">{mensaje}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad de entradas</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={cantidad}
                onChange={e => setCantidad(Number(e.target.value))}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Reservando...' : 'Reservar'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReservaEvento;