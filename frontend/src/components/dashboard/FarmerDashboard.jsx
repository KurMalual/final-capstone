import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, ListGroup, Alert, Toast, ToastContainer, Modal, Form, Spinner } from 'react-bootstrap';
import { equipmentAPI, transportAPI, marketplaceAPI } from '../../services/api';
import ImageUpload from '../ImageUpload';
import { getImageUrl } from '../../utils/imageUtils';

const FarmerDashboard = ({ data, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  // Add missing state variables
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [rentalForm, setRentalForm] = useState({
    message: '',
    operation_location: ''
  });

  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    available: true,
    image: null
  });

  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductForm, setEditProductForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    available: true,
    image: null
  });

  // Add fallback state for missing data
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (!data) {
      console.warn('No data received for FarmerDashboard.');
      setDashboardData({
        available_equipment: [],
        available_vehicles: [],
        my_products: [],
        my_equipment_rentals: [],
        my_transport_requests: [],
        my_orders: [],
        weather: null,
      });
    } else {
      setDashboardData(data);
    }
  }, [data]);

  if (!dashboardData) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" variant="success" />
        <p>Loading dashboard...</p>
      </Container>
    );
  }

  const { profile, available_equipment, available_vehicles, my_products, my_equipment_rentals, my_transport_requests, my_orders, weather } = dashboardData;

  const stats = {
    availableEquipment: available_equipment?.length || 0,
    availableVehicles: available_vehicles?.length || 0,
    myProducts: my_products?.length || 0,
    myEquipmentRentals: my_equipment_rentals?.length || 0,
    myTransportRequests: my_transport_requests?.length || 0,
    myOrders: my_orders?.length || 0,
  };

  const showNotification = async (message, variant = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleHireEquipment = async (equipmentId, equipmentName) => {
    console.log('FarmerDashboard - handleHireEquipment triggered for:', equipmentName);
    setSelectedEquipment({ id: equipmentId, name: equipmentName });
    setRentalForm({
      message: `Request to hire SSP{equipmentName}`,
      operation_location: ''
    });
    setShowRentalModal(true);
  };

  const handleSubmitRental = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const requestData = {
        equipment: selectedEquipment.id,
        message: rentalForm.message,
        operation_location: rentalForm.operation_location
      };
      
      console.log('Sending rental request data:', requestData);
      
      await equipmentAPI.createRentalRequest(requestData);
      showNotification(`✅ Rental request sent for SSP{selectedEquipment.name}!`, 'success');
      setShowRentalModal(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error hiring equipment:', error);
      showNotification('❌ Failed to send rental request', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestTransport = async (transportId) => {
    try {
      setLoading(true);
      await transportAPI.createTransportRequest({
        transport: transportId,
        message: `Request for transport with SSP{vehicleName}`
      });
      showNotification(`✅ Transport request sent for SSP{vehicleName}!`, 'success');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error requesting transport:', error);
      showNotification('❌ Failed to send transport request', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRentalRequest = async (requestId) => {
    if (window.confirm(`Are you sure you want to cancel your rental request for SSP{equipmentName}?`)) {
      try {
        setLoading(true);
        await equipmentAPI.deleteRentalRequest(requestId);
        showNotification(`✅ Rental request for SSP{equipmentName} cancelled!`, 'success');
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Error cancelling rental request:', error);
        showNotification('❌ Failed to cancel rental request', 'danger');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleApproveOrder = async (orderId) => {
    try {
      setLoading(true);
      await marketplaceAPI.approveOrder(orderId);
      showNotification(`✅ Order for SSP{productName} approved!`, 'success');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error approving order:', error);
      showNotification('❌ Failed to approve order', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTransportRequest = async (requestId) => {
    if (window.confirm(`Are you sure you want to cancel your transport request for SSP{vehicleName}?`)) {
      try {
        setLoading(true);
        await transportAPI.deleteTransportRequest(requestId);
        showNotification(`✅ Transport request for SSP{vehicleName} cancelled!`, 'success');
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Error cancelling transport request:', error);
        showNotification('❌ Failed to cancel transport request', 'danger');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      setLoading(true);
      await marketplaceAPI.rejectOrder(orderId);
      showNotification(`❌ Order for SSP{productName} rejected`, 'warning');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error rejecting order:', error);
      showNotification('❌ Failed to reject order', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('quantity', productForm.quantity);
      formData.append('category', productForm.category);
      formData.append('available', productForm.available);
      
      if (productForm.image) {
        formData.append('image', productForm.image);
      }
      
      await marketplaceAPI.createProduct(formData);
      showNotification('✅ Product added successfully!', 'success');
      setShowAddProductModal(false);
      setProductForm({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: '',
        available: true,
        image: null
      });
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error adding product:', error);
      showNotification('❌ Failed to add product', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      available: product.available,
      image: null // Don't pre-populate image
    });
    setShowEditProductModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', editProductForm.name);
      formData.append('description', editProductForm.description);
      formData.append('price', editProductForm.price);
      formData.append('quantity', editProductForm.quantity);
      formData.append('category', editProductForm.category);
      formData.append('available', editProductForm.available);
      
      if (editProductForm.image) {
        formData.append('image', editProductForm.image);
      }
      
      await marketplaceAPI.updateProduct(editingProduct.id, formData);
      showNotification('✅ Product updated successfully!', 'success');
      setShowEditProductModal(false);
      setEditingProduct(null);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error updating product:', error);
      showNotification('❌ Failed to update product', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm(`Are you sure you want to delete SSP{productName}?`)) {
      try {
        setLoading(true);
        await marketplaceAPI.deleteProduct(productId);
        showNotification(`✅ Product SSP{productName} deleted successfully!`, 'success');
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('❌ Failed to delete product', 'danger');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge bg="success">✅ Approved</Badge>;
      case 'rejected':
        return <Badge bg="danger">❌ Rejected</Badge>;
      case 'pending':
        return <Badge bg="warning">⏳ Pending</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <>
    <Container className="py-4">
      {/* Welcome Header */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-success text-white">
            <Card.Body>
              <h2>Welcome Back, {profile?.first_name || profile?.username}!</h2>
              <p className="mb-0">Here's what's happening on your farm today</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 text-center stats-card">
            <Card.Body>
              <div className="mb-2">
                <i className="bi bi-tools icon-lg text-success"></i>
              </div>
              <h3 className="text-success mb-1">{stats.availableEquipment}</h3>
              <p className="mb-0 text-muted fw-medium">Available Equipment</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 text-center stats-card">
            <Card.Body>
              <div className="mb-2">
                <i className="bi bi-truck icon-lg text-primary"></i>
              </div>
              <h3 className="text-primary mb-1">{stats.availableVehicles}</h3>
              <p className="mb-0 text-muted fw-medium">Available Transport</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 text-center stats-card">
            <Card.Body>
              <div className="mb-2">
                <i className="bi bi-box-seam icon-lg text-warning"></i>
              </div>
              <h3 className="text-warning mb-1">{stats.myProducts}</h3>
              <p className="mb-0 text-muted fw-medium">My Products</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 text-center stats-card">
            <Card.Body>
              <div className="mb-2">
                <i className="bi bi-clipboard-check icon-lg text-info"></i>
              </div>
              <h3 className="text-info mb-1">{stats.myOrders}</h3>
              <p className="mb-0 text-muted fw-medium">Product Orders</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Available Equipment */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card>
            <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Available Equipment</h5>
              <small className="text-white-50">{stats.availableEquipment} items</small>
            </Card.Header>
            <Card.Body style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {available_equipment?.length > 0 ? (
                available_equipment.slice(0, 6).map((equipment) => (
                  <Card key={equipment.id} className="dashboard-item">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1 fw-bold">{equipment.name}</h6>
                          <div className="d-flex flex-column">
                            <small className="text-muted mb-1">by {equipment.owner__username}</small>
                            {equipment.price_per_day && (
                              <small className="text-success fw-semibold">SSP{equipment.price_per_day}/day</small>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="success" 
                          size="sm"
                          onClick={() => handleHireEquipment(equipment.id, equipment.name)}
                          disabled={loading}
                          className="px-3"
                        >
                          {loading ? 'Hiring...' : 'Hire'}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <div className="dashboard-empty-state">
                  <p className="mb-0">No equipment available at the moment</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Available Transport */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card>
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Available Transport</h5>
              <small className="text-white-50">{stats.availableVehicles} vehicles</small>
            </Card.Header>
            <Card.Body style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {available_vehicles?.length > 0 ? (
                available_vehicles.slice(0, 6).map((vehicle) => (
                  <Card key={vehicle.id} className="dashboard-item">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1 fw-bold">{vehicle.vehicle_name || vehicle.vehicle_type}</h6>
                          <div className="d-flex flex-column">
                            <small className="text-muted mb-1">by {vehicle.owner__username}</small>
                            {vehicle.price_per_trip && (
                              <small className="text-success fw-semibold">SSP{vehicle.price_per_trip}/trip</small>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleRequestTransport(vehicle.id, vehicle.vehicle_type)}
                          disabled={loading}
                          className="px-3"
                        >
                          {loading ? 'Requesting...' : 'Request'}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <div className="dashboard-empty-state">
                  <p className="mb-0">No transport available at the moment</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* My Products */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card>
            <Card.Header className="bg-warning text-dark d-flex justify-content-between align-items-center">
              <h5 className="mb-0">My Products</h5>
              <div className="d-flex align-items-center gap-2">
                <small className="text-muted">{stats.myProducts} products</small>
                <Button variant="outline-dark" size="sm" onClick={() => setShowAddProductModal(true)}>
                  + Add Product
                </Button>
              </div>
            </Card.Header>
            <Card.Body style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {my_products?.length > 0 ? (
                my_products.slice(0, 6).map((product) => (
                  <Card key={product.id} className="dashboard-item">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1 fw-bold">{product.name}</h6>
                          <div className="d-flex flex-column">
                            <small className="text-success fw-semibold mb-1">SSP {product.price}</small>
                            <div className="d-flex align-items-center gap-2">
                              <Badge bg={product.available ? 'success' : 'secondary'} className="small">
                                {product.available ? 'Available' : 'Unavailable'}
                              </Badge>
                              {product.quantity && (
                                <small className="text-muted">Qty: {product.quantity}</small>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex gap-1">
                          <Button 
                            variant="warning" 
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                            disabled={loading}
                            title="Edit Product"
                          >
                            ✏️
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            disabled={loading}
                            title="Delete Product"
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <div className="dashboard-empty-state">
                  <p className="mb-2">No products listed yet</p>
                  <Button variant="outline-warning" size="sm" onClick={() => setShowAddProductModal(true)}>
                    Add Your First Product
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card>
            <Card.Header className="bg-info text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Activity</h5>
              <small className="text-white-50">Latest updates</small>
            </Card.Header>
            <Card.Body style={{ maxHeight: '280px', overflowY: 'auto' }}>
              <ListGroup variant="flush">
                {/* Product Orders */}
                {my_orders?.slice(0, 5).map((order) => (
                  <ListGroup.Item key={`order-${order.id}`} className="px-0 py-3 border-bottom">
                    <div className="d-flex align-items-start">
                      {/* Product Image or Fallback */}
                      <div className="me-3 flex-shrink-0">
                        {order.product__image ? (
                          <img
                            src={getImageUrl(order.product__image)}
                            alt={order.product__name || 'Product'}
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
                            display: order.product__image ? 'none' : 'flex'
                          }}
                        >
                          <span style={{ fontSize: '2.5rem', opacity: 0.5 }}></span>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0 fw-bold">Order for {order.product__name || 'Product'}</h6>
                          <Badge bg={
                            order.status === 'approved' ? 'success' : 
                            order.status === 'rejected' ? 'danger' : 'warning'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                        
                        <div className="small text-muted mb-2">
                          <div className="d-flex justify-content-between">
                            <span>👤 {order.buyer__username || 'Buyer'}</span>
                            {order.quantity && order.product__price && (
                              <span className="fw-semibold text-success">
                                {order.quantity} SSP {order.product__price} = SSP{(order.quantity * order.product__price).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {order.status === 'pending' && (
                          <div className="d-flex gap-2 mt-3">
                            <Button 
                              variant="success" 
                              size="sm"
                              onClick={() => handleApproveOrder(order.id, order.product__name)}
                              disabled={loading}
                              className="px-3"
                            >
                              ✅ Approve
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleRejectOrder(order.id, order.product__name)}
                              disabled={loading}
                              className="px-3"
                            >
                              ❌ Reject
                            </Button>
                          </div>
                        )}
                        
                        {order.status !== 'pending' && (
                          <div className="d-flex align-items-center gap-2 mt-2">
                            {getStatusBadge(order.status)}
                          </div>
                        )}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
                
                {/* Equipment Rentals */}
                {my_equipment_rentals?.slice(0, 3).map((rental) => (
                  <ListGroup.Item key={`rental-${rental.id}`} className="px-0 py-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="mb-1">
                          <strong>Equipment: {rental.equipment__name}</strong>
                        </div>
                        <div className="d-flex flex-column">
                          {rental.equipment__price_per_day && (
                            <small className="text-success fw-semibold mb-1">
                              SSP {rental.equipment__price_per_day}/day
                            </small>
                          )}
                          {rental.operation_location && (
                            <small className="text-primary">
                              📍 {rental.operation_location}
                            </small>
                          )}
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {rental.status === 'pending' && (
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleCancelRentalRequest(rental.id, rental.equipment__name)}
                            disabled={loading}
                            title="Cancel request"
                          >
                            ❌ Cancel
                          </Button>
                        )}
                        {getStatusBadge(rental.status)}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
                
                {/* Transport Requests */}
                {my_transport_requests?.slice(0, 2).map((request) => (
                  <ListGroup.Item key={`transport-${request.id}`} className="px-0 py-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="mb-1">
                          <strong>Transport: {request.transport__vehicle_name}</strong>
                        </div>
                        {request.transport__price_per_trip && (
                          <small className="text-success fw-semibold">
                            SSP {request.transport__price_per_trip}/trip
                          </small>
                        )}
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {request.status === 'pending' && (
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleCancelTransportRequest(request.id, request.transport__vehicle_name)}
                            disabled={loading}
                            title="Cancel request"
                          >
                            ❌ Cancel
                          </Button>
                        )}
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              
              {(!my_orders?.length && !my_equipment_rentals?.length && !my_transport_requests?.length) && (
                <div className="dashboard-empty-state">
                  <p className="mb-0">No recent activity to display</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Weather Section */}
      {weather && (
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Header className="bg-light">
                <h5 className="mb-0">Weather Information</h5>
              </Card.Header>
              <Card.Body>
                {weather.error ? (
                  <Alert variant="warning">{weather.error}</Alert>
                ) : (
                  <Row className="text-center">
                    <Col md={3}>
                      <h3>{weather.temperature}°C</h3>
                      <p className="text-muted">{weather.city || weather.location}</p>
                    </Col>
                    <Col md={3}>
                      <h4>{weather.description}</h4>
                    </Col>
                    <Col md={3}>
                      <p>Humidity: {weather.humidity}%</p>
                    </Col>
                    <Col md={3}>
                      <Badge bg="info">Good for farming</Badge>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} bg={toastVariant}>
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === 'success' ? 'Success' : toastVariant === 'danger' ? 'Error' : 'Warning'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Add Product Modal */}
      <Modal show={showAddProductModal} onHide={() => setShowAddProductModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddProduct}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    required
                    placeholder="Enter product name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="grains">Grains</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="dairy">Dairy</option>
                    <option value="meat">Meat</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (USD) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    required
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity *</Form.Label>
                  <Form.Control
                    type="number"
                    value={productForm.quantity}
                    onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
                    required
                    placeholder="Enter quantity"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                placeholder="Describe your product..."
              />
            </Form.Group>
            
            <ImageUpload
              onImageSelect={(file) => setProductForm({...productForm, image: file})}
              placeholder="Upload Product Image"
            />
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Available for sale"
                checked={productForm.available}
                onChange={(e) => setProductForm({...productForm, available: e.target.checked})}
              />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button variant="success" type="submit" disabled={loading}>
                {loading ? 'Adding...' : '✅ Add Product'}
              </Button>
              <Button variant="secondary" onClick={() => setShowAddProductModal(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={showEditProductModal} onHide={() => setShowEditProductModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>✏️ Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateProduct}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={editProductForm.name}
                    onChange={(e) => setEditProductForm({...editProductForm, name: e.target.value})}
                    required
                    placeholder="Enter product name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    value={editProductForm.category}
                    onChange={(e) => setEditProductForm({...editProductForm, category: e.target.value})}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="grains">Grains</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="dairy">Dairy</option>
                    <option value="meat">Meat</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (USD) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={editProductForm.price}
                    onChange={(e) => setEditProductForm({...editProductForm, price: e.target.value})}
                    required
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity *</Form.Label>
                  <Form.Control
                    type="number"
                    value={editProductForm.quantity}
                    onChange={(e) => setEditProductForm({...editProductForm, quantity: e.target.value})}
                    required
                    placeholder="Enter quantity"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editProductForm.description}
                onChange={(e) => setEditProductForm({...editProductForm, description: e.target.value})}
                placeholder="Describe your product..."
              />
            </Form.Group>
            
            <ImageUpload
              onImageSelect={(file) => setEditProductForm({...editProductForm, image: file})}
              placeholder="Update Product Image (Optional)"
            />
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Available for sale"
                checked={editProductForm.available}
                onChange={(e) => setEditProductForm({...editProductForm, available: e.target.checked})}
              />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Updating...' : '✅ Update Product'}
              </Button>
              <Button variant="secondary" onClick={() => setShowEditProductModal(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Equipment Rental Modal */}
      <Modal show={showRentalModal} onHide={() => setShowRentalModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Request Equipment Rental</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitRental}>
          <Modal.Body>
            {selectedEquipment && (
              <Alert variant="info">
                <strong>Equipment:</strong> {selectedEquipment.name}
              </Alert>
            )}
            
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
              <Form.Label>Message (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={rentalForm.message}
                onChange={(e) => setRentalForm({...rentalForm, message: e.target.value})}
                placeholder="Additional details about your rental request..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRentalModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Sending...' : '📝 Send Request'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
    </>
  );
};

export default FarmerDashboard;
