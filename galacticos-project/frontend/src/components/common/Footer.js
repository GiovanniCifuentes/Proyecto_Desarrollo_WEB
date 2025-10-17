import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer-galacticos">
      <Container>
        <Row className="footer-main">
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <div className="footer-brand-section">
              <div className="footer-logo-container mb-3">
                <img 
                  src="/LogoBlanco.png" 
                  alt="Galácticos S.A." 
                  className="footer-logo"
                />
              </div>
              <p className="footer-description">
                Tu plataforma de confianza para descubrir y reservar los mejores eventos. 
                Experiencias únicas a tu alcance.
              </p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link"><i className="fab fa-facebook-f"></i></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link"><i className="fab fa-twitter"></i></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link"><i className="fab fa-instagram"></i></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h5 className="footer-title">Empresa</h5>
            <ul className="footer-links">
              <li><a href="/sobre-nosotros">Sobre Nosotros</a></li>
              <li><a href="/contacto">Contacto</a></li>
              <li><a href="/trabajos">Trabaja con Nosotros</a></li>
              <li><a href="/prensa">Prensa</a></li>
            </ul>
          </Col>
          
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h5 className="footer-title">Soporte</h5>
            <ul className="footer-links">
              <li><a href="/ayuda">Centro de Ayuda</a></li>
              <li><a href="/terminos">Términos de Uso</a></li>
              <li><a href="/privacidad">Privacidad</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </Col>
          
          <Col lg={4} md={6}>
            <h5 className="footer-title">Información de Contacto</h5>
            <div className="footer-contact">
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>info@galacticos.com</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+502 1234-5678</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Guatemala City, GT</span>
              </div>
            </div>
          </Col>
        </Row>
        
        <div className="footer-bottom">
          <p className="mb-0">
            © {new Date().getFullYear()} Galácticos S.A. Todos los derechos reservados.
          </p>
          <div className="footer-payment">
            <i className="fab fa-cc-visa"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-paypal"></i>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
