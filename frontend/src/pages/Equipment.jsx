import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { equipmentAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import ImageUpload from '../components/ImageUpload';

const Equipment = () => {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [rentalRequests, setRentalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [editingEquipment, setEditingEquipment] = useState(null);
  
  // Form states
  const [equipmentForm, setEquipmentForm] = useState({
    name: '',
    description: '',
    price_per_day: '',
    available: true,
    image: null
  });
  
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price_per_day: '',
    available: true,
    image: null
  });
  
  const [rentalForm, setRentalForm] = useState({
    message: '',
    operation_location: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Equipment page: Loading data for user:', user);
      
      const [equipmentResponse, rentalResponse] = await Promise.all([
        equipmentAPI.getAll(),
        equipmentAPI.getRentalRequests()
      ]);
      
      console.log('Equipment page: Equipment response:', equipmentResponse.data);
      console.log('Equipment page: Rental response:', rentalResponse.data);
      
      // Handle paginated API response - data is in 'results' field
      const equipmentData = equipmentResponse.data?.results || equipmentResponse.data || [];
      const rentalData = rentalResponse.data?.results || rentalResponse.data || [];
      
      // Ensure we always set arrays
      setEquipment(Array.isArray(equipmentData) ? equipmentData : []);
      setRentalRequests(Array.isArray(rentalData) ? rentalData : []);
      console.log('Equipment page: Set equipment count:', equipmentData.length);
      console.log('Equipment page: Set rental requests count:', rentalData.length);
      setError('');
    } catch (error) {
      console.error('Equipment page: Error loading data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', equipmentForm.name);
      formData.append('description', equipmentForm.description);
      formData.append('price_per_day', equipmentForm.price_per_day);
      formData.append('available', equipmentForm.available);
      
      if (equipmentForm.image) {
        formData.append('image', equipmentForm.image);
      }
      
      // Debug: Log FormData contents
      console.log('Sending Equipment FormData with:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      await equipmentAPI.create(formData);
      setSuccess('Equipment added successfully!');
      setShowAddModal(false);
      setEquipmentForm({ 
        name: '', 
        description: '', 
        price_per_day: '', 
        available: true,
        image: null
      });
      loadData();
    } catch (error) {
      console.error('Failed to add equipment - Full error:', error);
      console.error('Error response:', error.response?.data);
      setError('Failed to add equipment');
    }
  };

  const handleRentalRequest = async (e) => {
    e.preventDefault();
    try {
      await equipmentAPI.createRentalRequest({
        equipment: selectedEquipment.id,
        message: rentalForm.message,
        operation_location: rentalForm.operation_location
      });
      setSuccess('Rental request sent successfully!');
      setShowRentalModal(false);
      setRentalForm({ message: '', operation_location: '' });
      loadData();
    } catch (error) {
      setError('Failed to send rental request');
      console.error('Failed to send rental request:', error);
    }
  };

  const handleApproveRental = async (id) => {
    try {
      await equipmentAPI.approveRental(id);
      setSuccess('Rental request approved!');
      loadData();
    } catch (error) {
      setError('Failed to approve rental request');
      console.error('Failed to approve rental request:', error);
    }
  };

  const handleRejectRental = async (id) => {
    try {
      await equipmentAPI.rejectRental(id);
      setSuccess('Rental request rejected!');
      loadData();
    } catch (error) {
      setError('Failed to reject rental request');
      console.error('Failed to reject rental request:', error);
    }
  };

  const handleEditEquipment = (equipment) => {
    setEditingEquipment(equipment);
    setEditForm({
      name: equipment.name,
      description: equipment.description,
      price_per_day: equipment.price_per_day,
      available: equipment.available,
      image: null
    });
    setShowEditModal(true);
  };

  const handleUpdateEquipment = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      formData.append('price_per_day', editForm.price_per_day);
      formData.append('available', editForm.available);
      
      if (editForm.image) {
        formData.append('image', editForm.image);
      }
      
      await equipmentAPI.update(editingEquipment.id, formData);
      setSuccess('Equipment updated successfully!');
      setShowEditModal(false);
      setEditingEquipment(null);
      loadData();
    } catch (error) {
      console.error('Failed to update equipment:', error);
      setError('Failed to update equipment');
    }
  };

  const handleDeleteEquipment = async (equipmentId, equipmentName) => {
    if (window.confirm(`Are you sure you want to delete "${equipmentName}"?`)) {
      try {
        await equipmentAPI.delete(equipmentId);
        setSuccess(`Equipment "${equipmentName}" deleted successfully!`);
        loadData();
      } catch (error) {
        console.error('Failed to delete equipment:', error);
        setError('Failed to delete equipment');
      }
    }
  };

  const openRentalModal = (equipment) => {
    setSelectedEquipment(equipment);
    setShowRentalModal(true);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" />
        <span className="ms-2">Loading equipment...</span>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Alert variant="warning">Please log in to access equipment management.</Alert>
      </Container>
    );
  }

  const isEquipmentSeller = user?.role === 'equipment_seller';
  const isFarmer = user?.role === 'farmer';

  console.log('Equipment page render:', { user, isEquipmentSeller, isFarmer, equipmentCount: equipment.length });

  try {
    return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>🚜 Equipment Management</h2>
            {isEquipmentSeller && (
              <Button variant="success" onClick={() => setShowAddModal(true)}>
                + Add Equipment
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      {success && <Alert variant="success" className="mb-3">{success}</Alert>}

      {/* Equipment Grid */}
      <Row className="mb-4">
        <Col>
          <h4>{isEquipmentSeller ? 'My Equipment' : 'Available Equipment'}</h4>
          <Row>
            {equipment.length === 0 ? (
              <Col>
                <Card className="text-center p-4">
                  <Card.Body>
                    <p className="text-muted">No equipment available</p>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              equipment.map((item) => (
                <Col md={6} lg={4} key={item.id} className="mb-3">
                  <Card className="h-100">
                    {item.image && (
                      <Card.Img
                        variant="top"
                        src={item.image}
                        alt={item.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>{item.description}</Card.Text>
                      <div className="mb-2">
                        <Badge bg={item.available ? 'success' : 'secondary'}>
                          {item.available ? 'Available' : 'Not Available'}
                        </Badge>
                      </div>
                      <div className="mb-3">
                        <strong>${item.price_per_day}/day</strong>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        {isFarmer && item.available && (
                          <Button 
                            variant="primary" 
                            onClick={() => openRentalModal(item)}
                            className="w-100"
                          >
                            Rent Equipment
                          </Button>
                        )}
                        {user?.id === item.owner && (
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-warning" 
                              size="sm"
                              onClick={() => handleEditEquipment(item)}
                              className="flex-fill"
                            >
                              ✏️ Edit
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteEquipment(item.id, item.name)}
                              className="flex-fill"
                            >
                              🗑️ Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Col>
      </Row>

      {/* Rental Requests */}
      {rentalRequests.length > 0 && (
        <Row>
          <Col>
            <h4>Rental Requests</h4>
            <Row>
              {rentalRequests.map((request) => (
                <Col md={6} lg={4} key={request.id} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>Equipment Request</Card.Title>
                      <p><strong>Equipment:</strong> {request.equipment_name || 'N/A'}</p>
                      <p><strong>Status:</strong> 
                        <Badge bg={
                          request.status === 'approved' ? 'success' : 
                          request.status === 'rejected' ? 'danger' : 'warning'
                        } className="ms-2">
                          {request.status}
                        </Badge>
                      </p>
                      <p><strong>Message:</strong> {request.message}</p>
                      
                      {isEquipmentSeller && request.status === 'pending' && (
                        <div className="d-flex gap-2">
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => handleApproveRental(request.id)}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleRejectRental(request.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      )}

      {/* Add Equipment Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Equipment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddEquipment}>
            <Form.Group className="mb-3">
              <Form.Label>Equipment Name</Form.Label>
              <Form.Control
                type="text"
                value={equipmentForm.name}
                onChange={(e) => setEquipmentForm({...equipmentForm, name: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={equipmentForm.description}
                onChange={(e) => setEquipmentForm({...equipmentForm, description: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Price per Day ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={equipmentForm.price_per_day}
                onChange={(e) => setEquipmentForm({...equipmentForm, price_per_day: e.target.value})}
                required
              />
            </Form.Group>
            
            <ImageUpload
              onImageSelect={(file) => setEquipmentForm({...equipmentForm, image: file})}
              placeholder="Upload Equipment Image"
            />
            
            <Form.Check
              type="checkbox"
              label="Available for rent"
              checked={equipmentForm.available}
              onChange={(e) => setEquipmentForm({...equipmentForm, available: e.target.checked})}
              className="mb-3"
            />
            
            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="success" type="submit">
                Add Equipment
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Rental Request Modal */}
      <Modal show={showRentalModal} onHide={() => setShowRentalModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Request Equipment Rental</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEquipment && (
            <>
              <div className="mb-3">
                <h5>{selectedEquipment.name}</h5>
                <p>{selectedEquipment.description}</p>
                <p><strong>Price:</strong> ${selectedEquipment.price_per_day}/day</p>
              </div>
              
              <Form onSubmit={handleRentalRequest}>
                <Form.Group className="mb-3">
                  <Form.Label>Operation Location <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={rentalForm.operation_location}
                    onChange={(e) => setRentalForm({...rentalForm, operation_location: e.target.value})}
                    placeholder="Enter where you'll use this equipment (e.g., Farm Location, Village, District)"
                    required
                  />
                  <Form.Text className="text-muted">
                    Please specify the location where you plan to operate this equipment
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Message to Equipment Owner</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={rentalForm.message}
                    onChange={(e) => setRentalForm({...rentalForm, message: e.target.value})}
                    placeholder="Describe your rental needs, duration, etc."
                  />
                </Form.Group>
                
                <div className="d-flex gap-2">
                  <Button variant="secondary" onClick={() => setShowRentalModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Send Rental Request
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Equipment Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Equipment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateEquipment}>
            <Form.Group className="mb-3">
              <Form.Label>Equipment Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Price per Day ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={editForm.price_per_day}
                onChange={(e) => setEditForm({...editForm, price_per_day: e.target.value})}
                required
              />
            </Form.Group>
            
            <ImageUpload
              onImageSelect={(file) => setEditForm({...editForm, image: file})}
              placeholder="Update Equipment Image (Optional)"
            />
            
            <Form.Check
              type="checkbox"
              label="Available for rent"
              checked={editForm.available}
              onChange={(e) => setEditForm({...editForm, available: e.target.checked})}
              className="mb-3"
            />
            
            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update Equipment
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
  } catch (error) {
    console.error('Equipment component render error:', error);
    return (
      <Container fluid className="p-4">
        <Alert variant="danger">
          Error loading equipment page: {error.message}
        </Alert>
      </Container>
    );
  }
};

export default Equipment;
