import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { reservasService } from '../services/reservasService';
import LoadingSpinner from '../components/common/LoadingSpinner';

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

  if (loading) return <LoadingSpinner message="Cargando reservas..." />;

  return (
    <Container>
      <h2 className="mb-4">Mis Reservas</h2>
      <Row>
        {reservas.length === 0 ? (
          <p>No tienes reservas todavía.</p>
        ) : (
          reservas.map((reserva) => (
            <Col md={4} className="mb-4" key={reserva.id}>
              <Card>
                <Card.Body>
                  <Card.Title>{reserva.evento?.nombre}</Card.Title>
{reserva.evento && (
  <Card.Text>
    Cantidad: {reserva.cantidad_entradas} <br />
    Estado: {reserva.estado}
  </Card.Text>
)}
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Reservas;

