import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ message = "Cargando..." }) => {
  return (
    <div className="loading-spinner">
      <div className="text-center">
        <Spinner animation="border" role="status" variant="primary" className="mb-3">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="text-muted">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;