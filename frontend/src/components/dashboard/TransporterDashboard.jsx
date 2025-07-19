import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Toast, ToastContainer, Alert } from 'react-bootstrap';
import { transportAPI } from '../../services/api';

const TransporterDashboard = ({ data, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

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
                        <Card.Body>
                          <h6>{vehicle.vehicle_type}</h6>
                          <small className="text-muted">Capacity: {vehicle.capacity}</small>
                          <br />
                          <small className="text-muted">${vehicle.price_per_km}/km</small>
                          <div className="d-flex justify-content-between align-items-center mt-2">
                            <Badge bg={vehicle.available ? 'success' : 'danger'}>
                              {vehicle.available ? '✅ Available' : '🔴 In Use'}
                            </Badge>
                            <Button variant="outline-info" size="sm">
                              Edit
                            </Button>
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
                  <Card key={request.id} className="mb-3 border">
                    <Card.Body className="py-2">
                      <h6 className="mb-1">{request.transport__vehicle_type}</h6>
                      <small className="text-muted">by {request.requestor__username}</small>
                      <p className="mb-1 text-sm">From: {request.pickup_location}</p>
                      <p className="mb-1 text-sm">To: {request.delivery_location}</p>
                      <div className="mt-2">
                        {request.status === 'pending' ? (
                          <div className="d-grid gap-2">
                            <Button 
                              variant="success" 
                              size="sm"
                              disabled={loading}
                              onClick={() => handleAcceptTransport(request.id, request.transport__vehicle_type)}
                            >
                              ✅ Accept
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              disabled={loading}
                              onClick={() => handleRejectTransport(request.id, request.transport__vehicle_type)}
                            >
                              ❌ Reject
                            </Button>
                          </div>
                        ) : (
                          <Badge bg={
                            request.status === 'approved' ? 'success' : 'danger'
                          }>
                            {request.status === 'approved' ? '✅ Accepted' : '❌ Rejected'}
                          </Badge>
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
