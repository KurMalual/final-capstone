import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Toast, ToastContainer, Modal, Form } from 'react-bootstrap';
import { equipmentAPI } from '../../services/api';
import { getImageUrl } from '../../utils/imageUtils';

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
      console.error('Error approving rental request:', error);
      showNotification('❌ Failed to approve rental request', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRental = async (requestId, equipmentName) => {
    try {
      setLoading(true);
      await equipmentAPI.rejectRental(requestId);
      showNotification(`✅ Rental request for ${equipmentName} rejected!`, 'success');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error rejecting rental:', error);
      showNotification('❌ Failed to reject rental request', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRentalRequest = async (requestId, equipmentName) => {
    if (window.confirm(`Delete rental request for "${equipmentName}"?`)) {
      try {
        setLoading(true);
        await equipmentAPI.deleteRentalRequest(requestId);
        showNotification(`✅ Rental request deleted!`, 'success');
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Error deleting rental request:', error);
        showNotification('❌ Failed to delete rental request', 'danger');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditEquipment = (equipment) => {
    setEditingEquipment(equipment);
    setEditForm({
      name: equipment.name || '',
      description: equipment.description || '',
      hourly_rate: equipment.hourly_rate || '',
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

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Welcome Header */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-white shadow-sm">
            <Card.Body>
              <h2 className="text-primary mb-1">Welcome Back, {profile?.first_name || profile?.username}!</h2>
              <p className="text-muted mb-0">Manage your equipment and rental requests</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card className="h-100 text-center shadow-sm border-0">
            <Card.Body>
              <h3 className="text-warning">{myEquipment.length}</h3>
              <p className="mb-0">My Equipment</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card className="h-100 text-center shadow-sm border-0">
            <Card.Body>
              <h3 className="text-info">{rentalRequests.length}</h3>
              <p className="mb-0">Rental Requests</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* My Equipment - Refined Design */}
        <Col lg={rentalRequests.length > 0 ? 8 : 12} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex align-items-center">
                <div className="bg-white rounded-circle p-2 me-3">
                  <span style={{ fontSize: '1.5rem' }}></span>
                </div>
                <div>
                  <h5 className="mb-0">My Equipment</h5>
                  <small className="opacity-75">{myEquipment.length} {myEquipment.length === 1 ? 'item' : 'items'} available</small>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              {myEquipment.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3" style={{ fontSize: '4rem', opacity: 0.3 }}></div>
                  <h5 className="text-muted">No equipment available</h5>
                  <p className="text-muted">Add your first piece of equipment to get started.</p>
                  <Button variant="primary" href="/equipment">
                    Add Equipment
                  </Button>
                </div>
              ) : (
                <Row>
                  {myEquipment.map((equipment) => (
                    <Col md={6} xl={4} key={equipment.id} className="mb-3">
                      <Card className="h-100 border-0 shadow-sm">
                        <div className="position-relative">
                          {equipment.image ? (
                            <Card.Img
                              variant="top"
                              src={getImageUrl(equipment.image)}
                              alt={equipment.name}
                              style={{ height: '180px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div 
                              className="d-flex align-items-center justify-content-center bg-light"
                              style={{ height: '180px' }}
                            >
                              <span style={{ fontSize: '3rem', opacity: 0.3 }}>🚜</span>
                            </div>
                          )}
                          <Badge 
                            bg={equipment.available ? 'success' : 'secondary'} 
                            className="position-absolute top-0 end-0 m-2"
                          >
                            {equipment.available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                        <Card.Body className="p-3">
                          <Card.Title className="h6 mb-2">{equipment.name}</Card.Title>
                          <Card.Text className="text-muted small mb-3" style={{ fontSize: '0.875rem' }}>
                            {equipment.description && equipment.description.length > 80 ? `${equipment.description.substring(0, 80)}...` : equipment.description}
                          </Card.Text>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <strong className="text-success">
                              SSP {equipment.price_per_day || equipment.hourly_rate}/
                              {equipment.price_per_day ? 'day' : 'hour'}
                            </strong>
                          </div>
                          <div className="d-grid gap-2">
                            <div className="d-flex gap-2">
                              <Button 
                                variant="warning" 
                                size="sm"
                                onClick={() => handleEditEquipment(equipment)}
                                disabled={loading}
                                className="flex-fill"
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm"
                                onClick={() => handleDeleteEquipment(equipment.id, equipment.name)}
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

        {/* Rental Requests - Refined Design */}
        {rentalRequests.length > 0 && (
          <Col lg={4}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-info text-white">
                <div className="d-flex align-items-center">
                  <div className="bg-white rounded-circle p-2 me-3">
                    <span style={{ fontSize: '1.5rem' }}></span>
                  </div>
                  <div>
                    <h5 className="mb-0">Rental Requests</h5>
                    <small className="opacity-75">{rentalRequests.length} {rentalRequests.length === 1 ? 'request' : 'requests'}</small>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-0" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {rentalRequests.map((request, index) => (
                  <div key={request.id} className={`p-3 ${index !== rentalRequests.length - 1 ? 'border-bottom' : ''}`}>
                    <div className="d-flex align-items-start">
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0">{request.equipment__name || 'Equipment'}</h6>
                          <Badge bg={
                            request.status === 'approved' ? 'success' : 
                            request.status === 'rejected' ? 'danger' : 'warning'
                          }>
                            {request.status}
                          </Badge>
                        </div>
                        
                        <p className="text-muted small mb-1">👤 {request.farmer__username}</p>
                        
                        {request.equipment__price_per_day && (
                          <p className="text-success small mb-1"><strong>SSP {request.equipment__price_per_day}/day</strong></p>
                        )}
                        
                        {request.operation_location && (
                          <p className="text-muted small mb-1">📍 {request.operation_location}</p>
                        )}
                        
                        {request.message && (
                          <p className="text-muted small mb-2">{request.message.length > 60 ? `${request.message.substring(0, 60)}...` : request.message}</p>
                        )}
                        
                        {request.status === 'pending' && (
                          <div className="d-flex gap-2 mt-2">
                            <Button 
                              variant="success" 
                              size="sm"
                              onClick={() => handleApproveRental(request.id, request.equipment__name)}
                              disabled={loading}
                              className="flex-fill"
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleRejectRental(request.id, request.equipment__name)}
                              disabled={loading}
                              className="flex-fill"
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        
                        {request.status !== 'pending' && (
                          <div className="mt-2">
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => handleDeleteRentalRequest(request.id, request.equipment__name)}
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

      {/* Edit Equipment Modal */}
      {showEditModal && editingEquipment && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
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
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Hourly Rate</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={editForm.hourly_rate}
                  onChange={(e) => setEditForm({...editForm, hourly_rate: e.target.value})}
                />
              </Form.Group>
              
              <Form.Check
                type="checkbox"
                label="Available for rent"
                checked={editForm.available}
                onChange={(e) => setEditForm({...editForm, available: e.target.checked})}
                className="mb-3"
              />
              
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Equipment'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}

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
