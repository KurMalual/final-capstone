import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { marketplaceAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import ImageUpload from '../components/ImageUpload';

const Marketplace = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    available: true,
    image: null
  });
  
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    available: true,
    image: null
  });
  
  const [orderForm, setOrderForm] = useState({
    quantity: '',
    message: ''
  });

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      
      // Debug: Log FormData contents
      console.log('Sending Product FormData with:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      await marketplaceAPI.createProduct(formData);
      setSuccess('Product added successfully!');
      setShowAddModal(false);
      setProductForm({ 
        name: '', 
        description: '', 
        price: '', 
        quantity: '', 
        category: '', 
        available: true,
        image: null
      });
      loadData();
    } catch (error) {
      console.error('Failed to add product - Full error:', error);
      console.error('Error response:', error.response?.data);
      setError('Failed to add product');
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

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      available: product.available,
      image: null
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      formData.append('price', editForm.price);
      formData.append('quantity', editForm.quantity);
      formData.append('category', editForm.category);
      formData.append('available', editForm.available);
      
      if (editForm.image) {
        formData.append('image', editForm.image);
      }
      
      await marketplaceAPI.updateProduct(editingProduct.id, formData);
      setSuccess('Product updated successfully!');
      setShowEditModal(false);
      setEditingProduct(null);
      loadData();
    } catch (error) {
      console.error('Failed to update product:', error);
      setError('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await marketplaceAPI.deleteProduct(productId);
        setSuccess(`Product "${productName}" deleted successfully!`);
        loadData();
      } catch (error) {
        console.error('Failed to delete product:', error);
        setError('Failed to delete product');
      }
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
                    {product.image && (
                      <Card.Img
                        variant="top"
                        src={product.image}
                        alt={product.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
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
                        <strong>Price:</strong> SSP{product.price}
                      </div>
                      <div className="mb-3">
                        <strong>Quantity:</strong> {product.quantity || 'N/A'}
                      </div>
                      <div className="d-flex flex-column gap-2">
                        {isBuyer && product.available && (
                          <Button 
                            variant="primary" 
                            onClick={() => openOrderModal(product)}
                            className="w-100"
                          >
                            Place Order
                          </Button>
                        )}
                        {user?.id === product.farmer && (
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-warning" 
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                              className="flex-fill"
                            >
                              ✏️ Edit
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="flex-fill"
                            >
                              🗑️ Delete
                            </Button>
                          </div>
                        )}
                      </div>
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
            <h4>{isFarmer ? 'Product Orders' : 'My Orders'} ({orders.length} total)</h4>
            <Row>
              {orders.map((order) => (
                <Col md={12} lg={6} key={order.id} className="mb-3">
                  <Card className="shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-start">
                        {/* Product Image or Fallback */}
                        <div className="me-3 flex-shrink-0">
                          {order.product_image ? (
                            <img
                              src={order.product_image}
                              alt={order.product_name || 'Product'}
                              style={{ 
                                width: '180px', 
                                height: '180px', 
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
                          
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-0 fw-bold">Order #{order.id}</h6>
                            <Badge bg={
                              order.status === 'approved' ? 'success' : 
                              order.status === 'rejected' ? 'danger' : 'warning'
                            }>
                              {order.status}
                            </Badge>
                          </div>
                          
                          <div className="small text-muted mb-2">
                            <div className="d-flex justify-content-between">
                              <span>🛍️ {order.product_name || 'Product'}</span>
                              {order.product_price && (
                                <span className="fw-semibold text-success">Unit: SSP{order.product_price}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="small mb-2">
                            <div><strong>📦 Quantity:</strong> {order.quantity}</div>
                            {order.total_price && (
                              <div><strong>💰 Total Price:</strong> SSP{order.total_price}</div>
                            )}
                          </div>
                          
                          {order.message && (
                            <div className="small mb-2 text-muted">
                              <strong>Message:</strong> {order.message.length > 80 ? order.message.substring(0, 80) + '...' : order.message}
                            </div>
                          )}
                          
                          {isFarmer && order.status === 'pending' && (
                            <div className="d-flex gap-2 mt-3">
                              <Button 
                                variant="success" 
                                size="sm"
                                onClick={() => handleApproveOrder(order.id)}
                                className="px-3"
                              >
                                ✅ Approve
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm"
                                onClick={() => handleRejectOrder(order.id)}
                                className="px-3"
                              >
                                ❌ Reject
                              </Button>
                            </div>
                          )}
                          
                          {/* Display payment method for product orders */}
                          {order.status === 'approved' && (
                            <div className="small mb-2">
                              <strong>Payment Method:</strong> {order.payment_method}
                            </div>
                          )}
                        </div>
                      </div>
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
              <Form.Label>Price (SSP)</Form.Label>
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
            
            <ImageUpload
              onImageSelect={(file) => setProductForm({...productForm, image: file})}
              placeholder="Upload Product Image"
            />
            
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
                <p><strong>Price:</strong> SSP{selectedProduct.price}</p>
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

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateProduct}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
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
                  <Form.Label>Price (SSP)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.quantity}
                    onChange={(e) => setEditForm({...editForm, quantity: e.target.value})}
                    placeholder="e.g., 100 kg, 50 pieces"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                placeholder="Describe your product..."
              />
            </Form.Group>
            
            <ImageUpload
              onImageSelect={(file) => setEditForm({...editForm, image: file})}
              placeholder="Update Product Image (Optional)"
            />
            
            <Form.Check
              type="checkbox"
              label="Available for sale"
              checked={editForm.available}
              onChange={(e) => setEditForm({...editForm, available: e.target.checked})}
              className="mb-3"
            />
            
            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update Product
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Marketplace;
