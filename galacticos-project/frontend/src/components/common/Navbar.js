import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CustomNavbar = () => {
  const { usuario, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="fas fa-rocket me-2"></i>
          Galacticos S.A.
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/eventos">
              <i className="fas fa-calendar-alt me-1"></i>
              Eventos
            </Nav.Link>
            
            {usuario && (
              <Nav.Link as={Link} to="/reservas">
                <i className="fas fa-ticket-alt me-1"></i>
                Mis Reservas
              </Nav.Link>
            )}
            
            {isAdmin && (
              <NavDropdown title="Administración" id="admin-nav-dropdown">
                <NavDropdown.Item as={Link} to="/admin/eventos">
                  Gestionar Eventos
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/colas">
                  Monitoreo de Colas
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
          
          <Nav>
            {usuario ? (
              <NavDropdown 
                title={`Hola, ${usuario.nombre}`} 
                id="user-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/perfil">
                  <i className="fas fa-user me-2"></i>
                  Mi Perfil
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Iniciar Sesión
                </Nav.Link>
                <Nav.Link as={Link} to="/registro">
                  <i className="fas fa-user-plus me-1"></i>
                  Registrarse
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;