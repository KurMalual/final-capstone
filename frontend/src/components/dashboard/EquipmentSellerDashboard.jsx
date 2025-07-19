import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Toast, ToastContainer } from 'react-bootstrap';
import { equipmentAPI } from '../../services/api';

const EquipmentSellerDashboard = ({ data, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  console.log('EquipmentSellerDashboard received data:', data);

  if (!data) return null;

  // Handle data structure - dashboard summary doesn't return profile separately
  const profile = data.profile || { username: 'Equipment Seller', first_name: 'Equipment Seller' };
  const myEquipment = data.my_equipment || [];
  const rentalRequests = data.rental_requests || [];

  console.log('EquipmentSellerDashboard processed data:', {
    profile,
    myEquipment: myEquipment.length,
    rentalRequests: rentalRequests.length
  });

  const showNotification = (message, variant = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleApproveRental = async (requestId, equipmentName) => {
    try {
      setLoading(true);
      await equipmentAPI.approveRental(requestId);
      showNotification(`✅ Rental request for ${equipmentName} approved!`, 'success');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error approving rental:', error);
      showNotification('❌ Failed to approve rental request', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRental = async (requestId, equipmentName) => {
    try {
      setLoading(true);
      await equipmentAPI.rejectRental(requestId);
      showNotification(`❌ Rental request for ${equipmentName} rejected`, 'warning');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error rejecting rental:', error);
      showNotification('❌ Failed to reject rental request', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      {/* Welcome Header */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-warning text-dark">
            <Card.Body>
              <h2>Welcome Back, {profile?.first_name || profile?.username}! 🚜</h2>
              <p className="mb-0">Manage your equipment and rental requests</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card className="h-100 text-center">
            <Card.Body>
              <h3 className="text-warning">🚜 {myEquipment.length}</h3>
              <p className="mb-0">My Equipment</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card className="h-100 text-center">
            <Card.Body>
              <h3 className="text-info">📋 {rentalRequests.length}</h3>
              <p className="mb-0">Rental Requests</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* My Equipment */}
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Header className="bg-warning text-dark">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">🚜 My Equipment</h5>
                <Button variant="outline-dark" size="sm">
                  + Add Equipment
                </Button>
              </div>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {myEquipment.length > 0 ? (
                <Row>
                  {myEquipment.map((equipment) => (
                    <Col md={6} key={equipment.id} className="mb-3">
                      <Card className="h-100">
                        <Card.Body>
                          <h6>{equipment.name}</h6>
                          <p className="text-muted small">{equipment.description}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <Badge bg={equipment.available ? 'success' : 'danger'}>
                              {equipment.available ? '✅ Available' : '🔴 Rented'}
                            </Badge>
                            <Button variant="outline-warning" size="sm">
                              Edit
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <p className="text-muted text-center">No equipment listed</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Rental Requests */}
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">📋 Rental Requests</h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {rentalRequests.length > 0 ? (
                rentalRequests.map((request) => (
                  <Card key={request.id} className="mb-3 border">
                    <Card.Body className="py-2">
                      <h6 className="mb-1">{request.equipment__name}</h6>
                      <small className="text-muted">by {request.farmer__username}</small>
                      <div className="mt-2">
                        {request.status === 'pending' ? (
                          <div className="d-grid gap-2">
                            <Button 
                              variant="success" 
                              size="sm"
                              disabled={loading}
                              onClick={() => handleApproveRental(request.id, request.equipment__name)}
                            >
                              ✅ Approve
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              disabled={loading}
                              onClick={() => handleRejectRental(request.id, request.equipment__name)}
                            >
                              ❌ Reject
                            </Button>
                          </div>
                        ) : (
                          <Badge bg={
                            request.status === 'approved' ? 'success' : 'danger'
                          }>
                            {request.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                          </Badge>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p className="text-muted text-center">No rental requests</p>
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

export default EquipmentSellerDashboard;
