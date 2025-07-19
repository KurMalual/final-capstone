import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';

const ProfileCompletion = ({ onComplete }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    role: 'farmer',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Here you would call an API to update the user profile
      // For now, we'll just update the local state
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      if (onComplete) {
        onComplete(updatedUser);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Header className="bg-success text-white text-center">
              <h4>Complete Your Profile</h4>
            </Card.Header>
            <Card.Body>
              <p className="text-center text-muted mb-4">
                Please select your role to access the appropriate dashboard.
              </p>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Select Your Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="farmer">🌾 Farmer - Grow and sell agricultural products</option>
                    <option value="buyer">🛒 Buyer - Purchase agricultural products</option>
                    <option value="equipment_seller">🚜 Equipment Seller - Rent out farming equipment</option>
                    <option value="transporter">🚛 Transporter - Provide transportation services</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Choose the role that best describes your activity in the agricultural value chain.
                  </Form.Text>
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="success"
                    type="submit"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? 'Updating...' : 'Complete Profile & Continue'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileCompletion;
