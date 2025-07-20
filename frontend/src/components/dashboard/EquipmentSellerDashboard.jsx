import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Toast, ToastContainer, Modal, Form } from 'react-bootstrap';
import { equipmentAPI } from '../../services/api';

const EquipmentSellerDashboard = ({ data, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  
  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    hourly_rate: '',
    available: true
  });

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

  const handleEditEquipment = (equipment) => {
    setEditingEquipment(equipment);
    setEditForm({
      name: equipment.name,
      description: equipment.description,
      hourly_rate: equipment.hourly_rate,
      available: equipment.available
    });
    setShowEditModal(true);
  };

  const handleUpdateEquipment = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await equipmentAPI.update(editingEquipment.id, editForm);
      showNotification(`✅ Equipment updated successfully!`, 'success');
      setShowEditModal(false);
      setEditingEquipment(null);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error updating equipment:', error);
      showNotification('❌ Failed to update equipment', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEquipment = async (equipmentId, equipmentName) => {
    if (window.confirm(`Are you sure you want to delete "${equipmentName}"?`)) {
      try {
        setLoading(true);
        await equipmentAPI.delete(equipmentId);
        showNotification(`✅ Equipment "${equipmentName}" deleted successfully!`, 'success');
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Error deleting equipment:', error);
        showNotification('❌ Failed to delete equipment', 'danger');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleAvailability = async (equipmentId, equipmentName, currentStatus) => {
    const action = currentStatus ? 'mark as unavailable' : 'mark as available';
    if (window.confirm(`Are you sure you want to ${action} "${equipmentName}"?`)) {
      try {
        setLoading(true);
        await equipmentAPI.toggleAvailability(equipmentId);
        const newStatus = currentStatus ? 'unavailable' : 'available';
        showNotification(`✅ Equipment "${equipmentName}" marked as ${newStatus}!`, 'success');
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Error toggling availability:', error);
        showNotification('❌ Failed to update equipment availability', 'danger');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteRentalRequest = async (requestId, equipmentName) => {
    if (window.confirm(`Are you sure you want to delete this rental request for "${equipmentName}"?`)) {
      try {
        setLoading(true);
        await equipmentAPI.deleteRentalRequest(requestId);
        showNotification(`✅ Rental request deleted successfully!`, 'success');
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Error deleting rental request:', error);
        showNotification('❌ Failed to delete rental request', 'danger');
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
                        {equipment.image && (
                          <Card.Img
                            variant="top"
                            src={equipment.image}
                            alt={equipment.name}
                            style={{ height: '150px', objectFit: 'cover' }}
                          />
                        )}
                        <Card.Body>
                          <h6>{equipment.name}</h6>
                          <p className="text-muted small">{equipment.description}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <Badge bg={equipment.available ? 'success' : 'warning'}>
                              {equipment.available ? '✅ Available' : '⏳ Pending/Rented'}
                            </Badge>
                            <div className="d-flex gap-1">
                              <Button 
                                variant={equipment.available ? 'outline-warning' : 'outline-success'} 
                                size="sm"
                                onClick={() => handleToggleAvailability(equipment.id, equipment.name, equipment.available)}
                                disabled={loading}
                                title={equipment.available ? 'Mark as unavailable' : 'Mark as available'}
                              >
                                {equipment.available ? '⏸️' : '▶️'}
                              </Button>
                              <Button 
                                variant="outline-warning" 
                                size="sm"
                                onClick={() => handleEditEquipment(equipment)}
                                disabled={loading}
                              >
                                ✏️ Edit
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDeleteEquipment(equipment.id, equipment.name)}
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
                      {request.operation_location && (
                        <div className="mt-1">
                          <small className="text-primary">
                            <i className="bi bi-geo-alt"></i> {request.operation_location}
                          </small>
                        </div>
                      )}
                      {request.message && (
                        <div className="mt-1">
                          <small className="text-muted">"{request.message}"</small>
                        </div>
                      )}
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
                          <div className="d-flex justify-content-between align-items-center">
                            <Badge bg={
                              request.status === 'approved' ? 'success' : 'danger'
                            }>
                              {request.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                            </Badge>
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => handleDeleteRentalRequest(request.id, request.equipment__name)}
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
                <p className="text-muted text-center">No rental requests</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Edit Equipment Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Equipment</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateEquipment}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Equipment Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hourly Rate ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={editForm.hourly_rate}
                onChange={(e) => setEditForm(prev => ({ ...prev, hourly_rate: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Available for rent"
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
              {loading ? 'Updating...' : 'Update Equipment'}
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

export default EquipmentSellerDashboard;
