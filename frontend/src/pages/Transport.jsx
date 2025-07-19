import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { transportAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Transport = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [transportRequests, setTransportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  // Form states
  const [vehicleForm, setVehicleForm] = useState({
    vehicle_name: '',
    description: '',
    price_per_trip: '',
    available: true
  });
  
  const [requestForm, setRequestForm] = useState({
    pickup_location: '',
    delivery_location: '',
    cargo_details: '',
    message: ''
  });

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Transport page: Loading data for user:', user);
      
      const [vehiclesResponse, requestsResponse] = await Promise.all([
        transportAPI.getAll(),
        transportAPI.getTransportRequests()
      ]);
      
      console.log('Transport page: Vehicles response:', vehiclesResponse.data);
      console.log('Transport page: Requests response:', requestsResponse.data);
      
      // Handle paginated API response - data is in 'results' field  
      const vehiclesData = vehiclesResponse.data?.results || vehiclesResponse.data || [];
      const requestsData = requestsResponse.data?.results || requestsResponse.data || [];
      
      // Ensure we always set arrays
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
      setTransportRequests(Array.isArray(requestsData) ? requestsData : []);
      console.log('Transport page: Set vehicles count:', vehiclesData.length);
      console.log('Transport page: Set requests count:', requestsData.length);
      setError('');
    } catch (error) {
      console.error('Transport page: Error loading data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await transportAPI.create(vehicleForm);
      setSuccess('Vehicle added successfully!');
      setShowAddModal(false);
      setVehicleForm({ vehicle_name: '', description: '', price_per_trip: '', available: true });
      loadData();
    } catch (error) {
      setError('Failed to add vehicle');
      console.error('Failed to add vehicle:', error);
    }
  };

  const handleTransportRequest = async (e) => {
    e.preventDefault();
    try {
      await transportAPI.createTransportRequest({
        transport: selectedVehicle.id,
        pickup_location: requestForm.pickup_location,
        delivery_location: requestForm.delivery_location,
        cargo_details: requestForm.cargo_details,
        message: requestForm.message
      });
      setSuccess('Transport request sent successfully!');
      setShowRequestModal(false);
      setRequestForm({ pickup_location: '', delivery_location: '', cargo_details: '', message: '' });
      loadData();
    } catch (error) {
      setError('Failed to send transport request');
      console.error('Failed to send transport request:', error);
    }
  };

  const handleApproveRequest = async (id) => {
    try {
      await transportAPI.approveTransport(id);
      setSuccess('Transport request approved!');
      loadData();
    } catch (error) {
      setError('Failed to approve request');
      console.error('Failed to approve request:', error);
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      await transportAPI.rejectTransport(id);
      setSuccess('Transport request rejected!');
      loadData();
    } catch (error) {
      setError('Failed to reject request');
      console.error('Failed to reject request:', error);
    }
  };

  const openRequestModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowRequestModal(true);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  const isTransporter = user?.role === 'transporter';
  const isFarmer = user?.role === 'farmer';

  try {
    return (
      <Container fluid className="p-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h2>🚛 Transport Services</h2>
              {isTransporter && (
                <Button variant="success" onClick={() => setShowAddModal(true)}>
                  + Add Vehicle
                </Button>
            )}
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      {success && <Alert variant="success" className="mb-3">{success}</Alert>}

      {/* Vehicles Grid */}
      <Row className="mb-4">
        <Col>
          <h4>{isTransporter ? 'My Vehicles' : 'Available Transport'}</h4>
          <Row>
            {vehicles.length === 0 ? (
              <Col>
                <Card className="text-center p-4">
                  <Card.Body>
                    <p className="text-muted">No vehicles available</p>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              vehicles.map((vehicle) => (
                <Col md={6} lg={4} key={vehicle.id} className="mb-3">
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>{vehicle.vehicle_name}</Card.Title>
                      <Card.Text>{vehicle.description}</Card.Text>
                      <div className="mb-2">
                        <Badge bg={vehicle.available ? 'success' : 'secondary'}>
                          {vehicle.available ? 'Available' : 'Not Available'}
                        </Badge>
                      </div>
                      <div className="mb-3">
                        <strong>${vehicle.price_per_trip}/trip</strong>
                      </div>
                      {isFarmer && vehicle.available && (
                        <Button 
                          variant="primary" 
                          onClick={() => openRequestModal(vehicle)}
                          className="w-100"
                        >
                          Request Transport
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Col>
      </Row>

      {/* Transport Requests */}
      {transportRequests.length > 0 && (
        <Row>
          <Col>
            <h4>Transport Requests</h4>
            <Row>
              {transportRequests.map((request) => (
                <Col md={6} lg={4} key={request.id} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>Transport Request</Card.Title>
                      <p><strong>Vehicle:</strong> {request.transport_type || 'N/A'}</p>
                      <p><strong>From:</strong> {request.pickup_location}</p>
                      <p><strong>To:</strong> {request.delivery_location}</p>
                      <p><strong>Cargo:</strong> {request.cargo_details}</p>
                      <p><strong>Status:</strong> 
                        <Badge bg={
                          request.status === 'approved' ? 'success' : 
                          request.status === 'rejected' ? 'danger' : 'warning'
                        } className="ms-2">
                          {request.status}
                        </Badge>
                      </p>
                      <p><strong>Message:</strong> {request.message}</p>
                      
                      {isTransporter && request.status === 'pending' && (
                        <div className="d-flex gap-2">
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => handleApproveRequest(request.id)}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleRejectRequest(request.id)}
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

      {/* Add Vehicle Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Vehicle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddVehicle}>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Name</Form.Label>
              <Form.Control
                type="text"
                value={vehicleForm.vehicle_name}
                onChange={(e) => setVehicleForm({...vehicleForm, vehicle_name: e.target.value})}
                placeholder="e.g., Toyota Hilux, Isuzu Truck"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Price per Trip ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={vehicleForm.price_per_trip}
                onChange={(e) => setVehicleForm({...vehicleForm, price_per_trip: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={vehicleForm.description}
                onChange={(e) => setVehicleForm({...vehicleForm, description: e.target.value})}
                placeholder="Additional details about the vehicle"
              />
            </Form.Group>
            
            <Form.Check
              type="checkbox"
              label="Available for hire"
              checked={vehicleForm.available}
              onChange={(e) => setVehicleForm({...vehicleForm, available: e.target.checked})}
              className="mb-3"
            />
            
            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="success" type="submit">
                Add Vehicle
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Transport Request Modal */}
      <Modal show={showRequestModal} onHide={() => setShowRequestModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Request Transport Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVehicle && (
            <>
              <div className="mb-3">
                <h5>{selectedVehicle.vehicle_name}</h5>
                <p><strong>Price:</strong> ${selectedVehicle.price_per_trip}/trip</p>
                <p>{selectedVehicle.description}</p>
              </div>
              
              <Form onSubmit={handleTransportRequest}>
                <Form.Group className="mb-3">
                  <Form.Label>Pickup Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={requestForm.pickup_location}
                    onChange={(e) => setRequestForm({...requestForm, pickup_location: e.target.value})}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Delivery Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={requestForm.delivery_location}
                    onChange={(e) => setRequestForm({...requestForm, delivery_location: e.target.value})}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Cargo Details</Form.Label>
                  <Form.Control
                    type="text"
                    value={requestForm.cargo_details}
                    onChange={(e) => setRequestForm({...requestForm, cargo_details: e.target.value})}
                    placeholder="What needs to be transported?"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Additional Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={requestForm.message}
                    onChange={(e) => setRequestForm({...requestForm, message: e.target.value})}
                    placeholder="Any special requirements or timing details"
                  />
                </Form.Group>
                
                <div className="d-flex gap-2">
                  <Button variant="secondary" onClick={() => setShowRequestModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Send Request
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
  } catch (error) {
    console.error('Transport component render error:', error);
    return (
      <Container fluid className="p-4">
        <Alert variant="danger">
          Error loading transport page: {error.message}
        </Alert>
      </Container>
    );
  }
};

export default Transport;
