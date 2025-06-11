"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../context/UserContext"
import { Link } from "react-router-dom"
import Footer from "../components/Footer"
import "../TransporterDashboard.css"

const BuyerDashboard = () => {
  const { user, logout } = useAuth()
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all available products
        const productsResponse = await axios.get("http://localhost:8000/api/products/")
        setProducts(productsResponse.data)

        // Fetch buyer's orders
        const ordersResponse = await axios.get("http://localhost:8000/api/products/my_orders/")
        setOrders(ordersResponse.data)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching buyer data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = () => {
    logout()
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true
    return matchesSearch && matchesCategory && product.is_available
  })

  const categories = ["vegetables", "fruits", "grains", "livestock", "dairy", "other"]

  const handleOrderProduct = async (productId) => {
    try {
      // Navigate to product detail page or open a modal for order details
      window.location.href = `/product/${productId}`
    } catch (error) {
      console.error("Error ordering product:", error)
      alert("Failed to process order. Please try again.")
    }
  }

  return (
    <div className="transporter-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <span className="logo-icon">🌱</span>
            <span>Smart Farm Connect</span>
          </Link>
          <h1>Buyer Dashboard</h1>
        </div>
        <div className="user-info">
          <span>
            Welcome, {user.first_name} {user.last_name}
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-nav">
        <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
          <span className="nav-icon">📊</span>
          Dashboard
        </button>
        <button className={activeTab === "marketplace" ? "active" : ""} onClick={() => setActiveTab("marketplace")}>
          <span className="nav-icon">🛒</span>
          Marketplace
        </button>
        <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
          <span className="nav-icon">📦</span>
          My Orders
        </button>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading marketplace data...</p>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && (
              <div className="dashboard-overview">
                <div className="welcome-section">
                  <h2>Welcome back, {user.first_name}! 👋</h2>
                  <p>Discover fresh products from local farmers</p>
                </div>

                <div className="stats-grid">
                  <div className="stat-card products-card">
                    <div className="stat-icon">🌾</div>
                    <div className="stat-content">
                      <h3>Available Products</h3>
                      <div className="stat-number">{products.filter((p) => p.is_available).length}</div>
                      <p>Fresh products available</p>
                      <button className="stat-action-btn" onClick={() => setActiveTab("marketplace")}>
                        Browse Products
                      </button>
                    </div>
                  </div>

                  <div className="stat-card orders-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-content">
                      <h3>My Orders</h3>
                      <div className="stat-number">{orders.length}</div>
                      <p>Total orders placed</p>
                      <button className="stat-action-btn" onClick={() => setActiveTab("orders")}>
                        View Orders
                      </button>
                    </div>
                  </div>

                  <div className="stat-card pending-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                      <h3>Pending Orders</h3>
                      <div className="stat-number">{orders.filter((o) => o.status === "pending").length}</div>
                      <p>Awaiting processing</p>
                      <button className="stat-action-btn" onClick={() => setActiveTab("orders")}>
                        View Pending
                      </button>
                    </div>
                  </div>
                </div>

                <div className="recent-activity">
                  <h3>📈 Recent Activity</h3>
                  <div className="activity-list">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="activity-item">
                        <div className="activity-content">
                          <p>
                            Order #{order.id} - <strong>{order.product_details?.name || "Unknown Product"}</strong>
                          </p>
                          <span className={`activity-status status-${order.status}`}>{order.status}</span>
                        </div>
                        <span className="activity-date">{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <div className="empty-state">
                        <p>No recent activity. Start by browsing our marketplace!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "marketplace" && (
              <div className="marketplace-section">
                <div className="section-header">
                  <h2>🛒 Marketplace</h2>
                  <div className="filter-container">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="category-select"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="products-grid">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div key={product.id} className="product-card">
                        <div className="product-image">
                          {product.image ? (
                            <img src={product.image || "/placeholder.svg"} alt={product.name} />
                          ) : (
                            <div className="placeholder-image">🌾</div>
                          )}
                        </div>
                        <div className="product-details">
                          <h3>{product.name}</h3>
                          <span className="product-category">{product.category}</span>
                          <p className="product-description">{product.description.substring(0, 100)}...</p>
                          <div className="product-meta">
                            <span className="product-price">
                              ${product.price} per {product.unit}
                            </span>
                            <span className="product-quantity">
                              Available: {product.quantity} {product.unit}
                            </span>
                          </div>
                          <p className="product-farmer">👨‍🌾 {product.farmer_details?.username || "Unknown"}</p>
                          <p className="product-location">📍 {product.location}</p>
                          <button className="order-btn" onClick={() => handleOrderProduct(product.id)}>
                            🛒 Order Now
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">🌾</div>
                      <h3>No Products Found</h3>
                      <p>Try adjusting your search criteria or check back later for new products.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="orders-section">
                <h2>📦 My Orders</h2>
                <div className="orders-grid">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <h3>Order #{order.id}</h3>
                          <span className={`status-badge status-${order.status}`}>{order.status}</span>
                        </div>
                        <div className="order-details">
                          <p>
                            <strong>Product:</strong> {order.product_details?.name || "Unknown"}
                          </p>
                          <p>
                            <strong>Quantity:</strong> {order.quantity} {order.product_details?.unit || "units"}
                          </p>
                          <p>
                            <strong>Total Price:</strong> ${order.total_price}
                          </p>
                          <p>
                            <strong>Seller:</strong> {order.product_details?.farmer_details?.username || "Unknown"}
                          </p>
                          <p>
                            <strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Delivery Address:</strong> {order.delivery_address}
                          </p>
                        </div>
                        <div className="order-actions">
                          {order.status === "pending" && <button className="cancel-btn">❌ Cancel Order</button>}
                          {order.status === "delivered" && <button className="review-btn">⭐ Leave Review</button>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📦</div>
                      <h3>No Orders Yet</h3>
                      <p>Start shopping in our marketplace to see your orders here!</p>
                      <button className="add-btn" onClick={() => setActiveTab("marketplace")}>
                        🛒 Browse Products
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default BuyerDashboard
