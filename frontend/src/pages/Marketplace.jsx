import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { marketplaceAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Marketplace = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    available: true
  });
  
  const [orderForm, setOrderForm] = useState({
    quantity: '',
    message: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Marketplace page: Loading data for user:', user);
      
      const [productsResponse, ordersResponse] = await Promise.all([
        marketplaceAPI.getProducts(),
        marketplaceAPI.getOrders()
      ]);
      
      console.log('Marketplace page: Products response:', productsResponse.data);
      console.log('Marketplace page: Orders response:', ordersResponse.data);
      
      // Handle paginated API response - data is in 'results' field
      const productsData = productsResponse.data?.results || productsResponse.data || [];
      const ordersData = ordersResponse.data?.results || ordersResponse.data || [];
      
      // Ensure we always set arrays
      setProducts(Array.isArray(productsData) ? productsData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      console.log('Marketplace page: Set products count:', productsData.length);
      console.log('Marketplace page: Set orders count:', ordersData.length);
      setError('');
    } catch (error) {
      setError('Failed to load data');
      console.error('Marketplace page: Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await marketplaceAPI.createProduct(productForm);
      setSuccess('Product added successfully!');
      setShowAddModal(false);
      setProductForm({ name: '', description: '', price: '', quantity: '', category: '', available: true });
      loadData();
    } catch (error) {
      setError('Failed to add product');
      console.error('Failed to add product:', error);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      await marketplaceAPI.createOrder({
        product: selectedProduct.id,
        quantity: parseInt(orderForm.quantity),
        message: orderForm.message
      });
      setSuccess('Order placed successfully!');
      setShowOrderModal(false);
      setOrderForm({ quantity: '', message: '' });
      loadData();
    } catch (error) {
      setError('Failed to place order');
      console.error('Failed to place order:', error);
    }
  };

  const handleApproveOrder = async (id) => {
    try {
      await marketplaceAPI.approveOrder(id);
      setSuccess('Order approved!');
      loadData();
    } catch (error) {
      setError('Failed to approve order');
      console.error('Failed to approve order:', error);
    }
  };

  const handleRejectOrder = async (id) => {
    try {
      await marketplaceAPI.rejectOrder(id);
      setSuccess('Order rejected!');
      loadData();
    } catch (error) {
      setError('Failed to reject order');
      console.error('Failed to reject order:', error);
    }
  };

  const openOrderModal = (product) => {
    setSelectedProduct(product);
    setShowOrderModal(true);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  const isFarmer = user?.role === 'farmer';
  const isBuyer = user?.role === 'buyer';

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>🛒 Agricultural Marketplace</h2>
            {isFarmer && (
              <Button variant="success" onClick={() => setShowAddModal(true)}>
                + Add Product
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      {success && <Alert variant="success" className="mb-3">{success}</Alert>}

      {/* Products Grid */}
      <Row className="mb-4">
        <Col>
          <h4>{isFarmer ? 'My Products' : 'Available Products'}</h4>
          <Row>
            {products.length === 0 ? (
              <Col>
                <Card className="text-center p-4">
                  <Card.Body>
                    <p className="text-muted">No products available</p>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              products.map((product) => (
                <Col md={6} lg={4} key={product.id} className="mb-3">
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>{product.description}</Card.Text>
                      <div className="mb-2">
                        <Badge bg="info">{product.category || 'General'}</Badge>
                      </div>
                      <div className="mb-2">
                        <Badge bg={product.available ? 'success' : 'secondary'}>
                          {product.available ? 'Available' : 'Out of Stock'}
                        </Badge>
                      </div>
                      <div className="mb-2">
                        <strong>Price:</strong> ${product.price}
                      </div>
                      <div className="mb-3">
                        <strong>Quantity:</strong> {product.quantity || 'N/A'}
                      </div>
                      {isBuyer && product.available && (
                        <Button 
                          variant="primary" 
                          onClick={() => openOrderModal(product)}
                          className="w-100"
                        >
                          Place Order
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

      {/* Orders */}
      {orders.length > 0 && (
        <Row>
          <Col>
            <h4>{isFarmer ? 'Product Orders' : 'My Orders'}</h4>
            <Row>
              {orders.map((order) => (
                <Col md={6} lg={4} key={order.id} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>Order #{order.id}</Card.Title>
                      <p><strong>Product:</strong> {order.product_name || 'N/A'}</p>
                      <p><strong>Quantity:</strong> {order.quantity}</p>
                      <p><strong>Status:</strong> 
                        <Badge bg={
                          order.status === 'approved' ? 'success' : 
                          order.status === 'rejected' ? 'danger' : 'warning'
                        } className="ms-2">
                          {order.status}
                        </Badge>
                      </p>
                      <p><strong>Message:</strong> {order.message}</p>
                      
                      {isFarmer && order.status === 'pending' && (
                        <div className="d-flex gap-2">
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => handleApproveOrder(order.id)}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleRejectOrder(order.id)}
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

      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddProduct}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={productForm.category}
                onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
                <option value="livestock">Livestock</option>
                <option value="dairy">Dairy Products</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Price ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={productForm.price}
                onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Quantity Available</Form.Label>
              <Form.Control
                type="text"
                value={productForm.quantity}
                onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
                placeholder="e.g., 100 kg, 50 pieces"
                required
              />
            </Form.Group>
            
            <Form.Check
              type="checkbox"
              label="Available for sale"
              checked={productForm.available}
              onChange={(e) => setProductForm({...productForm, available: e.target.checked})}
              className="mb-3"
            />
            
            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="success" type="submit">
                Add Product
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Order Modal */}
      <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Place Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <div className="mb-3">
                <h5>{selectedProduct.name}</h5>
                <p>{selectedProduct.description}</p>
                <p><strong>Price:</strong> ${selectedProduct.price}</p>
                <p><strong>Available:</strong> {selectedProduct.quantity}</p>
              </div>
              
              <Form onSubmit={handleCreateOrder}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity Needed</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={orderForm.quantity}
                    onChange={(e) => setOrderForm({...orderForm, quantity: e.target.value})}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Message to Farmer</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={orderForm.message}
                    onChange={(e) => setOrderForm({...orderForm, message: e.target.value})}
                    placeholder="Any specific requirements or delivery instructions"
                  />
                </Form.Group>
                
                <div className="d-flex gap-2">
                  <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Place Order
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Marketplace;
