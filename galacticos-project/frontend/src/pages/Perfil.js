import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Perfil = () => {
  const { usuario } = useAuth();

  return (
    <Container>
      <h2 className="mb-4">Mi Perfil</h2>
      <Card>
        <Card.Body>
          <p><strong>Nombre:</strong> {usuario?.nombre}</p>
          <p><strong>Email:</strong> {usuario?.email}</p>
          <p><strong>Rol:</strong> {usuario?.rol}</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Perfil;
