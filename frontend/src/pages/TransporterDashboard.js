"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../context/UserContext"
import { Link } from "react-router-dom"
import Footer from "../components/Footer"
import "../TransporterDashboard.css"

const TransporterDashboard = () => {
  const { user, logout } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [transportRequests, setTransportRequests] = useState([])
  const [activeJobs, setActiveJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [newVehicle, setNewVehicle] = useState({
    vehicle_type: "",
    capacity: "",
    description: "",
    rate_per_km: "",
    location: "",
    image: null,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }

      const [vehiclesRes, requestsRes, jobsRes] = await Promise.all([
        axios
          .get("http://localhost:8000/api/transports/vehicles/my_vehicles/", { headers })
          .catch(() => ({ data: [] })),
        axios.get("http://localhost:8000/api/transports/requests/", { headers }).catch(() => ({ data: [] })),
        axios.get("http://localhost:8000/api/transports/available_jobs/", { headers }).catch(() => ({ data: [] })),
      ])

      console.log("🚛 Fetched transport data:", vehiclesRes.data)

      // Ensure data is always an array
      setVehicles(Array.isArray(vehiclesRes.data) ? vehiclesRes.data : [])
      setTransportRequests(Array.isArray(requestsRes.data) ? requestsRes.data : [])
      setActiveJobs(Array.isArray(jobsRes.data) ? jobsRes.data : [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      // Set empty arrays on error to prevent crashes
      setVehicles([])
      setTransportRequests([])
      setActiveJobs([])
      setLoading(false)
    }
  }

  const handleAddVehicle = async (e) => {
    e.preventDefault()
    console.log("=== Vehicle Form Submission Debug ===")
    console.log("Form data:", newVehicle)

    try {
      const token = localStorage.getItem("token")
      console.log("Token:", token ? `${token.substring(0, 20)}...` : "No token")

      // Validate required fields
      if (
        !newVehicle.vehicle_type ||
        !newVehicle.capacity ||
        !newVehicle.description ||
        !newVehicle.rate_per_km ||
        !newVehicle.location ||
        !newVehicle.image
      ) {
        alert("Please fill in all required fields including vehicle image")
        return
      }

      // Validate rate is a number
      if (isNaN(Number.parseFloat(newVehicle.rate_per_km))) {
        alert("Rate per km must be a valid number")
        return
      }

      // Validate capacity is a number
      if (isNaN(Number.parseFloat(newVehicle.capacity))) {
        alert("Capacity must be a valid number")
        return
      }

      // Validate image file
      if (!newVehicle.image || !newVehicle.image.type.startsWith("image/")) {
        alert("Please select a valid image file")
        return
      }

      // Create FormData for file upload
      const formData = new FormData()
      formData.append("name", `${newVehicle.vehicle_type} - ${newVehicle.location}`)
      formData.append("type", newVehicle.vehicle_type)
      formData.append("capacity", Number.parseFloat(newVehicle.capacity).toFixed(2))
      formData.append("description", newVehicle.description.trim())
      formData.append("rate_per_km", Number.parseFloat(newVehicle.rate_per_km).toFixed(2))
      formData.append("location", newVehicle.location.trim())
      formData.append("image", newVehicle.image)

      console.log("Submitting vehicle with FormData...")

      // Use the correct vehicles endpoint
      await axios.post("http://localhost:8000/api/transports/vehicles/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      alert("Vehicle added successfully! 🎉")
      setShowAddForm(false)
      setNewVehicle({
        vehicle_type: "",
        capacity: "",
        description: "",
        rate_per_km: "",
        location: "",
        image: null,
      })

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) fileInput.value = ""

      fetchData() // Refresh the vehicles list
    } catch (error) {
      console.error("=== Vehicle Creation Error ===")
      console.error("Error object:", error)
      console.error("Response data:", error.response?.data)
      console.error("Response status:", error.response?.status)

      let errorMessage = "Failed to add vehicle. Please try again."

      if (error.response?.status === 405) {
        errorMessage = "Vehicle creation endpoint not available. Please contact support."
      } else if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail
        } else {
          // Show validation errors
          const errors = Object.entries(error.response.data)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
            .join("\n")
          errorMessage = `Validation errors:\n${errors}`
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      alert(`❌ ${errorMessage}`)
    }
  }

  const handleEditVehicle = (vehicleItem) => {
    setEditingVehicle({
      ...vehicleItem,
      image: null, // Reset image for editing
    })
    setShowEditModal(true)
  }

  const handleUpdateVehicle = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")

      // Validate required fields
      if (
        !editingVehicle.vehicle_type ||
        !editingVehicle.capacity ||
        !editingVehicle.description ||
        !editingVehicle.rate_per_km ||
        !editingVehicle.location
      ) {
        alert("Please fill in all required fields")
        return
      }

      // Validate rate is a number
      if (isNaN(Number.parseFloat(editingVehicle.rate_per_km))) {
        alert("Rate per km must be a valid number")
        return
      }

      // Validate capacity is a number
      if (isNaN(Number.parseFloat(editingVehicle.capacity))) {
        alert("Capacity must be a valid number")
        return
      }

      // Create FormData for file upload (if image is provided)
      const formData = new FormData()
      formData.append("name", `${editingVehicle.vehicle_type} - ${editingVehicle.location}`)
      formData.append("type", editingVehicle.vehicle_type)
      formData.append("capacity", Number.parseFloat(editingVehicle.capacity).toFixed(2))
      formData.append("description", editingVehicle.description.trim())
      formData.append("rate_per_km", Number.parseFloat(editingVehicle.rate_per_km).toFixed(2))
      formData.append("location", editingVehicle.location.trim())

      if (editingVehicle.image) {
        formData.append("image", editingVehicle.image)
      }

      await axios.put(`http://localhost:8000/api/transports/vehicles/${editingVehicle.id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      alert("Vehicle updated successfully! ✅")
      setShowEditModal(false)
      setEditingVehicle(null)
      fetchData() // Refresh the vehicles list
    } catch (error) {
      console.error("Error updating vehicle:", error)
      let errorMessage = "Failed to update vehicle. Please try again."

      if (error.response?.status === 405) {
        errorMessage = "Vehicle update endpoint not available. Please contact support."
      } else if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail
        }
      }

      alert(`❌ ${errorMessage}`)
    }
  }

  const handleDeleteVehicle = async (vehicleId, vehicleType) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this ${vehicleType}?\n\nThis action cannot be undone.`,
    )

    if (!confirmDelete) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:8000/api/transports/vehicles/${vehicleId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      alert("Vehicle deleted successfully! 🗑️")
      fetchData() // Refresh the vehicles list
    } catch (error) {
      console.error("Error deleting vehicle:", error)
      alert("Failed to delete vehicle. Please try again.")
    }
  }

  const handleAcceptRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `http://localhost:8000/api/transports/requests/${requestId}/accept/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      alert("Request accepted successfully!")
      fetchData()
    } catch (error) {
      console.error("Error accepting request:", error)
      alert("Failed to accept request.")
    }
  }

  const handleRejectRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `http://localhost:8000/api/transports/requests/${requestId}/reject/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      alert("Request rejected successfully!")
      fetchData()
    } catch (error) {
      console.error("Error rejecting request:", error)
      alert("Failed to reject request.")
    }
  }

  const handleLogout = () => {
    logout()
  }

  const getVehicleTypeEmoji = (type) => {
    const emojiMap = {
      truck: "🚛",
      van: "🚐",
      pickup: "🛻",
      motorcycle: "🏍️",
      bicycle: "🚲",
      other: "🚗",
    }
    return emojiMap[type] || "🚛"
  }

  // Helper function to get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null
    // If it's already a full URL, return as is
    if (imageUrl.startsWith("http")) {
      return imageUrl
    }
    // If it's a relative path, prepend the backend URL
    return `http://localhost:8000${imageUrl}`
  }

  return (
    <div className="transporter-dashboard">
      {/* Header - Match Farmer Dashboard */}
      <header className="dashboard-header">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <span className="logo-icon">🌱</span>
            <span>Smart Farm Connect</span>
          </Link>
          <h1>Transporter Dashboard</h1>
        </div>
        <div className="user-info">
          <span>
            Welcome, {user?.first_name || "User"} {user?.last_name || ""}
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* Navigation - Match Farmer Dashboard */}
      <div className="dashboard-nav">
        <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
          📊 Dashboard
        </button>
        <button className={activeTab === "vehicles" ? "active" : ""} onClick={() => setActiveTab("vehicles")}>
          🚛 My Vehicles
        </button>
        <button className={activeTab === "requests" ? "active" : ""} onClick={() => setActiveTab("requests")}>
          📋 Transport Requests
        </button>
        <button className={activeTab === "jobs" ? "active" : ""} onClick={() => setActiveTab("jobs")}>
          🚚 Active Jobs
        </button>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your transport data...</p>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && (
              <div className="dashboard-overview">
                <h1 className="welcome-title">Welcome to Your Transport Dashboard</h1>
                {/* Main Cards - Match Farmer Dashboard Layout Exactly */}
                <div className="main-cards-grid">
                  <div className="main-card">
                    <div className="card-icon">🚛</div>
                    <h3>My Vehicles</h3>
                    <div className="card-number">{Array.isArray(vehicles) ? vehicles.length : 0}</div>
                    <button className="card-button" onClick={() => setActiveTab("vehicles")}>
                      Manage Vehicles
                    </button>
                  </div>
                  <div className="main-card">
                    <div className="card-icon">📋</div>
                    <h3>Transport Requests</h3>
                    <div className="card-number">
                      {Array.isArray(transportRequests)
                        ? transportRequests.filter((r) => r.status === "pending").length
                        : 0}
                    </div>
                    <button className="card-button" onClick={() => setActiveTab("requests")}>
                      View Requests
                    </button>
                  </div>
                  <div className="main-card">
                    <div className="card-icon">🚚</div>
                    <h3>Active Jobs</h3>
                    <div className="card-number">{Array.isArray(activeJobs) ? activeJobs.length : 0}</div>
                    <button className="card-button" onClick={() => setActiveTab("jobs")}>
                      View Jobs
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "vehicles" && (
              <div className="vehicles-section">
                <div className="section-header">
                  <h2>🚛 My Vehicles</h2>
                  <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
                    + Add New Vehicle
                  </button>
                </div>

                {showAddForm && (
                  <div className="add-form-container">
                    <form onSubmit={handleAddVehicle} className="add-form">
                      <h3>Add New Vehicle</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Vehicle Type *</label>
                          <select
                            value={newVehicle.vehicle_type}
                            onChange={(e) => setNewVehicle({ ...newVehicle, vehicle_type: e.target.value })}
                            required
                          >
                            <option value="">Select Type</option>
                            <option value="truck">Truck</option>
                            <option value="van">Van</option>
                            <option value="pickup">Pickup</option>
                            <option value="motorcycle">Motorcycle</option>
                            <option value="bicycle">Bicycle</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Capacity (kg) *</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={newVehicle.capacity}
                            onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                            required
                            placeholder="0.00"
                          />
                        </div>
                        <div className="form-group">
                          <label>Rate per KM ($) *</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={newVehicle.rate_per_km}
                            onChange={(e) => setNewVehicle({ ...newVehicle, rate_per_km: e.target.value })}
                            required
                            placeholder="0.00"
                          />
                        </div>
                        <div className="form-group">
                          <label>Location *</label>
                          <input
                            type="text"
                            value={newVehicle.location}
                            onChange={(e) => setNewVehicle({ ...newVehicle, location: e.target.value })}
                            required
                            placeholder="Enter location"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Description *</label>
                        <textarea
                          value={newVehicle.description}
                          onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                          rows="3"
                          required
                          placeholder="Describe your vehicle..."
                        />
                      </div>
                      <div className="form-group">
                        <label>Vehicle Image *</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setNewVehicle({ ...newVehicle, image: e.target.files[0] })}
                          required
                        />
                        <small className="form-help">Please upload a clear image of your vehicle (JPG, PNG, GIF)</small>
                      </div>
                      <div className="form-actions">
                        <button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">
                          Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                          Add Vehicle
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="vehicles-grid">
                  {Array.isArray(vehicles) && vehicles.length > 0 ? (
                    vehicles.map((item) => (
                      <div key={item.id} className="vehicle-card">
                        <div className="vehicle-image">
                          {item.image && getImageUrl(item.image) ? (
                            <img
                              src={getImageUrl(item.image) || "/placeholder.svg"}
                              alt={item.vehicle_type || item.type}
                              onError={(e) => {
                                console.error("Image failed to load:", getImageUrl(item.image))
                                // Fallback to emoji if image fails to load
                                e.target.style.display = "none"
                                e.target.nextSibling.style.display = "flex"
                              }}
                            />
                          ) : null}
                          <div
                            className="placeholder-image"
                            style={{ display: item.image && getImageUrl(item.image) ? "none" : "flex" }}
                          >
                            <span className="vehicle-emoji">{getVehicleTypeEmoji(item.vehicle_type || item.type)}</span>
                          </div>
                        </div>
                        <div className="vehicle-content">
                          <h3 className="vehicle-name">
                            {item.name || item.vehicle_type || item.type || "Unknown Vehicle"}
                          </h3>
                          <div className="vehicle-type-container">
                            <span className="type-badge">{item.vehicle_type || item.type || "other"}</span>
                            <span className="capacity-info">Capacity: {item.capacity}kg</span>
                          </div>
                          <div className="vehicle-pricing">
                            <span className="price">${item.rate_per_km || "0.00"}/km</span>
                            <span className="location">📍 {item.location || "Unknown"}</span>
                          </div>
                          <p className="vehicle-description">{item.description || "No description"}</p>
                          <div className="vehicle-status-container">
                            <span className={`status-badge ${item.is_available ? "available" : "busy"}`}>
                              {item.is_available ? "✅ Available" : "🚛 Busy"}
                            </span>
                          </div>
                        </div>
                        <div className="vehicle-actions">
                          <button className="edit-btn" onClick={() => handleEditVehicle(item)}>
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteVehicle(item.id, item.vehicle_type || item.type)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">🚛</div>
                      <h3>No Vehicles Listed</h3>
                      <p>Start by adding your first vehicle to offer transport services!</p>
                      <button className="add-btn" onClick={() => setShowAddForm(true)}>
                        + Add Vehicle
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "requests" && (
              <div className="requests-section">
                <h2>📋 Transport Requests</h2>
                <div className="requests-grid">
                  {Array.isArray(transportRequests) && transportRequests.length > 0 ? (
                    transportRequests.map((request) => (
                      <div key={request.id} className="request-card">
                        <div className="request-header">
                          <h3>Request #{request.id}</h3>
                          <span className={`status-badge status-${request.status}`}>{request.status}</span>
                        </div>
                        <div className="request-details">
                          <p>
                            <strong>From:</strong> {request.pickup_location}
                          </p>
                          <p>
                            <strong>To:</strong> {request.delivery_location}
                          </p>
                          <p>
                            <strong>Cargo:</strong> {request.cargo_description}
                          </p>
                          <p>
                            <strong>Weight:</strong> {request.weight} kg
                          </p>
                          <p>
                            <strong>Budget:</strong> ${request.budget}
                          </p>
                          <p>
                            <strong>Pickup Date:</strong> {new Date(request.pickup_date).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Requester:</strong> {request.requester_name}
                          </p>
                        </div>
                        {request.status === "pending" && (
                          <div className="request-actions">
                            <button className="accept-btn" onClick={() => handleAcceptRequest(request.id)}>
                              ✅ Accept
                            </button>
                            <button className="reject-btn" onClick={() => handleRejectRequest(request.id)}>
                              ❌ Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📋</div>
                      <h3>No Transport Requests</h3>
                      <p>When farmers request transport services, they'll appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "jobs" && (
              <div className="jobs-section">
                <h2>🚚 Active Jobs</h2>
                <div className="jobs-grid">
                  {Array.isArray(activeJobs) && activeJobs.length > 0 ? (
                    activeJobs.map((job) => (
                      <div key={job.id} className="job-card">
                        <div className="job-header">
                          <h3>Job #{job.id}</h3>
                          <span className={`status-badge status-${job.status}`}>{job.status}</span>
                        </div>
                        <div className="job-details">
                          <p>
                            <strong>From:</strong> {job.pickup_location}
                          </p>
                          <p>
                            <strong>To:</strong> {job.delivery_location}
                          </p>
                          <p>
                            <strong>Cargo:</strong> {job.cargo_description}
                          </p>
                          <p>
                            <strong>Weight:</strong> {job.weight} kg
                          </p>
                          <p>
                            <strong>Payment:</strong> ${job.budget}
                          </p>
                          <p>
                            <strong>Client:</strong> {job.client_name}
                          </p>
                          <p>
                            <strong>Started:</strong> {new Date(job.start_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="job-actions">
                          <button className="complete-btn">✅ Mark Complete</button>
                          <button className="contact-btn">📞 Contact Client</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">🚚</div>
                      <h3>No Active Jobs</h3>
                      <p>Your accepted transport jobs will appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Vehicle Modal */}
      {showEditModal && editingVehicle && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleUpdateVehicle} className="edit-form">
              <h3>Edit Vehicle</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Vehicle Type *</label>
                  <select
                    value={editingVehicle.vehicle_type || editingVehicle.type}
                    onChange={(e) =>
                      setEditingVehicle({ ...editingVehicle, vehicle_type: e.target.value, type: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="truck">Truck</option>
                    <option value="van">Van</option>
                    <option value="pickup">Pickup</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="bicycle">Bicycle</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Capacity (kg) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingVehicle.capacity}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, capacity: e.target.value })}
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>Rate per KM ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingVehicle.rate_per_km}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, rate_per_km: e.target.value })}
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={editingVehicle.location}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, location: e.target.value })}
                    required
                    placeholder="Enter location"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={editingVehicle.description}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, description: e.target.value })}
                  rows="3"
                  required
                  placeholder="Describe your vehicle..."
                />
              </div>
              <div className="form-group">
                <label>Vehicle Image (Optional for editing)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, image: e.target.files[0] })}
                />
                <small className="form-help">Leave empty to keep current image</small>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingVehicle(null)
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Update Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default TransporterDashboard
