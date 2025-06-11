"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../context/UserContext"
import { Link } from "react-router-dom"
import Footer from "../components/Footer"
import "../TransporterDashboard.css"

const EquipmentDashboard = () => {
  const { user, logout } = useAuth()
  const [equipment, setEquipment] = useState([])
  const [rentalRequests, setRentalRequests] = useState([])
  const [activeRentals, setActiveRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    type: "",
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
        axios.get("http://localhost:8000/api/equipment/rental_requests/", { headers }),
        axios.get("http://localhost:8000/api/equipment/active_rentals/", { headers }),
      ])

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
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()

      Object.keys(newEquipment).forEach((key) => {
        if (newEquipment[key] !== null) {
          formData.append(key, newEquipment[key])
        }
      })

      await axios.post("http://localhost:8000/api/equipment/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      alert("Equipment added successfully!")
      setShowAddForm(false)
      setNewEquipment({
        name: "",
        type: "",
        description: "",
        daily_rate: "",
        location: "",
        image: null,
      })
      fetchData()
    } catch (error) {
      console.error("Error adding equipment:", error)
      alert("Failed to add equipment. Please try again.")
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

  return (
    <div className="transporter-dashboard">
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

      <div className="dashboard-nav">
        <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
          <span className="nav-icon">📊</span>
          Dashboard
        </button>
        <button className={activeTab === "equipment" ? "active" : ""} onClick={() => setActiveTab("equipment")}>
          <span className="nav-icon">🚜</span>
          My Equipment
        </button>
        <button className={activeTab === "requests" ? "active" : ""} onClick={() => setActiveTab("requests")}>
          <span className="nav-icon">📋</span>
          Rental Requests
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
                <div className="welcome-section">
                  <h2>Welcome back, {user.first_name}! 👋</h2>
                  <p>Here's an overview of your equipment rental business</p>
                </div>

                <div className="stats-grid">
                  <div className="stat-card equipment-card">
                    <div className="stat-icon">🚜</div>
                    <div className="stat-content">
                      <h3>My Equipment</h3>
                      <div className="stat-number">{equipment.length}</div>
                      <p>Total equipment listed</p>
                      <button className="stat-action-btn" onClick={() => setActiveTab("equipment")}>
                        Manage Equipment
                      </button>
                    </div>
                  </div>

                  <div className="stat-card requests-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-content">
                      <h3>Pending Requests</h3>
                      <div className="stat-number">{rentalRequests.filter((r) => r.status === "pending").length}</div>
                      <p>Awaiting your response</p>
                      <button className="stat-action-btn" onClick={() => setActiveTab("requests")}>
                        View Requests
                      </button>
                    </div>
                  </div>

                  <div className="stat-card rentals-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                      <h3>Active Rentals</h3>
                      <div className="stat-number">{activeRentals.length}</div>
                      <p>Currently rented out</p>
                      <button className="stat-action-btn" onClick={() => setActiveTab("requests")}>
                        View Rentals
                      </button>
                    </div>
                  </div>
                </div>

                <div className="recent-activity">
                  <h3>📈 Recent Activity</h3>
                  <div className="activity-list">
                    {rentalRequests.slice(0, 5).map((request) => (
                      <div key={request.id} className="activity-item">
                        <div className="activity-content">
                          <p>
                            <strong>{request.renter_name}</strong> requested to rent{" "}
                            <strong>{request.equipment_name}</strong>
                          </p>
                          <span className={`activity-status status-${request.status}`}>{request.status}</span>
                        </div>
                        <span className="activity-date">{new Date(request.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                    {rentalRequests.length === 0 && (
                      <div className="empty-state">
                        <p>No recent activity. Start by adding your equipment!</p>
                      </div>
                    )}
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
                          <label>Equipment Name</label>
                          <input
                            type="text"
                            value={newEquipment.name}
                            onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Type</label>
                          <select
                            value={newEquipment.type}
                            onChange={(e) => setNewEquipment({ ...newEquipment, type: e.target.value })}
                            required
                          >
                            <option value="">Select Type</option>
                            <option value="tractor">Tractor</option>
                            <option value="harvester">Harvester</option>
                            <option value="planter">Planter</option>
                            <option value="cultivator">Cultivator</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Daily Rate ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={newEquipment.daily_rate}
                            onChange={(e) => setNewEquipment({ ...newEquipment, daily_rate: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Location</label>
                          <input
                            type="text"
                            value={newEquipment.location}
                            onChange={(e) => setNewEquipment({ ...newEquipment, location: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={newEquipment.description}
                          onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })}
                          rows="3"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Equipment Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setNewEquipment({ ...newEquipment, image: e.target.files[0] })}
                        />
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
                          {item.image ? (
                            <img src={item.image || "/placeholder.svg"} alt={item.name} />
                          ) : (
                            <div className="placeholder-image">🚜</div>
                          )}
                        </div>
                        <div className="equipment-details">
                          <h3>{item.name}</h3>
                          <p className="equipment-type">{item.type}</p>
                          <p className="equipment-description">{item.description}</p>
                          <div className="equipment-meta">
                            <span className="equipment-rate">${item.daily_rate}/day</span>
                            <span className="equipment-location">📍 {item.location}</span>
                          </div>
                          <div className="equipment-status">
                            <span className={`status-badge ${item.is_available ? "available" : "rented"}`}>
                              {item.is_available ? "✅ Available" : "🔒 Rented"}
                            </span>
                          </div>
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

      <Footer />
    </div>
  )
}

export default EquipmentDashboard
