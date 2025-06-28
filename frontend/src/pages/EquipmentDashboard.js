"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../context/UserContext"
import { Link } from "react-router-dom"
import Footer from "../components/Footer"
import "../EquipmentDashboard.css"

const EquipmentDashboard = () => {
  const { user, logout } = useAuth()
  const [equipment, setEquipment] = useState([])
  const [rentalRequests, setRentalRequests] = useState([])
  const [activeRentals, setActiveRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    equipment_type: "",
    description: "",
    daily_rate: "",
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

      const [equipmentRes, requestsRes, rentalsRes] = await Promise.all([
        axios.get("http://localhost:8000/api/equipment/my_equipment/", { headers }),
        axios.get("http://localhost:8000/api/equipment/rental_requests/", { headers }).catch(() => ({ data: [] })),
        axios.get("http://localhost:8000/api/equipment/active_rentals/", { headers }).catch(() => ({ data: [] })),
      ])

      console.log("🚜 Fetched equipment data:", equipmentRes.data)
      setEquipment(equipmentRes.data)
      setRentalRequests(requestsRes.data)
      setActiveRentals(rentalsRes.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setLoading(false)
    }
  }

  const handleAddEquipment = async (e) => {
    e.preventDefault()

    console.log("=== Equipment Form Submission Debug ===")
    console.log("Form data:", newEquipment)

    try {
      const token = localStorage.getItem("token")
      console.log("Token:", token ? `${token.substring(0, 20)}...` : "No token")

      // Validate required fields (including image)
      if (
        !newEquipment.name ||
        !newEquipment.equipment_type ||
        !newEquipment.description ||
        !newEquipment.daily_rate ||
        !newEquipment.location ||
        !newEquipment.image
      ) {
        alert("Please fill in all required fields including equipment image")
        return
      }

      // Validate daily rate is a number
      if (isNaN(Number.parseFloat(newEquipment.daily_rate))) {
        alert("Daily rate must be a valid number")
        return
      }

      // Validate image file
      if (!newEquipment.image || !newEquipment.image.type.startsWith("image/")) {
        alert("Please select a valid image file")
        return
      }

      // Create FormData for file upload
      const formData = new FormData()
      formData.append("name", newEquipment.name.trim())
      formData.append("equipment_type", newEquipment.equipment_type)
      formData.append("description", newEquipment.description.trim())
      formData.append("daily_rate", Number.parseFloat(newEquipment.daily_rate).toFixed(2))
      formData.append("location", newEquipment.location.trim())
      formData.append("image", newEquipment.image)

      console.log("Submitting equipment with FormData...")

      const response = await axios.post("http://localhost:8000/api/equipment/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Success response:", response.data)

      // Check if response indicates success
      if (response.data.success !== false) {
        alert("Equipment added successfully! 🎉")
        setShowAddForm(false)
        setNewEquipment({
          name: "",
          equipment_type: "",
          description: "",
          daily_rate: "",
          location: "",
          image: null,
        })
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]')
        if (fileInput) fileInput.value = ""

        fetchData() // Refresh the equipment list
      } else {
        throw new Error(response.data.error || "Unknown error occurred")
      }
    } catch (error) {
      console.error("=== Equipment Creation Error ===")
      console.error("Error object:", error)
      console.error("Response data:", error.response?.data)
      console.error("Response status:", error.response?.status)

      let errorMessage = "Failed to add equipment. Please try again."

      if (error.response?.data) {
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

  const handleEditEquipment = (equipmentItem) => {
    setEditingEquipment({
      ...equipmentItem,
      image: null, // Reset image for editing
    })
    setShowEditModal(true)
  }

  const handleUpdateEquipment = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")

      // Validate required fields
      if (
        !editingEquipment.name ||
        !editingEquipment.equipment_type ||
        !editingEquipment.description ||
        !editingEquipment.daily_rate ||
        !editingEquipment.location
      ) {
        alert("Please fill in all required fields")
        return
      }

      // Validate daily rate is a number
      if (isNaN(Number.parseFloat(editingEquipment.daily_rate))) {
        alert("Daily rate must be a valid number")
        return
      }

      // Create FormData for file upload (if image is provided)
      const formData = new FormData()
      formData.append("name", editingEquipment.name.trim())
      formData.append("equipment_type", editingEquipment.equipment_type)
      formData.append("description", editingEquipment.description.trim())
      formData.append("daily_rate", Number.parseFloat(editingEquipment.daily_rate).toFixed(2))
      formData.append("location", editingEquipment.location.trim())

      if (editingEquipment.image) {
        formData.append("image", editingEquipment.image)
      }

      const response = await axios.put(`http://localhost:8000/api/equipment/${editingEquipment.id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      alert("Equipment updated successfully! ✅")
      setShowEditModal(false)
      setEditingEquipment(null)
      fetchData() // Refresh the equipment list
    } catch (error) {
      console.error("Error updating equipment:", error)
      let errorMessage = "Failed to update equipment. Please try again."

      if (error.response?.data) {
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

  const handleDeleteEquipment = async (equipmentId, equipmentName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${equipmentName}"?\n\nThis action cannot be undone.`,
    )

    if (!confirmDelete) return

    try {
      const token = localStorage.getItem("token")

      await axios.delete(`http://localhost:8000/api/equipment/${equipmentId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      alert("Equipment deleted successfully! 🗑️")
      fetchData() // Refresh the equipment list
    } catch (error) {
      console.error("Error deleting equipment:", error)
      alert("Failed to delete equipment. Please try again.")
    }
  }

  const handleApproveRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `http://localhost:8000/api/equipment/rental_requests/${requestId}/approve/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      alert("Request approved successfully!")
      fetchData()
    } catch (error) {
      console.error("Error approving request:", error)
      alert("Failed to approve request.")
    }
  }

  const handleRejectRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `http://localhost:8000/api/equipment/rental_requests/${requestId}/reject/`,
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

  const getEquipmentTypeEmoji = (type) => {
    const emojiMap = {
      tractor: "🚜",
      harvester: "🌾",
      planter: "🌱",
      sprayer: "💧",
      irrigation: "🚿",
      other: "🔧",
    }
    return emojiMap[type] || "🚜"
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
    <div className="equipment-dashboard">
      {/* Header - Match Farmer Dashboard */}
      <header className="dashboard-header">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <span className="logo-icon">🌱</span>
            <span>Smart Farm Connect</span>
          </Link>
          <h1>Equipment Seller Dashboard</h1>
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

      {/* Navigation - Match Farmer Dashboard */}
      <div className="dashboard-nav">
        <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
          📊 Dashboard
        </button>
        <button className={activeTab === "equipment" ? "active" : ""} onClick={() => setActiveTab("equipment")}>
          🚜 My Equipment
        </button>
        <button className={activeTab === "requests" ? "active" : ""} onClick={() => setActiveTab("requests")}>
          📋 Rental Requests
        </button>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your equipment data...</p>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && (
              <div className="dashboard-overview">
                <h1 className="welcome-title">Welcome to Your Equipment Dashboard</h1>

                {/* Main Cards - Match Farmer Dashboard Layout Exactly */}
                <div className="main-cards-grid">
                  <div className="main-card">
                    <div className="card-icon">📦</div>
                    <h3>My Equipment</h3>
                    <div className="card-number">{equipment.length}</div>
                    <button className="card-button" onClick={() => setActiveTab("equipment")}>
                      Manage Equipment
                    </button>
                  </div>

                  <div className="main-card">
                    <div className="card-icon">📋</div>
                    <h3>Rental Requests</h3>
                    <div className="card-number">{rentalRequests.filter((r) => r.status === "pending").length}</div>
                    <button className="card-button" onClick={() => setActiveTab("requests")}>
                      View Requests
                    </button>
                  </div>

                  <div className="main-card">
                    <div className="card-icon">🚜</div>
                    <h3>Equipment Available</h3>
                    <button className="card-button" onClick={() => setActiveTab("equipment")}>
                      Browse Equipment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "equipment" && (
              <div className="equipment-section">
                <div className="section-header">
                  <h2>🚜 My Equipment</h2>
                  <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
                    + Add New Equipment
                  </button>
                </div>

                {showAddForm && (
                  <div className="add-form-container">
                    <form onSubmit={handleAddEquipment} className="add-form">
                      <h3>Add New Equipment</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Equipment Name *</label>
                          <input
                            type="text"
                            value={newEquipment.name}
                            onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                            required
                            placeholder="Enter equipment name"
                          />
                        </div>
                        <div className="form-group">
                          <label>Type *</label>
                          <select
                            value={newEquipment.equipment_type}
                            onChange={(e) => setNewEquipment({ ...newEquipment, equipment_type: e.target.value })}
                            required
                          >
                            <option value="">Select Type</option>
                            <option value="tractor">Tractor</option>
                            <option value="harvester">Harvester</option>
                            <option value="planter">Planter</option>
                            <option value="sprayer">Sprayer</option>
                            <option value="irrigation">Irrigation Equipment</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Daily Rate ($) *</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={newEquipment.daily_rate}
                            onChange={(e) => setNewEquipment({ ...newEquipment, daily_rate: e.target.value })}
                            required
                            placeholder="0.00"
                          />
                        </div>
                        <div className="form-group">
                          <label>Location *</label>
                          <input
                            type="text"
                            value={newEquipment.location}
                            onChange={(e) => setNewEquipment({ ...newEquipment, location: e.target.value })}
                            required
                            placeholder="Enter location"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Description *</label>
                        <textarea
                          value={newEquipment.description}
                          onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })}
                          rows="3"
                          required
                          placeholder="Describe your equipment..."
                        />
                      </div>
                      <div className="form-group">
                        <label>Equipment Image *</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setNewEquipment({ ...newEquipment, image: e.target.files[0] })}
                          required
                        />
                        <small className="form-help">
                          Please upload a clear image of your equipment (JPG, PNG, GIF)
                        </small>
                      </div>
                      <div className="form-actions">
                        <button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">
                          Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                          Add Equipment
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="equipment-grid">
                  {equipment.length > 0 ? (
                    equipment.map((item) => (
                      <div key={item.id} className="equipment-card">
                        <div className="equipment-image">
                          {item.image && getImageUrl(item.image) ? (
                            <img
                              src={getImageUrl(item.image) || "/placeholder.svg"}
                              alt={item.name}
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
                            <span className="equipment-emoji">{getEquipmentTypeEmoji(item.equipment_type)}</span>
                          </div>
                        </div>
                        <div className="equipment-content">
                          <h3 className="equipment-name">{item.name || "Unnamed Equipment"}</h3>
                          <div className="equipment-type-container">
                            <span className="type-badge">{item.equipment_type || "other"}</span>
                            <span className="capacity-info">Daily Rate</span>
                          </div>
                          <div className="equipment-pricing">
                            <span className="price">${item.daily_rate || "0.00"}/day</span>
                            <span className="location">📍 {item.location || "Unknown"}</span>
                          </div>
                          <p className="equipment-description">{item.description || "No description"}</p>
                          <div className="equipment-status-container">
                            <span className={`status-badge ${item.is_available ? "available" : "rented"}`}>
                              {item.is_available ? "✅ Available" : "🔒 Rented"}
                            </span>
                          </div>
                        </div>
                        <div className="equipment-actions">
                          <button className="edit-btn" onClick={() => handleEditEquipment(item)}>
                            Edit
                          </button>
                          <button className="delete-btn" onClick={() => handleDeleteEquipment(item.id, item.name)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">🚜</div>
                      <h3>No Equipment Listed</h3>
                      <p>Start by adding your first piece of equipment to rent out!</p>
                      <button className="add-btn" onClick={() => setShowAddForm(true)}>
                        + Add Equipment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "requests" && (
              <div className="requests-section">
                <h2>📋 Rental Requests</h2>
                <div className="requests-grid">
                  {rentalRequests.length > 0 ? (
                    rentalRequests.map((request) => (
                      <div key={request.id} className="request-card">
                        <div className="request-header">
                          <h3>Request #{request.id}</h3>
                          <span className={`status-badge status-${request.status}`}>{request.status}</span>
                        </div>
                        <div className="request-details">
                          <p>
                            <strong>Equipment:</strong> {request.equipment_name}
                          </p>
                          <p>
                            <strong>Renter:</strong> {request.renter_name}
                          </p>
                          <p>
                            <strong>Duration:</strong> {request.duration} days
                          </p>
                          <p>
                            <strong>Start Date:</strong> {new Date(request.start_date).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Total Cost:</strong> ${request.total_cost}
                          </p>
                          <p>
                            <strong>Message:</strong> {request.message}
                          </p>
                        </div>
                        {request.status === "pending" && (
                          <div className="request-actions">
                            <button className="approve-btn" onClick={() => handleApproveRequest(request.id)}>
                              ✅ Approve
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
                      <h3>No Rental Requests</h3>
                      <p>When farmers request to rent your equipment, they'll appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Equipment Modal */}
      {showEditModal && editingEquipment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleUpdateEquipment} className="edit-form">
              <h3>Edit Equipment</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Equipment Name *</label>
                  <input
                    type="text"
                    value={editingEquipment.name}
                    onChange={(e) => setEditingEquipment({ ...editingEquipment, name: e.target.value })}
                    required
                    placeholder="Enter equipment name"
                  />
                </div>
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    value={editingEquipment.equipment_type}
                    onChange={(e) => setEditingEquipment({ ...editingEquipment, equipment_type: e.target.value })}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="tractor">Tractor</option>
                    <option value="harvester">Harvester</option>
                    <option value="planter">Planter</option>
                    <option value="sprayer">Sprayer</option>
                    <option value="irrigation">Irrigation Equipment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Daily Rate ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingEquipment.daily_rate}
                    onChange={(e) => setEditingEquipment({ ...editingEquipment, daily_rate: e.target.value })}
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={editingEquipment.location}
                    onChange={(e) => setEditingEquipment({ ...editingEquipment, location: e.target.value })}
                    required
                    placeholder="Enter location"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={editingEquipment.description}
                  onChange={(e) => setEditingEquipment({ ...editingEquipment, description: e.target.value })}
                  rows="3"
                  required
                  placeholder="Describe your equipment..."
                />
              </div>
              <div className="form-group">
                <label>Equipment Image (Optional for editing)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditingEquipment({ ...editingEquipment, image: e.target.files[0] })}
                />
                <small className="form-help">Leave empty to keep current image</small>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingEquipment(null)
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Update Equipment
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

export default EquipmentDashboard
