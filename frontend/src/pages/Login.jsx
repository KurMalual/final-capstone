import React, { useState } from 'react';
import { Card, Form, Button, Alert, Container, Row, Col, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/Footer';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navigation */}
      <Navbar bg="success" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <span className="me-2">🌾</span>
            Smart Farm Connect
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container fluid className="login-page flex-grow-1">
        <Row className="justify-content-center align-items-center min-vh-100 position-relative">
          <Col md={8} lg={6} xl={5}>
            <Card className="login-card fade-in">
              {/* Header with gradient */}
              <div className="bg-gradient p-4 text-center text-white"
                   style={{ background: 'linear-gradient(135deg, #4CAF50, #45a049)' }}>
                <div className="mb-3">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white text-success mb-2"
                       style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}>
                    🌾
                  </div>
                </div>
                <h1 className="h3 mb-2 fw-bold">Smart Farm APMS</h1>
                <p className="mb-0 opacity-75">Agricultural Products Management System</p>
              </div>

              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="h4 mb-2 text-dark">Welcome Back!</h2>
                  <p className="text-muted">Sign in to your account</p>
                </div>
                
                {error && (
                  <Alert variant="danger" className="border-0 rounded-3">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold text-dark">Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      required
                      className="py-3 px-4 border-2 rounded-3"
                      style={{ 
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        borderColor: '#e9ecef'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold text-dark">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="py-3 px-4 border-2 rounded-3"
                      style={{ 
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        borderColor: '#e9ecef'
                      }}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 py-3 fw-bold rounded-3 border-0 mb-3"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </Button>
                </Form>
                
                <div className="text-center mt-4 pt-3 border-top">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" 
                          className="text-success fw-bold text-decoration-none"
                          style={{ transition: 'all 0.3s ease' }}>
                      Create Account
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      <Footer />
    </div>
  );
};

export default Login;
