"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/UserContext"
import Footer from "../components/Footer"
import "../TransporterDashboard.css"

const TransporterDashboard = () => {
  const { user, logout } = useAuth()
  const [transportRequests, setTransportRequests] = useState([])
  const [myVehicles, setMyVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    type: "truck",
    capacity: "",
    rate_per_km: "",
    description: "",
    image: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch available transport requests
        const requestsResponse = await axios.get("http://localhost:8000/api/transports/available_jobs/")
        setTransportRequests(requestsResponse.data)

        // Fetch transporter's vehicles
        const vehiclesResponse = await axios.get("http://localhost:8000/api/transports/my_vehicles/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        setMyVehicles(vehiclesResponse.data)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching transporter data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = () => {
    logout()
  }

  const handleVehicleChange = (e) => {
    if (e.target.name === "image") {
      setNewVehicle({
        ...newVehicle,
        image: e.target.files[0],
      })
    } else {
      setNewVehicle({
        ...newVehicle,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleVehicleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    Object.keys(newVehicle).forEach((key) => {
      if (newVehicle[key] !== null && newVehicle[key] !== "") {
        formData.append(key, newVehicle[key])
      }
    })

    try {
      const response = await axios.post("http://localhost:8000/api/transports/vehicles/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      setMyVehicles([...myVehicles, response.data])
      setNewVehicle({
        name: "",
        type: "truck",
        capacity: "",
        rate_per_km: "",
        description: "",
        image: null,
      })

      alert("Vehicle added successfully!")
    } catch (error) {
      console.error("Error adding vehicle:", error)
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || "Failed to add vehicle. Please try again."
      alert(errorMessage)
    }
  }

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/transports/requests/${requestId}/accept/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      // Update the local state to reflect the change
      setTransportRequests(
        transportRequests.map((request) =>
          request.id === requestId ? { ...request, status: "accepted", transporter: user.id } : request,
        ),
      )

      alert("Transport request accepted successfully!")
    } catch (error) {
      console.error("Error accepting request:", error)
      const errorMessage = error.response?.data?.error || "Failed to accept request. Please try again."
      alert(errorMessage)
    }
  }

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/transports/requests/${requestId}/reject/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      // Update the local state to reflect the change
      setTransportRequests(transportRequests.filter((request) => request.id !== requestId))

      alert("Transport request rejected successfully!")
    } catch (error) {
      console.error("Error rejecting request:", error)
      const errorMessage = error.response?.data?.error || "Failed to reject request. Please try again."
      alert(errorMessage)
    }
  }

  return (
    <div className="transporter-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <span className="logo-icon">🌱</span>
            <span className="logo-text">Smart Farm Connect</span>
          </Link>
          <h1>Transporter Dashboard</h1>
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
          Dashboard
        </button>
        <button className={activeTab === "requests" ? "active" : ""} onClick={() => setActiveTab("requests")}>
          Transport Requests
        </button>
        <button className={activeTab === "vehicles" ? "active" : ""} onClick={() => setActiveTab("vehicles")}>
          My Vehicles
        </button>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading data...</p>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && (
              <div className="dashboard-overview">
                <h2>Overview</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <h3>Available Requests</h3>
                    <p className="stat-number">{transportRequests.filter((r) => r.status === "pending").length}</p>
                    <button onClick={() => setActiveTab("requests")} className="stat-button">
                      View Requests
                    </button>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🚛</div>
                    <h3>My Vehicles</h3>
                    <p className="stat-number">{myVehicles.length}</p>
                    <button onClick={() => setActiveTab("vehicles")} className="stat-button">
                      Manage Vehicles
                    </button>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <h3>Accepted Jobs</h3>
                    <p className="stat-number">
                      {transportRequests.filter((r) => r.status === "accepted" && r.transporter === user.id).length}
                    </p>
                    <button onClick={() => setActiveTab("requests")} className="stat-button">
                      View Jobs
                    </button>
                  </div>
                </div>

                <div className="recent-activity">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    {transportRequests
                      .filter((r) => r.status === "accepted" && r.transporter === user.id)
                      .slice(0, 5)
                      .map((request) => (
                        <div key={request.id} className="activity-item">
                          <div className="activity-icon">🚚</div>
                          <div className="activity-details">
                            <p>
                              Transport job accepted: {request.pickup_location} to {request.delivery_location}
                            </p>
                            <span className="activity-date">{new Date(request.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    {transportRequests.filter((r) => r.status === "accepted" && r.transporter === user.id).length ===
                      0 && <p className="no-activity">No recent activity</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "requests" && (
              <div className="requests-section">
                <h2>Transport Requests</h2>
                <div className="requests-list">
                  {transportRequests.filter((r) => r.status === "pending").length > 0 ? (
                    transportRequests
                      .filter((r) => r.status === "pending")
                      .map((request) => (
                        <div key={request.id} className="request-card">
                          <div className="request-header">
                            <h3>Request #{request.id}</h3>
                            <span className="request-status pending">Pending</span>
                          </div>
                          <div className="request-details">
                            <div className="detail-row">
                              <span className="detail-label">Route:</span>
                              <span className="detail-value">
                                {request.pickup_location} → {request.delivery_location}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Cargo:</span>
                              <span className="detail-value">{request.cargo_description}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Weight:</span>
                              <span className="detail-value">{request.weight} kg</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Pickup Date:</span>
                              <span className="detail-value">{new Date(request.pickup_date).toLocaleString()}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Budget:</span>
                              <span className="detail-value">${request.budget}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Requester:</span>
                              <span className="detail-value">{request.requester_details?.username || "Unknown"}</span>
                            </div>
                          </div>
                          <div className="request-actions">
                            <button className="accept-btn" onClick={() => handleAcceptRequest(request.id)}>
                              Accept Job
                            </button>
                            <button className="reject-btn" onClick={() => handleRejectRequest(request.id)}>
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="no-requests">
                      <div className="no-requests-icon">📋</div>
                      <p>No pending transport requests available.</p>
                    </div>
                  )}
                </div>

                <h2>My Accepted Jobs</h2>
                <div className="jobs-list">
                  {transportRequests.filter((r) => r.status !== "pending" && r.transporter === user.id).length > 0 ? (
                    transportRequests
                      .filter((r) => r.status !== "pending" && r.transporter === user.id)
                      .map((job) => (
                        <div key={job.id} className="job-card">
                          <div className="job-header">
                            <h3>Job #{job.id}</h3>
                            <span className={`job-status ${job.status}`}>{job.status}</span>
                          </div>
                          <div className="job-details">
                            <div className="detail-row">
                              <span className="detail-label">Route:</span>
                              <span className="detail-value">
                                {job.pickup_location} → {job.delivery_location}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Cargo:</span>
                              <span className="detail-value">{job.cargo_description}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Weight:</span>
                              <span className="detail-value">{job.weight} kg</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Pickup Date:</span>
                              <span className="detail-value">{new Date(job.pickup_date).toLocaleString()}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Requester:</span>
                              <span className="detail-value">{job.requester_details?.username || "Unknown"}</span>
                            </div>
                          </div>
                          <div className="job-actions">
                            {job.status === "accepted" && <button className="start-btn">Start Job</button>}
                            {job.status === "in_progress" && <button className="complete-btn">Complete Job</button>}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="no-jobs">
                      <div className="no-jobs-icon">✅</div>
                      <p>You haven't accepted any jobs yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "vehicles" && (
              <div className="vehicles-section">
                <h2>My Vehicles</h2>
                <div className="vehicles-grid">
                  {myVehicles.length > 0 ? (
                    myVehicles.map((vehicle) => (
                      <div key={vehicle.id} className="vehicle-card">
                        <div className="vehicle-image">
                          {vehicle.image ? (
                            <img src={vehicle.image || "/placeholder.svg"} alt={vehicle.name} />
                          ) : (
                            <div className="vehicle-placeholder">
                              <span className="vehicle-icon">🚛</span>
                            </div>
                          )}
                        </div>
                        <div className="vehicle-details">
                          <h3>{vehicle.name}</h3>
                          <div className="vehicle-info">
                            <span className="vehicle-type">{vehicle.type}</span>
                            <span className="vehicle-capacity">{vehicle.capacity} kg</span>
                          </div>
                          <p className="vehicle-rate">${vehicle.rate_per_km}/km</p>
                          <p className="vehicle-description">{vehicle.description}</p>
                        </div>
                        <div className="vehicle-actions">
                          <button className="edit-btn">Edit</button>
                          <button className="delete-btn">Delete</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-vehicles">
                      <div className="no-vehicles-icon">🚛</div>
                      <p>You haven't added any vehicles yet.</p>
                    </div>
                  )}
                </div>

                <div className="add-vehicle-section">
                  <h2>Add New Vehicle</h2>
                  <form onSubmit={handleVehicleSubmit} className="add-vehicle-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Vehicle Name</label>
                        <input
                          type="text"
                          name="name"
                          value={newVehicle.name}
                          onChange={handleVehicleChange}
                          required
                          placeholder="e.g., Sino Truck"
                        />
                      </div>

                      <div className="form-group">
                        <label>Vehicle Type</label>
                        <select name="type" value={newVehicle.type} onChange={handleVehicleChange} required>
                          <option value="truck">Truck</option>
                          <option value="van">Van</option>
                          <option value="pickup">Pickup</option>
                          <option value="refrigerated">Refrigerated Vehicle</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Capacity (kg)</label>
                        <input
                          type="number"
                          name="capacity"
                          value={newVehicle.capacity}
                          onChange={handleVehicleChange}
                          required
                          placeholder="e.g., 5000"
                        />
                      </div>

                      <div className="form-group">
                        <label>Rate per km ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          name="rate_per_km"
                          value={newVehicle.rate_per_km}
                          onChange={handleVehicleChange}
                          required
                          placeholder="e.g., 2.50"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={newVehicle.description}
                        onChange={handleVehicleChange}
                        rows="3"
                        placeholder="Describe your vehicle and any special features..."
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label>Vehicle Image</label>
                      <input type="file" name="image" onChange={handleVehicleChange} accept="image/*" />
                    </div>

                    <button type="submit" className="submit-btn">
                      Add Vehicle
                    </button>
                  </form>
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

export default TransporterDashboard
