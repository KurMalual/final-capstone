import React from 'react';
import { Container, Row, Col, Button, Navbar, Nav, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <Navbar bg="success" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="#home" className="d-flex align-items-center">
            <span className="me-2">🌾</span>
            Smart Farm Connect
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#contact">Contact</Nav.Link>
            </Nav>
            
            <Nav>
              <Button as={Link} to="/login" variant="outline-light" className="me-2">
                Login
              </Button>
              <Button as={Link} to="/register" variant="light" className="text-success">
                Sign Up
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <section id="home" className="hero-section" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        paddingTop: '80px'
      }}>
        <Container>
          <Row className="text-center">
            <Col>
              <h1 className="display-2 fw-bold mb-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                Smart Farm Connect
              </h1>
              <h2 className="h3 mb-4">
                Empowering South Sudan's Agricultural Future Through Technology
              </h2>
              <p className="lead mb-5">
                Connecting farmers, buyers, transporters, and equipment providers in one unified platform
              </p>
              <Button as={Link} to="/register" size="lg" variant="success" className="me-3 px-5 py-3">
                GET STARTED
              </Button>
              <Button href="#about" size="lg" variant="outline-light" className="px-5 py-3">
                LEARN MORE
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-light">
        <Container>
          <Row className="mb-5">
            <Col>
              <h2 className="display-4 text-dark mb-4">About Smart Farm Connect</h2>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <p className="lead text-muted mb-4">
                Smart Farm Connect is a revolutionary platform designed specifically for 
                South Sudan's agricultural sector. We bridge the gap between farmers, 
                buyers, equipment providers, and transporters, creating a thriving 
                ecosystem that supports food security and economic growth.
              </p>
              <p className="text-muted mb-4">
                Our mission is to modernize agriculture in South Sudan by providing 
                farmers with access to markets, equipment, transportation services, and 
                real-time weather information tailored to local conditions.
              </p>
            </Col>
            <Col lg={6}>
              <img 
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="South Sudan farming landscape"
                className="img-fluid rounded shadow"
                style={{width: '100%', height: '400px', objectFit: 'cover'}}
              />
            </Col>
          </Row>
          
          {/* Stats */}
          <Row className="mt-5 text-center">
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-5">
                  <h3 className="display-4 text-success fw-bold">500+</h3>
                  <p className="text-muted">Registered Farmers</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-5">
                  <h3 className="display-4 text-success fw-bold">200+</h3>
                  <p className="text-muted">Products Listed</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Weather Section */}
      <section className="py-5" style={{background: 'linear-gradient(135deg, #4CAF50, #2196F3)'}}>
        <Container>
          <Row className="text-center text-white mb-5">
            <Col>
              <h2 className="display-4 mb-3">Real-Time Weather for South Sudan</h2>
              <p className="lead">Get accurate weather forecasts tailored for agricultural planning</p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="bg-primary bg-opacity-25 border-0 text-white">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <span style={{fontSize: '3rem'}}>☀️</span>
                  </div>
                  <h4>Juba</h4>
                  <h2 className="display-4 fw-bold">32°C</h2>
                  <p>Perfect for planting season</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="bg-primary bg-opacity-25 border-0 text-white">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <span style={{fontSize: '3rem'}}>🌧️</span>
                  </div>
                  <h4>Wau</h4>
                  <h2 className="display-4 fw-bold">28°C</h2>
                  <p>Good for irrigation</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="bg-primary bg-opacity-25 border-0 text-white">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <span style={{fontSize: '3rem'}}>⛅</span>
                  </div>
                  <h4>Malakal</h4>
                  <h2 className="display-4 fw-bold">30°C</h2>
                  <p>Ideal farming conditions</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col className="text-center">
              <Button variant="success" size="lg" className="px-5 py-3">
                GET DETAILED WEATHER UPDATES
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-4 text-dark mb-3">Why Choose Smart Farm Connect?</h2>
            </Col>
          </Row>
          <Row>
            <Col lg={3} md={6} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <span style={{fontSize: '4rem'}}>🌱</span>
                  </div>
                  <h4 className="mb-3">For Farmers</h4>
                  <p className="text-muted mb-3">
                    Sell your produce directly to buyers, access modern equipment, and get reliable transportation services
                  </p>
                  <ul className="list-unstyled text-start">
                    <li>• Direct market access</li>
                    <li>• Equipment rental</li>
                    <li>• Weather updates</li>
                    <li>• Educational resources</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <span style={{fontSize: '4rem'}}>🛒</span>
                  </div>
                  <h4 className="mb-3">For Buyers</h4>
                  <p className="text-muted mb-3">
                    Purchase fresh, quality produce directly from verified farmers across South Sudan
                  </p>
                  <ul className="list-unstyled text-start">
                    <li>• Fresh produce</li>
                    <li>• Direct from farmers</li>
                    <li>• Quality guaranteed</li>
                    <li>• Competitive prices</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <span style={{fontSize: '4rem'}}>🚚</span>
                  </div>
                  <h4 className="mb-3">For Transporters</h4>
                  <p className="text-muted mb-3">
                    Connect with farmers and buyers who need reliable transportation services
                  </p>
                  <ul className="list-unstyled text-start">
                    <li>• Regular job opportunities</li>
                    <li>• Fair pricing</li>
                    <li>• Route optimization</li>
                    <li>• Secure payments</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <span style={{fontSize: '4rem'}}>🚜</span>
                  </div>
                  <h4 className="mb-3">For Equipment Providers</h4>
                  <p className="text-muted mb-3">
                    Rent out your agricultural equipment to farmers who need modern tools
                  </p>
                  <ul className="list-unstyled text-start">
                    <li>• Equipment rental income</li>
                    <li>• Asset utilization</li>
                    <li>• Maintenance tracking</li>
                    <li>• Insurance coverage</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5">
        <Container>
          <Row className="mb-5">
            <Col>
              <h2 className="display-4 text-dark mb-4">Get In Touch</h2>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <h4 className="mb-4">Contact Information</h4>
              
              <div className="d-flex mb-3">
                <div className="me-3">
                  <span style={{color: '#dc3545', fontSize: '1.5rem'}}>📍</span>
                </div>
                <div>
                  <h6 className="mb-1">Address</h6>
                  <p className="text-muted">Juba, South Sudan</p>
                </div>
              </div>
              
              <div className="d-flex mb-3">
                <div className="me-3">
                  <span style={{color: '#dc3545', fontSize: '1.5rem'}}>📞</span>
                </div>
                <div>
                  <h6 className="mb-1">Phone</h6>
                  <p className="text-muted">+211 123 456 789</p>
                </div>
              </div>
              
              <div className="d-flex mb-3">
                <div className="me-3">
                  <span style={{color: '#dc3545', fontSize: '1.5rem'}}>📧</span>
                </div>
                <div>
                  <h6 className="mb-1">Email</h6>
                  <p className="text-muted">info@smartfarmconnect.ss</p>
                </div>
              </div>
            </Col>
            
            <Col lg={6}>
              <Card className="border-0 shadow">
                <Card.Body className="p-4">
                  <h5 className="mb-4">Send us a Message</h5>
                  <form>
                    <div className="mb-3">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Your Name"
                        style={{border: '1px solid #ddd', borderRadius: '8px', padding: '12px'}}
                      />
                    </div>
                    <div className="mb-3">
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="Your Email"
                        style={{border: '1px solid #ddd', borderRadius: '8px', padding: '12px'}}
                      />
                    </div>
                    <div className="mb-3">
                      <textarea 
                        className="form-control" 
                        rows="5" 
                        placeholder="Your Message"
                        style={{border: '1px solid #ddd', borderRadius: '8px', padding: '12px'}}
                      ></textarea>
                    </div>
                    <Button variant="success" size="lg" className="w-100 py-3">
                      SEND MESSAGE
                    </Button>
                  </form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <Container>
          <Row>
            <Col md={6}>
              <h5>Smart Farm Connect</h5>
              <p>Connecting farmers, buyers, transporters, and equipment providers across South Sudan.</p>
            </Col>
            <Col md={6}>
              <h5>Contact Info</h5>
              <p>📍 Juba, South Sudan</p>
              <p>📞 +211 123 456 789</p>
              <p>📧 info@smartfarmconnect.ss</p>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col className="text-center">
              <p>&copy; 2025 Smart Farm Connect. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
