import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Toast, ToastContainer, Alert, Modal, Form } from 'react-bootstrap';
import { transportAPI } from '../../services/api';

const TransporterDashboard = ({ data, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  
  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editForm, setEditForm] = useState({
    vehicle_type: '',
    capacity: '',
    price_per_km: '',
    available: true
  });

  console.log('TransporterDashboard received data:', data);

  if (!data) {
    return (
      <Container className="py-4">
        <Alert variant="warning">No dashboard data available</Alert>
      </Container>
    );
  }

  // Handle both data structures - direct data or nested in 'data'
  const profileData = data.profile || { username: 'Transporter', first_name: 'Transporter' };
  const vehiclesData = data.my_vehicles || [];
  const requestsData = data.transport_requests || [];

  console.log('TransporterDashboard processed data:', {
    profile: profileData,
    vehicles: vehiclesData.length,
    requests: requestsData.length
  });

  const showNotification = (message, variant = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAcceptTransport = async (requestId, vehicleName) => {
    try {
      setLoading(true);
      await transportAPI.approveTransport(requestId);
      showNotification(`✅ Transport request for ${vehicleName} accepted!`, 'success');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error accepting transport:', error);
      showNotification('❌ Failed to accept transport request', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectTransport = async (requestId, vehicleName) => {
    try {
      setLoading(true);
      await transportAPI.rejectTransport(requestId);
      showNotification(`❌ Transport request for ${vehicleName} rejected`, 'warning');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error rejecting transport:', error);
      showNotification('❌ Failed to reject transport request', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransportRequest = async (requestId, vehicleName) => {
    if (window.confirm(`Are you sure you want to delete this transport request for "${vehicleName}"?`)) {
      try {
        setLoading(true);
        await transportAPI.deleteTransportRequest(requestId);
        showNotification(`✅ Transport request deleted successfully!`, 'success');
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Error deleting transport request:', error);
        showNotification('❌ Failed to delete transport request', 'danger');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setEditForm({
      vehicle_type: vehicle.vehicle_type,
      capacity: vehicle.capacity,
      price_per_km: vehicle.price_per_km,
      available: vehicle.available
    });
    setShowEditModal(true);
  };

  const handleUpdateVehicle = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await transportAPI.update(editingVehicle.id, editForm);
      showNotification(`✅ Vehicle updated successfully!`, 'success');
      setShowEditModal(false);
      setEditingVehicle(null);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      showNotification('❌ Failed to update vehicle', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId, vehicleName) => {
    if (window.confirm(`Are you sure you want to delete "${vehicleName}"?`)) {
      try {
        setLoading(true);
        await transportAPI.delete(vehicleId);
        showNotification(`✅ Vehicle "${vehicleName}" deleted successfully!`, 'success');
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        showNotification('❌ Failed to delete vehicle', 'danger');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container className="py-4">
      {/* Welcome Header */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-info text-white">
            <Card.Body>
              <h2>Welcome Back, {profileData?.first_name || profileData?.username}! 🚛</h2>
              <p className="mb-0">Manage your vehicles and transport requests</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card className="h-100 text-center">
            <Card.Body>
              <h3 className="text-info">🚛 {vehiclesData.length}</h3>
              <p className="mb-0">My Vehicles</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card className="h-100 text-center">
            <Card.Body>
              <h3 className="text-warning">📋 {requestsData.length}</h3>
              <p className="mb-0">Transport Requests</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* My Vehicles */}
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Header className="bg-info text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">🚛 My Vehicles</h5>
                <Button variant="outline-light" size="sm">
                  + Add Vehicle
                </Button>
              </div>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {vehiclesData.length > 0 ? (
                <Row>
                  {vehiclesData.map((vehicle) => (
                    <Col md={6} key={vehicle.id} className="mb-3">
                      <Card className="h-100">
                        {vehicle.image && (
                          <Card.Img
                            variant="top"
                            src={vehicle.image}
                            alt={vehicle.vehicle_type}
                            style={{ height: '150px', objectFit: 'cover' }}
                          />
                        )}
                        <Card.Body>
                          <h6>{vehicle.vehicle_type}</h6>
                          <small className="text-muted">Capacity: {vehicle.capacity}</small>
                          <br />
                          <small className="text-muted">${vehicle.price_per_km}/km</small>
                          <div className="d-flex justify-content-between align-items-center mt-2">
                            <Badge bg={vehicle.available ? 'success' : 'danger'}>
                              {vehicle.available ? '✅ Available' : '🔴 In Use'}
                            </Badge>
                            <div className="d-flex gap-1">
                              <Button 
                                variant="outline-info" 
                                size="sm"
                                onClick={() => handleEditVehicle(vehicle)}
                                disabled={loading}
                              >
                                ✏️ Edit
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDeleteVehicle(vehicle.id, vehicle.vehicle_type)}
                                disabled={loading}
                              >
                                🗑️ Delete
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <p className="text-muted text-center">No vehicles listed</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Transport Requests */}
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">📋 Transport Requests</h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {requestsData.length > 0 ? (
                requestsData.map((request) => (
                  <Card key={request.id} className="dashboard-item">
                    <Card.Body className="py-2">
                      <div className="d-flex align-items-center gap-3 mb-2">
                        {request.transport__image && (
                          <img 
                            src={request.transport__image} 
                            alt={request.transport__vehicle_name}
                            className="rounded"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        )}
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{request.transport__vehicle_name}</h6>
                          <small className="text-muted">by {request.farmer__username}</small>
                          {request.transport__price_per_trip && (
                            <div>
                              <small className="text-success">
                                ${request.transport__price_per_trip}/trip
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="mb-1 text-sm">From: {request.pickup_location}</p>
                      <p className="mb-1 text-sm">To: {request.delivery_location}</p>
                      <p className="mb-1 text-sm">Cargo: {request.cargo_details}</p>
                      <div className="mt-2">
                        {request.status === 'pending' ? (
                          <div className="d-grid gap-2">
                            <Button 
                              variant="success" 
                              size="sm"
                              disabled={loading}
                              onClick={() => handleAcceptTransport(request.id, request.transport__vehicle_name)}
                            >
                              ✅ Accept
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              disabled={loading}
                              onClick={() => handleRejectTransport(request.id, request.transport__vehicle_name)}
                            >
                              ❌ Reject
                            </Button>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-between align-items-center">
                            <Badge bg={
                              request.status === 'approved' ? 'success' : 'danger'
                            }>
                              {request.status === 'approved' ? '✅ Accepted' : '❌ Rejected'}
                            </Badge>
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => handleDeleteTransportRequest(request.id, request.transport__vehicle_name)}
                              disabled={loading}
                              title="Delete this request"
                            >
                              🗑️
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p className="text-muted text-center">No transport requests</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Edit Vehicle Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Vehicle</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateVehicle}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Type</Form.Label>
              <Form.Control
                type="text"
                value={editForm.vehicle_type}
                onChange={(e) => setEditForm(prev => ({ ...prev, vehicle_type: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="text"
                value={editForm.capacity}
                onChange={(e) => setEditForm(prev => ({ ...prev, capacity: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price per KM ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={editForm.price_per_km}
                onChange={(e) => setEditForm(prev => ({ ...prev, price_per_km: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Available for transport"
                checked={editForm.available}
                onChange={(e) => setEditForm(prev => ({ ...prev, available: e.target.checked }))}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Vehicle'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      
      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} bg={toastVariant}>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default TransporterDashboard;
