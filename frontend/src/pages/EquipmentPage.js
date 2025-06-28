"use client"

import { useState } from "react"
import Navbar from "../components/Navbar"

const EquipmentPage = () => {
  const [activeTab, setActiveTab] = useState("browse")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const [equipment] = useState([
    {
      id: 1,
      name: "John Deere Tractor",
      type: "Heavy Machinery",
      rate: "Per Day",
      price: 75,
      location: "Juba",
      owner: "Equipment Co.",
      image: "🚜",
      available: true,
      rating: 4.8,
      description: "Powerful tractor suitable for large-scale farming operations",
      specifications: ["150 HP", "4WD", "Air Conditioned"],
    },
    {
      id: 2,
      name: "Combine Harvester",
      type: "Heavy Machinery",
      rate: "Per Day",
      price: 120,
      location: "Yei",
      owner: "Farm Solutions",
      image: "🌾",
      available: true,
      rating: 4.9,
      description: "Modern combine harvester for efficient crop harvesting",
      specifications: ["200 HP", "GPS Guided", "Large Capacity"],
    },
    {
      id: 3,
      name: "Irrigation System",
      type: "Irrigation",
      rate: "Per Week",
      price: 200,
      location: "Wau",
      owner: "Water Tech",
      image: "💧",
      available: false,
      rating: 4.7,
      description: "Complete drip irrigation system for water-efficient farming",
      specifications: ["Solar Powered", "Smart Controls", "5 Hectare Coverage"],
    },
    {
      id: 4,
      name: "Seed Planter",
      type: "Planting Equipment",
      rate: "Per Day",
      price: 45,
      location: "Juba",
      owner: "AgriTools",
      image: "🌱",
      available: true,
      rating: 4.6,
      description: "Precision seed planter for optimal crop spacing",
      specifications: ["Multi-Crop", "Adjustable Spacing", "Fertilizer Attachment"],
    },
    {
      id: 5,
      name: "Crop Sprayer",
      type: "Spraying Equipment",
      rate: "Per Day",
      price: 35,
      location: "Yei",
      owner: "Spray Masters",
      image: "🚿",
      available: true,
      rating: 4.5,
      description: "Efficient crop sprayer for pesticide and fertilizer application",
      specifications: ["500L Tank", "Boom Sprayer", "Variable Rate"],
    },
  ])

  const [myRequests] = useState([
    {
      id: 1,
      equipment: "John Deere Tractor",
      owner: "Equipment Co.",
      startDate: "2024-01-15",
      endDate: "2024-01-18",
      status: "approved",
      totalCost: 225,
    },
    {
      id: 2,
      equipment: "Seed Planter",
      owner: "AgriTools",
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      status: "pending",
      totalCost: 90,
    },
  ])

  const categories = [
    { id: "all", name: "All Equipment", icon: "🔧" },
    { id: "heavy", name: "Heavy Machinery", icon: "🚜" },
    { id: "irrigation", name: "Irrigation", icon: "💧" },
    { id: "planting", name: "Planting", icon: "🌱" },
    { id: "spraying", name: "Spraying", icon: "🚿" },
  ]

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.type.toLowerCase().includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const handleRentRequest = (equipment) => {
    alert(`Rental request sent for ${equipment.name}! Owner will be contacted.`)
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar />

      <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "0.5rem",
            }}
          >
            Equipment Rental 🚜
          </h1>
          <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>
            Access modern farming equipment without the huge upfront costs
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            borderBottom: "2px solid #f1f5f9",
          }}
        >
          <TabButton
            active={activeTab === "browse"}
            onClick={() => setActiveTab("browse")}
            icon="🔍"
            text="Browse Equipment"
          />
          <TabButton
            active={activeTab === "requests"}
            onClick={() => setActiveTab("requests")}
            icon="📋"
            text="My Requests"
          />
          <TabButton
            active={activeTab === "list"}
            onClick={() => setActiveTab("list")}
            icon="➕"
            text="List Equipment"
          />
        </div>

        {/* Browse Equipment Tab */}
        {activeTab === "browse" && (
          <>
            {/* Search and Filters */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "2rem",
                marginBottom: "2rem",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "1rem",
                  alignItems: "end",
                }}
              >
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>
                    Search Equipment
                  </label>
                  <input
                    type="text"
                    placeholder="Search for equipment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.875rem",
                      border: "2px solid #e5e7eb",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.875rem",
                      border: "2px solid #e5e7eb",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      outline: "none",
                      backgroundColor: "white",
                    }}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Equipment Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "2rem",
              }}
            >
              {filteredEquipment.map((item) => (
                <EquipmentCard key={item.id} equipment={item} onRent={handleRentRequest} />
              ))}
            </div>
          </>
        )}

        {/* My Requests Tab */}
        {activeTab === "requests" && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "2rem", color: "#1f2937" }}>
              My Equipment Requests
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {myRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          </div>
        )}

        {/* List Equipment Tab */}
        {activeTab === "list" && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "2rem", color: "#1f2937" }}>
              List Your Equipment
            </h3>
            <ListEquipmentForm />
          </div>
        )}
      </div>
    </div>
  )
}

const TabButton = ({ active, onClick, icon, text }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "1rem 2rem",
      border: "none",
      backgroundColor: "transparent",
      color: active ? "#16a34a" : "#6b7280",
      fontWeight: active ? "600" : "500",
      borderBottom: active ? "3px solid #16a34a" : "3px solid transparent",
      cursor: "pointer",
      transition: "all 0.2s",
    }}
  >
    <span>{icon}</span>
    {text}
  </button>
)

const EquipmentCard = ({ equipment, onRent }) => (
  <div
    style={{
      backgroundColor: "white",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      border: "1px solid #f1f5f9",
      transition: "all 0.3s",
    }}
  >
    {/* Equipment Image */}
    <div
      style={{
        height: "200px",
        background: "linear-gradient(135deg, #fef3c7, #fde68a)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "4rem",
        position: "relative",
      }}
    >
      {equipment.image}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          backgroundColor: equipment.available ? "#dcfce7" : "#fef2f2",
          color: equipment.available ? "#16a34a" : "#dc2626",
          borderRadius: "20px",
          padding: "0.25rem 0.75rem",
          fontSize: "0.8rem",
          fontWeight: "600",
        }}
      >
        {equipment.available ? "Available" : "Rented"}
      </div>
      <div
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "0.25rem 0.75rem",
          fontSize: "0.8rem",
          fontWeight: "600",
          color: "#16a34a",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
        }}
      >
        ⭐ {equipment.rating}
      </div>
    </div>

    {/* Equipment Info */}
    <div style={{ padding: "1.5rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <h3
          style={{
            fontSize: "1.3rem",
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: "0.5rem",
          }}
        >
          {equipment.name}
        </h3>
        <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "0.5rem" }}>{equipment.description}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {equipment.specifications.map((spec, index) => (
            <span
              key={index}
              style={{
                backgroundColor: "#f3f4f6",
                color: "#374151",
                padding: "0.25rem 0.5rem",
                borderRadius: "12px",
                fontSize: "0.8rem",
              }}
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#f59e0b",
            }}
          >
            ${equipment.price}/{equipment.rate}
          </span>
          <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>{equipment.type}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#6b7280" }}>
          <span>👤 {equipment.owner}</span>
          <span>📍 {equipment.location}</span>
        </div>
      </div>

      <button
        onClick={() => onRent(equipment)}
        disabled={!equipment.available}
        style={{
          width: "100%",
          background: equipment.available
            ? "linear-gradient(135deg, #f59e0b, #fbbf24)"
            : "#9ca3af",
          color: "white",
          border: "none",
          padding: "0.875rem",
          borderRadius: "10px",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: equipment.available ? "pointer" : "not-allowed",
          transition: "all 0.3s",
          boxShadow: equipment.available ? "0 4px 15px rgba(245, 158, 11, 0.3)" : "none",
        }}
      >
        {equipment.available ? "Request Rental" : "Currently Rented"}
      </button>
    </div>
  </div>
)

const RequestCard = ({ request }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return { bg: "#dcfce7", color: "#16a34a" }
      case "pending":
        return { bg: "#fef3c7", color: "#f59e0b" }
      case "rejected":
        return { bg: "#fef2f2", color: "#dc2626" }
      default:
        return { bg: "#f3f4f6", color: "#6b7280" }
    }
  }

  const statusStyle = getStatusColor(request.status)

  return (
    <div
      style={{
        border: "1px solid #f1f5f9",
        borderRadius: "12px",
        padding: "1.5rem",
        backgroundColor: "#fafafa",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
        <div>
          <h4 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#1f2937", marginBottom: "0.5rem" }}>
            {request.equipment}
          </h4>
          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Owner: {request.owner}</p>
        </div>
        <span
          style={{
            backgroundColor: statusStyle.bg,
            color: statusStyle.color,
            padding: "0.25rem 0.75rem",
            borderRadius: "20px",
            fontSize: "0.8rem",
            fontWeight: "600",
            textTransform: "capitalize",
          }}
        >
          {request.status}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", fontSize: "0.9rem" }}>
        <div>
          <span style={{ color: "#6b7280" }}>Start Date: </span>
          <strong>{request.startDate}</strong>
        </div>
        <div>
          <span style={{ color: "#6b7280" }}>End Date: </span>
          <strong>{request.endDate}</strong>
        </div>
        <div>
          <span style={{ color: "#6b7280" }}>Total Cost: </span>
          <strong style={{ color: "#16a34a" }}>${request.totalCost}</strong>
        </div>
      </div>
    </div>
  )
}

const ListEquipmentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    price: "",
    rate: "Per Day",
    location: "",
    specifications: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Equipment listed successfully! It will be reviewed and published soon.")
    setFormData({
      name: "",
      type: "",
      description: "",
      price: "",
      rate: "Per Day",
      location: "",
      specifications: "",
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>
            Equipment Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none",
            }}
            placeholder="e.g., John Deere Tractor"
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>
            Equipment Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none",
              backgroundColor: "white",
            }}
          >
            <option value="">Select Type</option>
            <option value="Heavy Machinery">Heavy Machinery</option>
            <option value="Irrigation">Irrigation</option>
            <option value="Planting Equipment">Planting Equipment</option>
            <option value="Spraying Equipment">Spraying Equipment</option>
            <option value="Harvesting Equipment">Harvesting Equipment</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="3"
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "2px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "1rem",
            outline: "none",
            resize: "vertical",
          }}
          placeholder="Describe your equipment, its condition, and capabilities..."
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>
            Price ($)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="1"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none",
            }}
            placeholder="75"
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>
            Rate
          </label>
          <select
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none",
              backgroundColor: "white",
            }}
          >
            <option value="Per Hour">Per Hour</option>
            <option value="Per Day">Per Day</option>
            <option value="Per Week">Per Week</option>
            <option value="Per Month">Per Month</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none",
            }}
            placeholder="Juba"
          />
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#374151" }}>
          Specifications (comma-separated)
        </label>
        <input
          type="text"
          name="specifications"
          value={formData.specifications}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "2px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "1rem",
            outline: "none",
          }}
          placeholder="150 HP, 4WD, Air Conditioned"
        />
      </div>

      <button
        type="submit"
        style={{
          background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
          color: "white",
          border: "none",
          padding: "1rem 2rem",
          borderRadius: "10px",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.3s",
          boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)",
        }}
      >
        List Equipment
      </button>
    </form>
  )
}

export default EquipmentPage
