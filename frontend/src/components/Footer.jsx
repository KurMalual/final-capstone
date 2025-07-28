import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg={3} md={6} className="mb-4">
            <div className="footer-brand">
              <span className="me-2">🌾</span>
              <h5>Smart Farm Connect</h5>
            </div>
            <p>Connecting farmers, buyers, transporters, and equipment providers across South Sudan.</p>
            <div className="social-icons">
              <Button variant="outline-light" size="sm" className="me-2">📘</Button>
              <Button variant="outline-light" size="sm" className="me-2">📷</Button>
              <Button variant="outline-light" size="sm" className="me-2">🐦</Button>
              <Button variant="outline-light" size="sm">📺</Button>
            </div>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li><a href="/#home">Home</a></li>
              <li><a href="/#about">About Us</a></li>
              <li><a href="/#features">Features</a></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Sign Up</Link></li>
            </ul>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <h5>Services</h5>
            <ul className="footer-links">
              <li><Button variant="outline-light" size="sm">Marketplace</Button></li>
              <li><Button variant="outline-light" size="sm">Equipment Rental</Button></li>
              <li><Button variant="outline-light" size="sm">Transportation</Button></li>
              <li><Button variant="outline-light" size="sm">Weather Updates</Button></li>
            </ul>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <h5>Contact Info</h5>
            <div className="footer-contact">
              <p>📍 Juba, South Sudan</p>
              <p>📞 +211 924 828 569</p>
              <p>📧 smartfarmconnect@gmail.com</p>
            </div>
          </Col>
        </Row>
        <Row className="footer-bottom">
          <Col lg={6}>
            <p>&copy; 2025 Smart Farm Connect. All rights reserved.</p>
          </Col>
          <Col lg={6} className="text-end">
            <Button variant="outline-light" size="sm" className="me-2">Privacy Policy</Button>
            <Button variant="outline-light" size="sm">Terms of Service</Button>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
