import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container className="text-center py-5">
      <h1>404</h1>
      <h3>Página no encontrada</h3>
      <p>
        <Link to="/">Volver al inicio</Link>
      </p>
    </Container>
  );
};

export default NotFound;
