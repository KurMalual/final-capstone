"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useUser } from "../context/UserContext"
import Navbar from "../components/Navbar"

const DashboardPage = () => {
  const { user } = useUser()
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 12,
    totalSales: 45,
    totalRevenue: 2340,
    pendingOrders: 8,
  })

  useEffect(() => {
    // Simulate loading weather data
    setTimeout(() => {
      setWeather({
        temperature: 28,
        condition: "Partly Cloudy",
        location: "Juba, South Sudan",
        humidity: 65,
        windSpeed: 12,
      })
      setLoading(false)
    }, 1000)
  }, [])

  const getWeatherIcon = (condition) => {
    if (condition.includes("Sunny") || condition.includes("Clear")) return "☀️"
    if (condition.includes("Cloudy")) return "⛅"
    if (condition.includes("Rain")) return "🌧️"
    return "🌤️"
  }

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case "farmer":
        return {
          title: "Farmer Dashboard",
          quickActions: [
            { title: "Add Product", icon: "🌾", link: "/marketplace", color: "#16a34a" },
            { title: "Check Weather", icon: "🌤️", link: "/weather", color: "#3b82f6" },
            { title: "Rent Equipment", icon: "🚜", link: "/equipment", color: "#f59e0b" },
            { title: "Request Transport", icon: "🚛", link: "/transportation", color: "#8b5cf6" },
          ],
        }
      case "buyer":
        return {
          title: "Buyer Dashboard",
          quickActions: [
            { title: "Browse Products", icon: "🛒", link: "/marketplace", color: "#16a34a" },
            { title: "My Orders", icon: "📦", link: "/orders", color: "#3b82f6" },
            { title: "Find Transport", icon: "🚛", link: "/transportation", color: "#8b5cf6" },
            { title: "Market Trends", icon: "📈", link: "/analytics", color: "#f59e0b" },
          ],
        }
      case "transporter":
        return {
          title: "Transporter Dashboard",
          quickActions: [
            { title: "Available Jobs", icon: "🚛", link: "/transportation", color: "#8b5cf6" },
            { title: "My Vehicles", icon: "🚚", link: "/vehicles", color: "#16a34a" },
            { title: "Route Planning", icon: "🗺️", link: "/routes", color: "#3b82f6" },
            { title: "Earnings", icon: "💰", link: "/earnings", color: "#f59e0b" },
          ],
        }
      case "equipment_seller":
        return {
          title: "Equipment Provider Dashboard",
          quickActions: [
            { title: "My Equipment", icon: "🚜", link: "/equipment", color: "#f59e0b" },
            { title: "Rental Requests", icon: "📋", link: "/requests", color: "#3b82f6" },
            { title: "Add Equipment", icon: "➕", link: "/equipment/add", color: "#16a34a" },
            { title: "Maintenance", icon: "🔧", link: "/maintenance", color: "#8b5cf6" },
          ],
        }
      default:
        return {
          title: "Dashboard",
          quickActions: [
            { title: "Marketplace", icon: "🛒", link: "/marketplace", color: "#16a34a" },
            { title: "Equipment", icon: "🚜", link: "/equipment", color: "#f59e0b" },
            { title: "Transportation", icon: "🚛", link: "/transportation", color: "#8b5cf6" },
            { title: "Weather", icon: "🌤️", link: "/weather", color: "#3b82f6" },
          ],
        }
    }
  }

  const roleContent = getRoleSpecificContent()

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Navbar />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "0.5rem",
            }}
          >
            Welcome back, {user?.firstName || user?.username}! 👋
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#6b7280" }}>
            Here's what's happening with your {user?.role} account today.
          </p>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <StatCard title="Total Products" value={stats.totalProducts} icon="🌾" color="#16a34a" />
          <StatCard title="Total Sales" value={stats.totalSales} icon="💰" color="#3b82f6" />
          <StatCard title="Revenue (USD)" value={`$${stats.totalRevenue}`} icon="📈" color="#f59e0b" />
          <StatCard title="Pending Orders" value={stats.pendingOrders} icon="📦" color="#8b5cf6" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
          {/* Quick Actions */}
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "1.5rem",
                color: "#1f2937",
              }}
            >
              Quick Actions
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              {roleContent.quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  style={{
                    textDecoration: "none",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    border: `2px solid ${action.color}20`,
                    backgroundColor: `${action.color}05`,
                    transition: "all 0.3s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)"
                    e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)"
                    e.target.style.boxShadow = "none"
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {action.icon}
                  </div>
                  <span
                    style={{
                      fontWeight: "600",
                      color: action.color,
                    }}
                  >
                    {action.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Weather Card */}
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h3
              style={{
                fontSize: "1.3rem",
                fontWeight: "600",
                marginBottom: "1rem",
                color: "#1f2937",
              }}
            >
              Current Weather
            </h3>
            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "4px solid #e5e7eb",
                    borderTop: "4px solid #16a34a",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto 1rem",
                  }}
                ></div>
                <p style={{ color: "#6b7280" }}>Loading weather...</p>
              </div>
            ) : weather ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{getWeatherIcon(weather.condition)}</div>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginBottom: "0.5rem",
                  }}
                >
                  {weather.temperature}°C
                </div>
                <div style={{ color: "#6b7280", marginBottom: "1rem" }}>{weather.condition}</div>
                <div style={{ fontSize: "0.9rem", color: "#9ca3af" }}>{weather.location}</div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginTop: "1rem",
                    fontSize: "0.9rem",
                  }}
                >
                  <div>
                    <div style={{ color: "#6b7280" }}>Humidity</div>
                    <div style={{ fontWeight: "600" }}>{weather.humidity}%</div>
                  </div>
                  <div>
                    <div style={{ color: "#6b7280" }}>Wind</div>
                    <div style={{ fontWeight: "600" }}>{weather.windSpeed} km/h</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "#6b7280" }}>Weather data unavailable</div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "1.5rem",
              color: "#1f2937",
            }}
          >
            Recent Activity
          </h2>
          <div style={{ space: "1rem" }}>
            <ActivityItem
              icon="🌾"
              title="New product listed"
              description="Sorghum - 50 bags available"
              time="2 hours ago"
              color="#16a34a"
            />
            <ActivityItem
              icon="💰"
              title="Sale completed"
              description="Groundnuts sold to John Buyer"
              time="5 hours ago"
              color="#3b82f6"
            />
            <ActivityItem
              icon="🚜"
              title="Equipment rented"
              description="Tractor rental approved"
              time="1 day ago"
              color="#f59e0b"
            />
            <ActivityItem
              icon="🌤️"
              title="Weather alert"
              description="Rain expected tomorrow"
              time="2 days ago"
              color="#8b5cf6"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

const StatCard = ({ title, value, icon, color }) => (
  <div
    style={{
      backgroundColor: "white",
      padding: "1.5rem",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      border: `2px solid ${color}20`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "0.5rem" }}>{title}</p>
        <p
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: color,
            margin: 0,
          }}
        >
          {value}
        </p>
      </div>
      <div
        style={{
          fontSize: "2.5rem",
          opacity: 0.7,
        }}
      >
        {icon}
      </div>
    </div>
  </div>
)

const ActivityItem = ({ icon, title, description, time, color }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      padding: "1rem",
      borderRadius: "12px",
      marginBottom: "1rem",
      backgroundColor: `${color}05`,
      border: `1px solid ${color}20`,
    }}
  >
    <div
      style={{
        fontSize: "1.5rem",
        marginRight: "1rem",
        width: "40px",
        height: "40px",
        backgroundColor: `${color}20`,
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <h4 style={{ margin: 0, marginBottom: "0.25rem", color: "#1f2937" }}>{title}</h4>
      <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>{description}</p>
    </div>
    <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>{time}</div>
  </div>
)

export default DashboardPage
