"use client"

import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/UserContext"
import Footer from "../components/Footer"

const FarmerDashboard = () => {
  const { user, logout } = useAuth()
  const [weatherData, setWeatherData] = useState(null)
  const [products, setProducts] = useState([])
  const [equipmentList, setEquipmentList] = useState([])
  const [transportList, setTransportList] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showRequestTransport, setShowRequestTransport] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "vegetables",
    description: "",
    price: "",
    quantity: "",
    unit: "kg",
    location: user?.location || "",
    harvest_date: new Date().toISOString().split("T")[0],
    image: null,
  })
  const [transportRequest, setTransportRequest] = useState({
    pickup_location: user?.location || "",
    delivery_location: "",
    cargo_description: "",
    weight: "",
    pickup_date: "",
    budget: "",
  })

  const [educationalVideos, setEducationalVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)

      // Fetch real weather data for South Sudan
      const weatherResponse = await axios.get(
        `http://localhost:8000/api/weather/data/current/?location=${user?.location || "Juba"}`,
      )
      setWeatherData(weatherResponse.data)

      // Fetch farmer's products
      const productsResponse = await axios.get("http://localhost:8000/api/products/my_products/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setProducts(productsResponse.data)

      // Fetch available equipment
      const equipmentResponse = await axios.get("http://localhost:8000/api/equipment/")
      setEquipmentList(equipmentResponse.data)

      // Fetch available transport services
      const transportResponse = await axios.get("http://localhost:8000/api/transports/available_jobs/")
      setTransportList(transportResponse.data)

      // Fetch orders for farmer's products
      const ordersResponse = await axios.get("http://localhost:8000/api/products/orders/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setOrders(ordersResponse.data)

      // Add this right before the educational videos fetch
      console.log("🎥 Fetching educational videos...")

      // Fetch educational videos
      try {
        const videosResponse = await axios.get("http://localhost:8000/api/education/videos/")
        console.log("🎥 Videos API Response:", videosResponse.data)
        setEducationalVideos(videosResponse.data)
        console.log("🎥 Videos set in state:", videosResponse.data.length, "videos")
      } catch (error) {
        console.error("🎥 Error fetching videos:", error)
        console.error("🎥 Error details:", error.response?.data)
      }

      setLoading(false)
    } catch (error) {
      console.error("Error fetching farmer data:", error)
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user, fetchData])

  const handleLogout = () => {
    logout()
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("name", newProduct.name)
    formData.append("category", newProduct.category)
    formData.append("description", newProduct.description)
    formData.append("price", newProduct.price)
    formData.append("quantity", newProduct.quantity)
    formData.append("unit", newProduct.unit)
    formData.append("location", newProduct.location)
    formData.append("harvest_date", newProduct.harvest_date)
    if (newProduct.image) {
      formData.append("image", newProduct.image)
    }

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post("http://localhost:8000/api/products/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      setProducts([...products, response.data])
      setNewProduct({
        name: "",
        category: "vegetables",
        description: "",
        price: "",
        quantity: "",
        unit: "kg",
        location: user?.location || "",
        harvest_date: new Date().toISOString().split("T")[0],
        image: null,
      })
      setShowAddProduct(false)
      alert("Product added successfully!")
    } catch (error) {
      console.error("Error adding product:", error)
      alert("Failed to add product. Please check all fields and try again.")
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setNewProduct({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      unit: product.unit,
      location: product.location,
      harvest_date: product.harvest_date,
      image: null,
    })
    setShowAddProduct(true)
  }

  const handleUpdateProduct = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("name", newProduct.name)
    formData.append("category", newProduct.category)
    formData.append("description", newProduct.description)
    formData.append("price", newProduct.price)
    formData.append("quantity", newProduct.quantity)
    formData.append("unit", newProduct.unit)
    formData.append("location", newProduct.location)
    formData.append("harvest_date", newProduct.harvest_date)
    if (newProduct.image) {
      formData.append("image", newProduct.image)
    }

    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(`http://localhost:8000/api/products/${editingProduct.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      setProducts(products.map((p) => (p.id === editingProduct.id ? response.data : p)))
      setNewProduct({
        name: "",
        category: "vegetables",
        description: "",
        price: "",
        quantity: "",
        unit: "kg",
        location: user?.location || "",
        harvest_date: new Date().toISOString().split("T")[0],
        image: null,
      })
      setEditingProduct(null)
      setShowAddProduct(false)
      alert("Product updated successfully!")
    } catch (error) {
      console.error("Error updating product:", error)
      alert("Failed to update product. Please try again.")
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`http://localhost:8000/api/products/${productId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setProducts(products.filter((p) => p.id !== productId))
        alert("Product deleted successfully!")
      } catch (error) {
        console.error("Error deleting product:", error)
        alert("Failed to delete product. Please try again.")
      }
    }
  }

  const handleTransportRequest = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        "http://localhost:8000/api/transports/",
        {
          ...transportRequest,
          requester: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      alert("Transport request submitted successfully!")
      setTransportRequest({
        pickup_location: user?.location || "",
        delivery_location: "",
        cargo_description: "",
        weight: "",
        pickup_date: "",
        budget: "",
      })
      setShowRequestTransport(false)
      fetchData() // Refresh data
    } catch (error) {
      console.error("Error requesting transport:", error)
      alert("Failed to submit transport request. Please try again.")
    }
  }

  const handleHireTransport = async (transportId) => {
    if (window.confirm("Are you sure you want to hire this transport service?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.post(
          `http://localhost:8000/api/transports/${transportId}/accept/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        alert("Transport service hired successfully!")
        fetchData() // Refresh data
      } catch (error) {
        console.error("Error hiring transport:", error)
        alert("Failed to hire transport service. Please try again.")
      }
    }
  }

  const handleEquipmentRental = async (equipmentId) => {
    const startDate = prompt("Enter start date (YYYY-MM-DD):")
    const endDate = prompt("Enter end date (YYYY-MM-DD):")

    if (startDate && endDate) {
      try {
        const equipment = equipmentList.find((eq) => eq.id === equipmentId)
        const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
        const totalCost = days * equipment.daily_rate

        const token = localStorage.getItem("token")
        const response = await axios.post(
          "http://localhost:8000/api/equipment/rentals/",
          {
            equipment: equipmentId,
            renter: user.id,
            start_date: startDate,
            end_date: endDate,
            total_cost: totalCost,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        alert("Equipment rental request submitted successfully!")
        fetchData() // Refresh data
      } catch (error) {
        console.error("Error requesting equipment rental:", error)
        alert("Failed to submit equipment rental request. Please try again.")
      }
    }
  }

  const getWeatherIcon = (condition) => {
    if (!condition) return "🌤️"
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) return "🌧️"
    if (conditionLower.includes("cloud")) return "☁️"
    if (conditionLower.includes("sun") || conditionLower.includes("clear")) return "☀️"
    if (conditionLower.includes("storm")) return "⛈️"
    return "🌤️"
  }

  return (
    <div className="farmer-dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <Link to="/" className="home-link">
            <span className="logo-icon">🌱</span>
            Smart Farm Connect
          </Link>
          <h1>Farmer Dashboard</h1>
        </div>
        <div className="user-info">
          <span>
            Welcome, {user?.first_name} {user?.last_name}
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-nav">
        <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
          📊 Dashboard
        </button>
        <button className={activeTab === "weather" ? "active" : ""} onClick={() => setActiveTab("weather")}>
          🌤️ Weather
        </button>
        <button className={activeTab === "marketplace" ? "active" : ""} onClick={() => setActiveTab("marketplace")}>
          🛒 My Products
        </button>
        <button className={activeTab === "equipment" ? "active" : ""} onClick={() => setActiveTab("equipment")}>
          🚜 Equipment
        </button>
        <button className={activeTab === "transport" ? "active" : ""} onClick={() => setActiveTab("transport")}>
          🚛 Transportation
        </button>
        <button className={activeTab === "education" ? "active" : ""} onClick={() => setActiveTab("education")}>
          📚 Education
        </button>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && (
              <div className="dashboard-overview">
                <h2>Welcome to Your Farm Dashboard</h2>

                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <h3>My Products</h3>
                    <div className="stat-number">{products.length}</div>
                    <button onClick={() => setActiveTab("marketplace")}>Manage Products</button>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <h3>Orders</h3>
                    <div className="stat-number">{orders.length}</div>
                    <button onClick={() => setActiveTab("marketplace")}>View Orders</button>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🚜</div>
                    <h3>Equipment Available</h3>
                    <div className="stat-number">{equipmentList.length}</div>
                    <button onClick={() => setActiveTab("equipment")}>Browse Equipment</button>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🚛</div>
                    <h3>Transport Services</h3>
                    <div className="stat-number">{transportList.length}</div>
                    <button onClick={() => setActiveTab("transport")}>View Services</button>
                  </div>
                </div>

                {weatherData && (
                  <div className="weather-summary">
                    <h3>🌤️ Current Weather in {user?.location || "Your Area"}</h3>
                    <div className="weather-info">
                      <div className="weather-main">
                        <span className="weather-icon">{getWeatherIcon(weatherData.weather_condition)}</span>
                        <div>
                          <div className="weather-temp">{Math.round(weatherData.temperature || 0)}°C</div>
                          <div className="weather-condition">{weatherData.weather_condition || "Clear"}</div>
                        </div>
                      </div>
                      <div className="weather-details">
                        <p>
                          <strong>Humidity:</strong> {weatherData.humidity || 0}%
                        </p>
                        <p>
                          <strong>Wind Speed:</strong> {Math.round(weatherData.wind_speed || 0)} km/h
                        </p>
                        <p>
                          <strong>Rainfall:</strong> {weatherData.rainfall || 0}mm
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="quick-actions">
                  <h3>Quick Actions</h3>
                  <div className="action-buttons">
                    <button className="action-btn" onClick={() => setShowAddProduct(true)}>
                      ➕ Add New Product
                    </button>
                    <button className="action-btn" onClick={() => setActiveTab("weather")}>
                      🌤️ Check Weather
                    </button>
                    <button className="action-btn" onClick={() => setShowRequestTransport(true)}>
                      🚛 Request Transport
                    </button>
                    <button className="action-btn" onClick={() => setActiveTab("education")}>
                      📚 Learn Farming
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "weather" && (
              <div className="weather-section">
                <h2>🌤️ Weather Information</h2>
                {weatherData ? (
                  <div className="weather-dashboard">
                    <div className="weather-card main-weather">
                      <div className="weather-header">
                        <h3>Current Weather in {user?.location || "Juba"}</h3>
                        <span className="weather-icon">{getWeatherIcon(weatherData.weather_condition)}</span>
                      </div>
                      <div className="weather-main-info">
                        <div className="temperature">{Math.round(weatherData.temperature || 0)}°C</div>
                        <div className="condition">{weatherData.weather_condition || "Clear Sky"}</div>
                        <div className="last-updated">
                          Last updated: {new Date(weatherData.date || Date.now()).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="weather-details-grid">
                      <div className="weather-detail-card">
                        <div className="detail-icon">💧</div>
                        <div className="detail-info">
                          <span className="detail-label">Humidity</span>
                          <span className="detail-value">{weatherData.humidity || 0}%</span>
                        </div>
                      </div>

                      <div className="weather-detail-card">
                        <div className="detail-icon">🌧️</div>
                        <div className="detail-info">
                          <span className="detail-label">Rainfall</span>
                          <span className="detail-value">{weatherData.rainfall || 0}mm</span>
                        </div>
                      </div>

                      <div className="weather-detail-card">
                        <div className="detail-icon">💨</div>
                        <div className="detail-info">
                          <span className="detail-label">Wind Speed</span>
                          <span className="detail-value">{Math.round(weatherData.wind_speed || 0)} km/h</span>
                        </div>
                      </div>

                      <div className="weather-detail-card">
                        <div className="detail-icon">🌡️</div>
                        <div className="detail-info">
                          <span className="detail-label">Feels Like</span>
                          <span className="detail-value">{Math.round((weatherData.temperature || 0) + 2)}°C</span>
                        </div>
                      </div>
                    </div>

                    <div className="farming-tips">
                      <h3>🌾 Today's Farming Tips</h3>
                      <div className="tips-grid">
                        {weatherData.temperature > 30 && (
                          <div className="tip-card">
                            <div className="tip-icon">🌡️</div>
                            <div className="tip-content">
                              <h4>High Temperature Alert</h4>
                              <p>Consider watering crops early morning or late evening to avoid heat stress.</p>
                            </div>
                          </div>
                        )}

                        {weatherData.rainfall > 5 && (
                          <div className="tip-card">
                            <div className="tip-icon">🌧️</div>
                            <div className="tip-content">
                              <h4>Rainy Weather</h4>
                              <p>Good time for planting. Ensure proper drainage to prevent waterlogging.</p>
                            </div>
                          </div>
                        )}

                        {weatherData.humidity < 40 && (
                          <div className="tip-card">
                            <div className="tip-icon">💧</div>
                            <div className="tip-content">
                              <h4>Low Humidity</h4>
                              <p>Monitor crops for signs of water stress and increase irrigation if needed.</p>
                            </div>
                          </div>
                        )}

                        <div className="tip-card">
                          <div className="tip-icon">🌱</div>
                          <div className="tip-content">
                            <h4>General Tip</h4>
                            <p>Check your crops regularly and maintain proper soil moisture levels.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="weather-error">
                    <p>Unable to fetch weather data. Please check your internet connection.</p>
                    <button onClick={fetchData} className="retry-btn">
                      Retry
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "marketplace" && (
              <div className="marketplace-section">
                <div className="section-header">
                  <h2>🛒 My Products</h2>
                  <button className="add-product-btn" onClick={() => setShowAddProduct(true)}>
                    ➕ Add New Product
                  </button>
                </div>

                {showAddProduct && (
                  <div className="modal-overlay">
                    <div className="modal">
                      <div className="modal-header">
                        <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                        <button
                          className="close-btn"
                          onClick={() => {
                            setShowAddProduct(false)
                            setEditingProduct(null)
                            setNewProduct({
                              name: "",
                              category: "vegetables",
                              description: "",
                              price: "",
                              quantity: "",
                              unit: "kg",
                              location: user?.location || "",
                              harvest_date: new Date().toISOString().split("T")[0],
                              image: null,
                            })
                          }}
                        >
                          ×
                        </button>
                      </div>
                      <form onSubmit={editingProduct ? handleUpdateProduct : handleProductSubmit}>
                        <div className="form-group">
                          <label>Product Name *</label>
                          <input
                            type="text"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            required
                            placeholder="e.g., Fresh Tomatoes"
                          />
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Category *</label>
                            <select
                              value={newProduct.category}
                              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            >
                              <option value="vegetables">🥬 Vegetables</option>
                              <option value="fruits">🍎 Fruits</option>
                              <option value="grains">🌾 Grains</option>
                              <option value="livestock">🐄 Livestock</option>
                              <option value="dairy">🥛 Dairy</option>
                              <option value="other">📦 Other</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Unit *</label>
                            <select
                              value={newProduct.unit}
                              onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                            >
                              <option value="kg">Kilograms (kg)</option>
                              <option value="tons">Tons</option>
                              <option value="pieces">Pieces</option>
                              <option value="liters">Liters</option>
                              <option value="bags">Bags</option>
                            </select>
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Description *</label>
                          <textarea
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            rows="3"
                            required
                            placeholder="Describe your product quality, farming methods, etc."
                          />
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Price per {newProduct.unit} (USD) *</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                              required
                              placeholder="0.00"
                            />
                          </div>
                          <div className="form-group">
                            <label>Quantity Available *</label>
                            <input
                              type="number"
                              min="1"
                              value={newProduct.quantity}
                              onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                              required
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Location *</label>
                            <input
                              type="text"
                              value={newProduct.location}
                              onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                              required
                              placeholder="e.g., Juba, Central Equatoria"
                            />
                          </div>
                          <div className="form-group">
                            <label>Harvest Date *</label>
                            <input
                              type="date"
                              value={newProduct.harvest_date}
                              onChange={(e) => setNewProduct({ ...newProduct, harvest_date: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Product Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                          />
                          <small>Upload a clear photo of your product (optional)</small>
                        </div>

                        <div className="modal-actions">
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddProduct(false)
                              setEditingProduct(null)
                            }}
                          >
                            Cancel
                          </button>
                          <button type="submit" className="btn-primary">
                            {editingProduct ? "Update Product" : "Add Product"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                <div className="products-list">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <div key={product.id} className="product-item">
                        <div className="product-image">
                          {product.image ? (
                            <img src={product.image || "/placeholder.svg"} alt={product.name} />
                          ) : (
                            <div className="placeholder-image">
                              <span>📦</span>
                            </div>
                          )}
                        </div>
                        <div className="product-info">
                          <h3>{product.name}</h3>
                          <p className="product-category">{product.category}</p>
                          <p className="product-description">{product.description}</p>
                          <div className="product-meta">
                            <span className="product-price">
                              ${product.price} per {product.unit}
                            </span>
                            <span className="product-quantity">
                              Available: {product.quantity} {product.unit}
                            </span>
                          </div>
                          <div className="product-location">📍 {product.location}</div>
                        </div>
                        <div className="product-actions">
                          <button className="edit-btn" onClick={() => handleEditProduct(product)}>
                            ✏️ Edit
                          </button>
                          <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <span className="empty-icon">📦</span>
                      <h3>No Products Yet</h3>
                      <p>Start by adding your first product to the marketplace!</p>
                      <button className="btn-primary" onClick={() => setShowAddProduct(true)}>
                        ➕ Add Your First Product
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "transport" && (
              <div className="transport-section">
                <div className="section-header">
                  <h2>🚛 Transportation Services</h2>
                  <button className="request-btn" onClick={() => setShowRequestTransport(true)}>
                    ➕ Request Transport
                  </button>
                </div>

                {showRequestTransport && (
                  <div className="modal-overlay">
                    <div className="modal">
                      <div className="modal-header">
                        <h3>Request Transportation</h3>
                        <button className="close-btn" onClick={() => setShowRequestTransport(false)}>
                          ×
                        </button>
                      </div>
                      <form onSubmit={handleTransportRequest}>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Pickup Location *</label>
                            <input
                              type="text"
                              value={transportRequest.pickup_location}
                              onChange={(e) =>
                                setTransportRequest({ ...transportRequest, pickup_location: e.target.value })
                              }
                              required
                              placeholder="e.g., Juba Market"
                            />
                          </div>
                          <div className="form-group">
                            <label>Delivery Location *</label>
                            <input
                              type="text"
                              value={transportRequest.delivery_location}
                              onChange={(e) =>
                                setTransportRequest({ ...transportRequest, delivery_location: e.target.value })
                              }
                              required
                              placeholder="e.g., Wau Central Market"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Cargo Description *</label>
                          <textarea
                            value={transportRequest.cargo_description}
                            onChange={(e) =>
                              setTransportRequest({ ...transportRequest, cargo_description: e.target.value })
                            }
                            rows="3"
                            required
                            placeholder="Describe what you need to transport"
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Weight (kg) *</label>
                            <input
                              type="number"
                              min="1"
                              value={transportRequest.weight}
                              onChange={(e) => setTransportRequest({ ...transportRequest, weight: e.target.value })}
                              required
                              placeholder="0"
                            />
                          </div>
                          <div className="form-group">
                            <label>Budget (USD) *</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={transportRequest.budget}
                              onChange={(e) => setTransportRequest({ ...transportRequest, budget: e.target.value })}
                              required
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Pickup Date & Time *</label>
                          <input
                            type="datetime-local"
                            value={transportRequest.pickup_date}
                            onChange={(e) => setTransportRequest({ ...transportRequest, pickup_date: e.target.value })}
                            required
                          />
                        </div>
                        <div className="modal-actions">
                          <button type="button" onClick={() => setShowRequestTransport(false)}>
                            Cancel
                          </button>
                          <button type="submit" className="btn-primary">
                            Submit Request
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                <div className="available-transport">
                  <h3>🚛 Available Transportation Services</h3>
                  {transportList.length > 0 ? (
                    <div className="transport-grid">
                      {transportList.map((transport) => (
                        <div key={transport.id} className="transport-card">
                          <div className="transport-header">
                            <h4>🚛 Transport Service</h4>
                            <span className="transport-status">Available</span>
                          </div>
                          <div className="transport-details">
                            <div className="transport-route">
                              <p>
                                <strong> 📍 From:</strong> {transport.pickup_location}
                              </p>
                              <p>
                                <strong> 📍 To:</strong> {transport.delivery_location}
                              </p>
                            </div>
                            <div className="transport-specs">
                              <p>
                                <strong>⚖️ Capacity:</strong> {transport.weight} kg
                              </p>
                              <p>
                                <strong>💰 Budget:</strong> ${transport.budget}
                              </p>
                              <p>
                                <strong>📅 Date:</strong> {new Date(transport.pickup_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="transport-description">
                              <p>
                                <strong>📦 Cargo:</strong> {transport.cargo_description}
                              </p>
                            </div>
                          </div>
                          <div className="transport-actions">
                            <button className="hire-btn" onClick={() => handleHireTransport(transport.id)}>
                              🤝 Hire Service
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <span className="empty-icon">🚛</span>
                      <h3>No Transport Services Available</h3>
                      <p>
                        No transportation services are currently available. Check back later or request your own
                        transport.
                      </p>
                      <button className="btn-primary" onClick={() => setShowRequestTransport(true)}>
                        ➕ Request Transport
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "equipment" && (
              <div className="equipment-section">
                <h2>🚜 Equipment Rental</h2>
                <div className="available-equipment">
                  <h3>Available Equipment for Rent</h3>
                  {equipmentList.length > 0 ? (
                    <div className="equipment-grid">
                      {equipmentList.map((equipment) => (
                        <div key={equipment.id} className="equipment-card">
                          <div className="equipment-header">
                            <h4>🚜 {equipment.name}</h4>
                            <span
                              className={`equipment-status ${equipment.is_available ? "available" : "unavailable"}`}
                            >
                              {equipment.is_available ? "Available" : "Rented"}
                            </span>
                          </div>
                          <div className="equipment-details">
                            <p>
                              <strong>Type:</strong> {equipment.equipment_type}
                            </p>
                            <p className="equipment-description">{equipment.description}</p>
                            <div className="equipment-pricing">
                              <p>
                                <strong> 💰 Daily Rate:</strong> ${equipment.daily_rate}
                              </p>
                              <p>
                                <strong> 📍 Location:</strong> {equipment.location}
                                <strong> 📍 Location:</strong> {equipment.location}
                              </p>
                              <p>
                                <strong>👤 Owner:</strong> {equipment.owner_details?.username}
                              </p>
                            </div>
                          </div>
                          <div className="equipment-actions">
                            <button
                              className="request-btn"
                              onClick={() => handleEquipmentRental(equipment.id)}
                              disabled={!equipment.is_available}
                            >
                              {equipment.is_available ? "🤝 Rent Equipment" : "❌ Not Available"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <span className="empty-icon">🚜</span>
                      <h3>No Equipment Available</h3>
                      <p>No equipment is currently available for rental. Check back later.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "education" && (
              <div className="education-section">
                <h2>📚 Educational Resources</h2>

                <button
                  onClick={() => {
                    console.log("Manual fetch videos")
                    axios
                      .get("http://localhost:8000/api/education/videos/")
                      .then((response) => {
                        console.log("Videos fetched:", response.data)
                        setEducationalVideos(response.data)
                      })
                      .catch((error) => {
                        console.error("Error fetching videos:", error)
                      })
                  }}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    marginBottom: "20px",
                    cursor: "pointer",
                  }}
                >
                  Refresh Videos
                </button>

                <div
                  style={{
                    background: "#f0f0f0",
                    padding: "10px",
                    margin: "10px 0",
                    borderRadius: "5px",
                  }}
                >
                  <strong>Debug Info:</strong> Found {educationalVideos.length} videos in state
                </div>

                {educationalVideos.length > 0 ? (
                  <div style={{ display: "grid", gap: "20px" }}>
                    <h3>🎥 Educational Videos ({educationalVideos.length} videos found)</h3>
                    {educationalVideos.map((video) => (
                      <div
                        key={video.id}
                        style={{
                          border: "1px solid #ddd",
                          padding: "15px",
                          borderRadius: "8px",
                          backgroundColor: "white",
                        }}
                      >
                        <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>{video.title}</h4>
                        <p style={{ margin: "0 0 10px 0", color: "#666" }}>{video.description}</p>
                        <div style={{ fontSize: "14px", color: "#888" }}>
                          <span>📂 Category: {video.category_name}</span> |<span> ⏱️ Duration: {video.duration}</span> |
                          <span> 👁️ Views: {video.views}</span>
                        </div>
                        {video.video_url && (
                          <div style={{ marginTop: "10px" }}>
                            <a
                              href={video.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#4CAF50", textDecoration: "none" }}
                            >
                              🎬 Watch Video
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <span style={{ fontSize: "48px" }}>🎓</span>
                    <h3>No Educational Videos Yet</h3>
                    <p>Educational videos will appear here once uploaded by administrators.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default FarmerDashboard
