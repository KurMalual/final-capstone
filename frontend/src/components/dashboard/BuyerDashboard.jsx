import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Toast, ToastContainer } from 'react-bootstrap';
import { marketplaceAPI } from '../../services/api';

const BuyerDashboard = ({ data, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  if (!data) return null;

  const { profile } = data;

  const showNotification = (message, variant = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleOrderProduct = async (productId, productName) => {
    try {
      setLoading(true);
      await marketplaceAPI.createOrder({
        product: productId,
        quantity: 1,
        message: `Order for ${productName}`
      });
      showNotification(`✅ Order placed for ${productName}!`, 'success');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error placing order:', error);
      showNotification('❌ Failed to place order', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId, productName) => {
    if (window.confirm(`Are you sure you want to delete your order for "${productName}"?`)) {
      try {
        setLoading(true);
        await marketplaceAPI.deleteOrder(orderId);
        showNotification(`✅ Order for ${productName} deleted successfully!`, 'success');
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Error deleting order:', error);
        showNotification('❌ Failed to delete order', 'danger');
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
          <Card className="bg-primary text-white">
            <Card.Body>
              <h2>Welcome Back, {profile?.first_name || profile?.username}! 🛒</h2>
              <p className="mb-0">Find fresh products from local farmers</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card className="h-100 text-center">
            <Card.Body>
              <h3 className="text-success">📦 {data.available_products?.length || 0}</h3>
              <p className="mb-0">Available Products</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card className="h-100 text-center">
            <Card.Body>
              <h3 className="text-info">📋 {data.my_orders?.length || 0}</h3>
              <p className="mb-0">My Orders</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Available Products */}
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">📦 Fresh Products Available</h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {data.available_products?.length > 0 ? (
                <Row>
                  {data.available_products.slice(0, 6).map((product) => (
                    <Col md={6} key={product.id} className="mb-3">
                      <Card className="h-100">
                        <Card.Body>
                          <h6>{product.name}</h6>
                          <p className="text-muted mb-1">by {product.farmer__username}</p>
                          <p className="text-success fw-bold">${product.price}</p>
                          <Button 
                            variant="success" 
                            size="sm" 
                            className="w-100"
                            disabled={loading}
                            onClick={() => handleOrderProduct(product.id, product.name)}
                          >
                            Order Now
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <p className="text-muted text-center">No products available</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* My Orders */}
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">📋 My Orders</h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {data.my_orders?.length > 0 ? (
                data.my_orders.map((order) => (
                  <Card key={order.id} className="dashboard-item">
                    <Card.Body>
                      <div className="mb-2">
                        <h6 className="mb-1 fw-bold">{order.product__name}</h6>
                        {order.quantity && order.product__price && (
                          <small className="text-success fw-semibold">
                            {order.quantity} × ${order.product__price} = ${(order.quantity * order.product__price).toFixed(2)}
                          </small>
                        )}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          {new Date(order.created_at).toLocaleDateString()}
                        </small>
                        <div className="d-flex align-items-center gap-2">
                          <Badge bg={
                            order.status === 'approved' ? 'success' : 
                            order.status === 'rejected' ? 'danger' : 'warning'
                          }>
                            {order.status === 'approved' ? '✅ Approved' :
                             order.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                          </Badge>
                          {(order.status === 'approved' || order.status === 'rejected') && (
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id, order.product__name)}
                              disabled={loading}
                              title="Delete this order"
                            >
                              🗑️
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <div className="dashboard-empty-state">
                  <p className="mb-0">No orders yet</p>
                </div>
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

export default BuyerDashboard;
