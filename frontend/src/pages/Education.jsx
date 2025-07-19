import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { educationAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Education = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form states
  const [resourceForm, setResourceForm] = useState({
    title: '',
    resource_type: 'document',
    language: 'en',
    description: ''
  });

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      console.log('Education page: Loading data for user:', user);
      
      const response = await educationAPI.getResources();
      console.log('Education page: Resources response:', response.data);
      
      // Handle paginated API response - data is in 'results' field
      const resourcesData = response.data?.results || response.data || [];
      
      // Ensure we always set arrays
      setResources(Array.isArray(resourcesData) ? resourcesData : []);
      console.log('Education page: Set resources count:', resourcesData.length);
      setError('');
    } catch (error) {
      setError('Failed to load educational resources');
      console.error('Education page: Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      await educationAPI.createResource(resourceForm);
      setSuccess('Educational resource added successfully!');
      setShowAddModal(false);
      setResourceForm({ title: '', resource_type: 'document', language: 'en', description: '' });
      loadResources();
    } catch (error) {
      setError('Failed to add resource');
      console.error('Failed to add resource:', error);
    }
  };

  const getResourceTypeIcon = (type) => {
    switch (type) {
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'document': return '📄';
      case 'image': return '🖼️';
      default: return '📚';
    }
  };

  const getResourceTypeBadge = (type) => {
    const colors = {
      video: 'primary',
      audio: 'success',
      document: 'info',
      image: 'warning'
    };
    return colors[type] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  const canAddResources = user?.role === 'farmer' || user?.role === 'admin';

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>📚 Agricultural Education Center</h2>
              <p className="text-muted">Learn modern farming techniques and best practices</p>
            </div>
            {canAddResources && (
              <Button variant="success" onClick={() => setShowAddModal(true)}>
                + Add Resource
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      {success && <Alert variant="success" className="mb-3">{success}</Alert>}

      {/* Educational Categories */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-light border-0">
            <Card.Body>
              <h5>🌱 Learning Categories</h5>
              <Row className="g-3">
                <Col md={3}>
                  <Card className="text-center border-0 bg-white">
                    <Card.Body className="p-3">
                      <div className="h2 mb-2">🌾</div>
                      <h6>Crop Management</h6>
                      <small className="text-muted">Learn about planting, growing, and harvesting techniques</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center border-0 bg-white">
                    <Card.Body className="p-3">
                      <div className="h2 mb-2">🐄</div>
                      <h6>Livestock Care</h6>
                      <small className="text-muted">Animal husbandry and veterinary care</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center border-0 bg-white">
                    <Card.Body className="p-3">
                      <div className="h2 mb-2">🚜</div>
                      <h6>Modern Technology</h6>
                      <small className="text-muted">Agricultural machinery and smart farming</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center border-0 bg-white">
                    <Card.Body className="p-3">
                      <div className="h2 mb-2">💰</div>
                      <h6>Farm Business</h6>
                      <small className="text-muted">Financial management and marketing</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Educational Resources */}
      <Row className="mb-4">
        <Col>
          <h4>Available Resources</h4>
          <Row>
            {resources.length === 0 ? (
              <Col>
                <Card className="text-center p-4">
                  <Card.Body>
                    <div className="h1 mb-3">📖</div>
                    <h5>No Educational Resources Yet</h5>
                    <p className="text-muted">
                      Start building your knowledge base by adding educational materials.
                    </p>
                    {canAddResources && (
                      <Button variant="primary" onClick={() => setShowAddModal(true)}>
                        Add First Resource
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              resources.map((resource) => (
                <Col md={6} lg={4} key={resource.id} className="mb-3">
                  <Card className="h-100">
                    <Card.Body>
                      <div className="d-flex align-items-start mb-3">
                        <div className="me-3 h3">{getResourceTypeIcon(resource.resource_type)}</div>
                        <div className="flex-grow-1">
                          <Card.Title className="h6 mb-1">{resource.title}</Card.Title>
                          <div className="mb-2">
                            <Badge bg={getResourceTypeBadge(resource.resource_type)} className="me-2">
                              {resource.resource_type}
                            </Badge>
                            <Badge bg="outline-secondary" text="dark">
                              {resource.language?.toUpperCase() || 'EN'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {resource.description && (
                        <Card.Text className="small text-muted mb-3">
                          {resource.description}
                        </Card.Text>
                      )}
                      
                      <div className="text-muted small mb-3">
                        Added: {new Date(resource.created_at).toLocaleDateString()}
                      </div>
                      
                      <div className="d-flex gap-2">
                        {resource.file && (
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            href={resource.file}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download
                          </Button>
                        )}
                        <Button variant="outline-secondary" size="sm">
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Col>
      </Row>

      {/* Quick Tips */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>💡 Quick Farming Tips</Card.Title>
              <Row>
                <Col md={6}>
                  <h6>🌱 Soil Health</h6>
                  <ul>
                    <li>Test soil pH regularly (ideal: 6.0-7.0)</li>
                    <li>Use organic compost to improve fertility</li>
                    <li>Practice crop rotation to prevent depletion</li>
                    <li>Avoid overwatering to prevent root rot</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>🐛 Pest Management</h6>
                  <ul>
                    <li>Use integrated pest management (IPM)</li>
                    <li>Encourage beneficial insects</li>
                    <li>Regular field inspection for early detection</li>
                    <li>Use natural pesticides when possible</li>
                  </ul>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <h6>💧 Water Management</h6>
                  <ul>
                    <li>Install drip irrigation for efficiency</li>
                    <li>Mulch around plants to retain moisture</li>
                    <li>Water early morning or late evening</li>
                    <li>Monitor soil moisture before watering</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>📈 Productivity Tips</h6>
                  <ul>
                    <li>Keep detailed farming records</li>
                    <li>Plan seasonal crop schedules</li>
                    <li>Invest in quality seeds and tools</li>
                    <li>Stay updated with weather forecasts</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Resource Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Educational Resource</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddResource}>
            <Form.Group className="mb-3">
              <Form.Label>Resource Title</Form.Label>
              <Form.Control
                type="text"
                value={resourceForm.title}
                onChange={(e) => setResourceForm({...resourceForm, title: e.target.value})}
                placeholder="e.g., Modern Irrigation Techniques"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Resource Type</Form.Label>
              <Form.Select
                value={resourceForm.resource_type}
                onChange={(e) => setResourceForm({...resourceForm, resource_type: e.target.value})}
                required
              >
                <option value="document">Document/PDF</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="image">Image/Infographic</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Language</Form.Label>
              <Form.Select
                value={resourceForm.language}
                onChange={(e) => setResourceForm({...resourceForm, language: e.target.value})}
                required
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="sw">Swahili</option>
                <option value="ar">Arabic</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={resourceForm.description}
                onChange={(e) => setResourceForm({...resourceForm, description: e.target.value})}
                placeholder="Brief description of the resource content"
              />
            </Form.Group>
            
            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="success" type="submit">
                Add Resource
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Education;
