import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Toast, ToastContainer, Modal, Form } from 'react-bootstrap';
import { transportAPI } from '../../services/api';
import { getImageUrl } from '../../utils/imageUtils';

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
    <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Welcome Header */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-white shadow-sm">
            <Card.Body>
              <h2 className="text-primary mb-1">Welcome Back, {profileData?.first_name || profileData?.username}! 🚛</h2>
              <p className="text-muted mb-0">Manage your vehicles and transport requests</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card className="h-100 text-center shadow-sm border-0">
            <Card.Body>
              <h3 className="text-info">🚛 {vehiclesData.length}</h3>
              <p className="mb-0">My Vehicles</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card className="h-100 text-center shadow-sm border-0">
            <Card.Body>
              <h3 className="text-warning">📋 {requestsData.length}</h3>
              <p className="mb-0">Transport Requests</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* My Vehicles - Refined Design */}
        <Col lg={requestsData.length > 0 ? 8 : 12} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-info text-white">
              <div className="d-flex align-items-center">
                <div className="bg-white rounded-circle p-2 me-3">
                  <span style={{ fontSize: '1.5rem' }}>🚛</span>
                </div>
                <div>
                  <h5 className="mb-0">My Vehicles</h5>
                  <small className="opacity-75">{vehiclesData.length} {vehiclesData.length === 1 ? 'vehicle' : 'vehicles'} available</small>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              {vehiclesData.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3" style={{ fontSize: '4rem', opacity: 0.3 }}>🚛</div>
                  <h5 className="text-muted">No vehicles available</h5>
                  <p className="text-muted">Add your first vehicle to get started.</p>
                  <Button variant="info" href="/transport">
                    Add Vehicle
                  </Button>
                </div>
              ) : (
                <Row>
                  {vehiclesData.map((vehicle) => (
                    <Col md={6} xl={4} key={vehicle.id} className="mb-3">
                      <Card className="h-100 border-0 shadow-sm">
                        <div className="position-relative">
                          {vehicle.image ? (
                            <Card.Img
                              variant="top"
                              src={getImageUrl(vehicle.image)}
                              alt={vehicle.vehicle_type}
                              style={{ height: '180px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div 
                              className="d-flex align-items-center justify-content-center bg-light"
                              style={{ height: '180px' }}
                            >
                              <span style={{ fontSize: '3rem', opacity: 0.3 }}>🚛</span>
                            </div>
                          )}
                          <Badge 
                            bg={vehicle.available ? 'success' : 'secondary'} 
                            className="position-absolute top-0 end-0 m-2"
                          >
                            {vehicle.available ? 'Available' : 'In Use'}
                          </Badge>
                        </div>
                        <Card.Body className="p-3">
                          <Card.Title className="h6 mb-2">{vehicle.vehicle_name || vehicle.vehicle_type || 'Vehicle'}</Card.Title>
                          <Card.Text className="text-muted small mb-3" style={{ fontSize: '0.875rem' }}>
                            {vehicle.description && vehicle.description.length > 80 ? `${vehicle.description.substring(0, 80)}...` : vehicle.description}
                          </Card.Text>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <strong className="text-success">
                              SSP {vehicle.price_per_trip || vehicle.price_per_km || '0'}/
                              {vehicle.price_per_trip ? 'trip' : 'km'}
                            </strong>
                          </div>
                          <div className="d-grid gap-2">
                            <div className="d-flex gap-2">
                              <Button 
                                variant="warning" 
                                size="sm"
                                onClick={() => handleEditVehicle(vehicle)}
                                disabled={loading}
                                className="flex-fill"
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm"
                                onClick={() => handleDeleteVehicle(vehicle.id, vehicle.vehicle_name || vehicle.vehicle_type)}
                                disabled={loading}
                                className="flex-fill"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Transport Requests - Refined Design */}
        {requestsData.length > 0 && (
          <Col lg={4}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-warning text-dark">
                <div className="d-flex align-items-center">
                  <div className="bg-white rounded-circle p-2 me-3">
                    <span style={{ fontSize: '1.5rem' }}>📋</span>
                  </div>
                  <div>
                    <h5 className="mb-0">Transport Requests</h5>
                    <small className="opacity-75">{requestsData.length} {requestsData.length === 1 ? 'request' : 'requests'}</small>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-0" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {requestsData.map((request, index) => (
                  <div key={request.id} className={`p-3 ${index !== requestsData.length - 1 ? 'border-bottom' : ''}`}>
                    <div className="d-flex align-items-start">
                      {/* Vehicle Image or Fallback */}
                      <div className="me-3 flex-shrink-0">
                        {request.transport__vehicle_image ? (
                          <img
                            src={getImageUrl(request.transport__vehicle_image)}
                            alt={request.transport__vehicle_name || 'Vehicle'}
                            style={{ 
                              width: '120px', 
                              height: '120px', 
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '1px solid #ddd'
                            }}
                            onError={(e) => {
                              // Hide the broken image and show fallback
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        {/* Fallback Icon */}
                        <div 
                          className="d-flex align-items-center justify-content-center bg-light"
                          style={{ 
                            width: '120px', 
                            height: '120px', 
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            display: request.transport__vehicle_image ? 'none' : 'flex'
                          }}
                        >
                          <span style={{ fontSize: '2.5rem', opacity: 0.5 }}>🚛</span>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0 fw-bold">{request.transport__vehicle_name || 'Vehicle'}</h6>
                          <Badge bg={
                            request.status === 'approved' ? 'success' : 
                            request.status === 'rejected' ? 'danger' : 'warning'
                          }>
                            {request.status}
                          </Badge>
                        </div>
                        
                        <div className="small text-muted mb-2">
                          <div className="d-flex justify-content-between">
                            <span>👤 {request.farmer__username || 'Farmer'}</span>
                            {request.transport__price_per_trip && (
                              <span className="fw-semibold text-success">SSP {request.transport__price_per_trip}/trip</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="small mb-2">
                          <div><strong>📍 From:</strong> {request.pickup_location}</div>
                          <div><strong>🎯 To:</strong> {request.delivery_location}</div>
                          {request.cargo_details && <div><strong>📦 Cargo:</strong> {request.cargo_details.length > 50 ? request.cargo_details.substring(0, 50) + '...' : request.cargo_details}</div>}
                        </div>
                        
                        {request.status === 'pending' && (
                          <div className="d-flex gap-2 mt-3">
                            <Button 
                              variant="success" 
                              size="sm"
                              onClick={() => handleAcceptTransport(request.id, request.transport__vehicle_name)}
                              disabled={loading}
                              className="px-3"
                            >
                              ✅ Accept
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleRejectTransport(request.id, request.transport__vehicle_name)}
                              disabled={loading}
                              className="px-3"
                            >
                              ❌ Reject
                            </Button>
                          </div>
                        )}
                        
                        {request.status !== 'pending' && (
                          <div className="mt-2">
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => handleDeleteTransportRequest(request.id, request.transport__vehicle_name)}
                              disabled={loading}
                              className="w-100"
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        )}
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
              <Form.Label>Price per KM (SSP)</Form.Label>
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
