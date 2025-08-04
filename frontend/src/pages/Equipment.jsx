import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { equipmentAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import ImageUpload from '../components/ImageUpload';
import { getImageUrl } from '../utils/imageUtils';
import { Link } from 'react-router-dom';

const Equipment = () => {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [rentalRequests, setRentalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Debug logging
  console.log('Equipment component: user state:', user);
  console.log('Equipment component: loading state:', loading);
  console.log('Equipment component: error state:', error);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
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

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors
      console.log('Equipment page: Loading data for user:', user);
      
      // Make API calls with individual error handling
      let equipmentData = [];
      let rentalData = [];
      
      try {
        const equipmentResponse = await equipmentAPI.getAll();
        console.log('Equipment page: Equipment response:', equipmentResponse.data);
        equipmentData = equipmentResponse.data?.results || equipmentResponse.data || [];
      } catch (equipmentError) {
        console.error('Equipment API error:', equipmentError);
        setError('Failed to load equipment data');
        equipmentData = [];
      }
      
      try {
        const rentalResponse = await equipmentAPI.getRentalRequests();
        console.log('Equipment page: Rental response:', rentalResponse.data);
        rentalData = rentalResponse.data?.results || rentalResponse.data || [];
      } catch (rentalError) {
        console.error('Rental requests API error:', rentalError);
        // Don't set error here as equipment might still work
        rentalData = [];
      }
      
      // Ensure we always set arrays
      setEquipment(Array.isArray(equipmentData) ? equipmentData : []);
      setRentalRequests(Array.isArray(rentalData) ? rentalData : []);
      console.log('Equipment page: Set equipment count:', equipmentData.length);
      console.log('Equipment page: Set rental requests count:', rentalData.length);
      
    } catch (error) {
      console.error('Equipment page: Critical error loading data:', error);
      setError('Failed to load equipment page data: ' + error.message);
      setEquipment([]);
      setRentalRequests([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
        operation_location: rentalForm.operation_location,
        agreed_to_terms: agreedToTerms // Add this field
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

  const handleSendRentalRequest = () => {
    if (!agreedToTerms) {
      alert('You must agree to the terms and conditions before sending a rental request.');
      return;
    }
    // Logic to send the rental request
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" />
        <span className="ms-2">Loading equipment...</span>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="p-4">
        <Alert variant="danger">
          <h5>Error Loading Equipment Page</h5>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={loadData}>
            Try Again
          </Button>
        </Alert>
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

  console.log('Equipment page render:', { 
    user: user?.username, 
    role: user?.role,
    isEquipmentSeller, 
    isFarmer, 
    equipmentCount: equipment.length,
    loading,
    error 
  });

  try {
    // Add a simple test render first
    console.log('Equipment component: About to render, states:', {
      loading,
      error,
      user: user?.username,
      equipmentCount: equipment.length,
      rentalRequestsCount: rentalRequests.length
    });

    return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Equipment Management</h2>
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
                        src={getImageUrl(item.image)}
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
                        <strong>SSP {item.price_per_day}/day</strong>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        {isFarmer && item.available && (
                          <>
                            <Button 
                              variant="primary" 
                              onClick={() => openRentalModal(item)}
                              className="w-100"
                            >
                              Rent Equipment
                            </Button>
                          </>
                        )}
                        {user?.id === item.owner && (
                          <div className="d-flex gap-2">
                            <Button 
                              variant="warning" 
                              size="sm"
                              onClick={() => handleEditEquipment(item)}
                              className="flex-fill"
                            >
                              ✏️ Edit
                            </Button>
                            <Button 
                              variant="danger" 
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
            <h4>Rental Requests ({rentalRequests.length} total)</h4>
            <Row>
              {rentalRequests.map((request) => {
                // Debug: Log request data to see what fields are available
                console.log('=== RENTAL REQUEST DEBUG ===');
                console.log('Full request object:', request);
                console.log('Equipment image field:', request.equipment_image);
                console.log('Equipment name:', request.equipment_name);
                if (request.equipment_image) {
                  console.log('Processed image URL:', getImageUrl(request.equipment_image));
                  console.log('Raw image URL:', request.equipment_image);
                }
                console.log('============================');
                
                return (
                <Col md={12} lg={6} key={request.id} className="mb-3">
                  <Card className="shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-start">
                        {/* Equipment Image or Fallback */}
                        <div className="me-3 flex-shrink-0">
                          {request.equipment_image ? (
                            <img
                              src={getImageUrl(request.equipment_image)}
                              alt={request.equipment_name}
                              style={{ 
                                width: '180px', 
                                height: '180px', 
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid #ddd'
                              }}
                              onError={(e) => {
                                console.log('❌ Image failed to load:', request.equipment_image);
                                console.log('❌ Processed URL:', getImageUrl(request.equipment_image));
                                // Hide the broken image and show fallback
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                              onLoad={() => {
                                console.log('✅ Image loaded successfully:', request.equipment_image);
                              }}
                            />
                          ) : (
                            console.log('⚠️ No equipment_image field for:', request.equipment_name)
                          )}
                          {/* Fallback Icon */}
                          
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-0 fw-bold">{request.equipment_name || 'Equipment Request'}</h6>
                            <Badge bg={
                              request.status === 'approved' ? 'success' : 
                              request.status === 'rejected' ? 'danger' : 'warning'
                            }>
                              {request.status}
                            </Badge>
                          </div>
                          
                          <div className="small text-muted mb-2">
                            <div className="d-flex justify-content-between">
                              <span>👤 {request.farmer_name || 'Farmer'}</span>
                              {request.equipment_price_per_day && (
                                <span className="fw-semibold text-success">SSP {request.equipment_price_per_day}/day</span>
                              )}
                            </div>
                          </div>
                          
                          {request.operation_location && (
                            <div className="small mb-2">
                              <strong>📍 Location:</strong> {request.operation_location}
                            </div>
                          )}
                          
                          {request.message && (
                            <div className="small mb-2 text-muted">
                              <strong>Message:</strong> {request.message.length > 80 ? request.message.substring(0, 80) + '...' : request.message}
                            </div>
                          )}
                          
                          {request.status === 'approved' && (
                            <div className="small mb-2">
                              <strong>Payment Method:</strong> {request.payment_method}
                            </div>
                          )}
                          
                          {isEquipmentSeller && request.status === 'pending' && (
                            <div className="d-flex gap-2 mt-3">
                              <Button 
                                variant="success" 
                                size="sm"
                                onClick={() => handleApproveRental(request.id)}
                                className="px-3"
                              >
                                ✅ Approve
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleRejectRental(request.id)}
                                className="px-3"
                              >
                                ❌ Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                );
              })}
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
              <Form.Label>Price per Day (SSP)</Form.Label>
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
                <p><strong>Price:</strong> SSP{selectedEquipment.price_per_day}/day</p>
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
                
                {/* Terms and Conditions Section */}
                <div className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label={(
                      <span>
                        I have read and agree to the <Link to="#" onClick={() => setShowTermsModal(true)}>Terms and Conditions</Link>
                      </span>
                    )}
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    required
                  />
                </div>
                
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
              <Form.Label>Price per Day (SSP)</Form.Label>
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

      {/* Terms and Conditions Modal */}
      <Modal show={showTermsModal} onHide={() => setShowTermsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Terms and Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Rental Terms and Conditions</h5>
          <ol>
            <li><strong>Eligibility:</strong> You must be at least 18 years old and have a valid ID to rent equipment.</li>
            <li><strong>Rental Period:</strong> Specify the duration for which you need the equipment.</li>
            <li><strong>Payment:</strong> Full payment is required upfront. Rental fees are non-refundable.</li>
            <li><strong>Deposit:</strong> A refundable deposit may be required, depending on the equipment.</li>
            <li><strong>Usage:</strong> Equipment must be used only for its intended purpose and in accordance with all safety guidelines.</li>
            <li><strong>Maintenance:</strong> Keep the equipment in good condition. Report any damages immediately.</li>
            <li><strong>Liability:</strong> You are responsible for any injury or damage caused by the equipment during the rental period.</li>
            <li><strong>Termination:</strong> We reserve the right to terminate the rental agreement at any time for violation of terms.</li>
          </ol>
          <p>By renting our equipment, you agree to abide by these terms and conditions. If you have any questions, please contact us before proceeding with the rental.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTermsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
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
