"use client"

import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"

const WeatherPage = () => {
  const [selectedLocation, setSelectedLocation] = useState("Juba")
  const [weatherData, setWeatherData] = useState({
    current: {
      temperature: 28,
      condition: "Sunny",
      humidity: 65,
      windSpeed: 12,
      pressure: 1013,
      uvIndex: 8,
      visibility: 10,
      feelsLike: 32,
    },
    forecast: [
      { day: "Today", high: 32, low: 22, condition: "Sunny", icon: "☀️", precipitation: 0 },
      { day: "Tomorrow", high: 30, low: 20, condition: "Partly Cloudy", icon: "⛅", precipitation: 10 },
      { day: "Wednesday", high: 28, low: 18, condition: "Cloudy", icon: "☁️", precipitation: 30 },
      { day: "Thursday", high: 26, low: 16, condition: "Light Rain", icon: "🌦️", precipitation: 70 },
      { day: "Friday", high: 29, low: 19, condition: "Sunny", icon: "☀️", precipitation: 5 },
      { day: "Saturday", high: 31, low: 21, condition: "Sunny", icon: "☀️", precipitation: 0 },
      { day: "Sunday", high: 33, low: 23, condition: "Hot", icon: "🌡️", precipitation: 0 },
    ],
    alerts: [
      {
        id: 1,
        type: "warning",
        title: "High Temperature Alert",
        message: "Temperatures expected to reach 35°C. Ensure adequate irrigation for crops.",
        severity: "medium",
      },
      {
        id: 2,
        type: "info",
        title: "Optimal Planting Conditions",
        message: "Next week shows good conditions for planting with moderate temperatures and some rainfall.",
        severity: "low",
      },
    ],
  })

  const [farmingTips, setFarmingTips] = useState([
    {
      id: 1,
      title: "Irrigation Timing",
      tip: "With current sunny conditions, water your crops early morning or late evening to minimize evaporation.",
      icon: "💧",
    },
    {
      id: 2,
      title: "Pest Management",
      tip: "Warm weather may increase pest activity. Monitor your crops regularly for signs of infestation.",
      icon: "🐛",
    },
    {
      id: 3,
      title: "Harvest Planning",
      tip: "Clear skies are perfect for harvesting. Plan to complete harvest activities during this dry period.",
      icon: "🌾",
    },
  ])

  const locations = [
    { id: "juba", name: "Juba", region: "Central Equatoria" },
    { id: "yei", name: "Yei", region: "Central Equatoria" },
    { id: "wau", name: "Wau", region: "Western Bahr el Ghazal" },
    { id: "malakal", name: "Malakal", region: "Upper Nile" },
    { id: "torit", name: "Torit", region: "Eastern Equatoria" },
    { id: "aweil", name: "Aweil", region: "Northern Bahr el Ghazal" },
  ]

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return "☀️"
      case "partly cloudy":
        return "⛅"
      case "cloudy":
        return "☁️"
      case "light rain":
        return "🌦️"
      case "rain":
        return "🌧️"
      case "hot":
        return "🌡️"
      default:
        return "☀️"
    }
  }

  const getAlertColor = (severity) => {
    switch (severity) {
      case "high":
        return { bg: "#fef2f2", border: "#fecaca", text: "#dc2626" }
      case "medium":
        return { bg: "#fef3c7", border: "#fde68a", text: "#f59e0b" }
      case "low":
        return { bg: "#dbeafe", border: "#bfdbfe", text: "#3b82f6" }
      default:
        return { bg: "#f3f4f6", border: "#d1d5db", text: "#6b7280" }
    }
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
            Weather Intelligence 🌤️
          </h1>
          <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>
            Real-time weather data and forecasts to help you make informed farming decisions
          </p>
        </div>

        {/* Location Selector */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <label style={{ display: "block", marginBottom: "1rem", fontWeight: "600", color: "#374151", fontSize: "1.1rem" }}>
            Select Location
          </label>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location.name)}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "25px",
                  border: "2px solid",
                  borderColor: selectedLocation === location.name ? "#06b6d4" : "#e5e7eb",
                  backgroundColor: selectedLocation === location.name ? "#06b6d4" : "white",
                  color: selectedLocation === location.name ? "white" : "#374151",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontWeight: "500",
                }}
              >
                <div>{location.name}</div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>{location.region}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Weather */}
        <div
          style={{
            background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
            borderRadius: "20px",
            padding: "3rem",
            color: "white",
            marginBottom: "2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-100px",
              right: "-100px",
              width: "300px",
              height: "300px",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
            }}
          ></div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "6rem", marginBottom: "1rem" }}>
                  {getWeatherIcon(weatherData.current.condition)}
                </div>
                <div style={{ fontSize: "4rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                  {weatherData.current.temperature}°C
                </div>
                <div style={{ fontSize: "1.5rem", opacity: 0.9 }}>{weatherData.current.condition}</div>
                <div style={{ fontSize: "1.1rem", opacity: 0.8, marginTop: "0.5rem" }}>
                  Feels like {weatherData.current.feelsLike}°C
                </div>
              </div>
              <div>
                <h2 style={{ fontSize: "2rem", marginBottom: "2rem", fontWeight: "600" }}>
                  Current Weather in {selectedLocation}
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <WeatherDetail icon="💧" label="Humidity" value={`${weatherData.current.humidity}%`} />
                  <WeatherDetail icon="💨" label="Wind Speed" value={`${weatherData.current.windSpeed} km/h`} />
                  <WeatherDetail icon="🌡️" label="Pressure" value={`${weatherData.current.pressure} hPa`} />
                  <WeatherDetail icon="☀️" label="UV Index" value={weatherData.current.uvIndex} />
                  <WeatherDetail icon="👁️" label="Visibility" value={`${weatherData.current.visibility} km`} />
                  <WeatherDetail icon="🌡️" label="Feels Like" value={`${weatherData.current.feelsLike}°C`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "2rem", color: "#1f2937" }}>
            7-Day Forecast
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
            {weatherData.forecast.map((day, index) => (
              <ForecastCard key={index} forecast={day} />
            ))}
          </div>
        </div>

        {/* Weather Alerts and Farming Tips */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {/* Weather Alerts */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "2rem", color: "#1f2937" }}>
              Weather Alerts
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {weatherData.alerts.map((alert) => {
                const alertStyle = getAlertColor(alert.severity)
                return (
                  <div
                    key={alert.id}
                    style={{
                      backgroundColor: alertStyle.bg,
                      border: `1px solid ${alertStyle.border}`,
                      borderRadius: "12px",
                      padding: "1.5rem",
                    }}
                  >
                    <h4 style={{ color: alertStyle.text, fontWeight: "600", marginBottom: "0.5rem" }}>
                      {alert.title}
                    </h4>
                    <p style={{ color: alertStyle.text, fontSize: "0.9rem", lineHeight: "1.5" }}>
                      {alert.message}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Farming Tips */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "2rem", color: "#1f2937" }}>
              Weather-Based Farming Tips
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {farmingTips.map((tip) => (
                <div
                  key={tip.id}
                  style={{
                    backgroundColor: "#f0f9ff",
                    border: "1px solid #bae6fd",
                    borderRadius: "12px",
                    padding: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "1.5rem" }}>{tip.icon}</span>
                    <h4 style={{ color: "#0369a1", fontWeight: "600" }}>{tip.title}</h4>
                  </div>
                  <p style={{ color: "#0369a1", fontSize: "0.9rem", lineHeight: "1.5" }}>{tip.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const WeatherDetail = ({ icon, label, value }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
    <span style={{ fontSize: "1.5rem" }}>{icon}</span>
    <div>
      <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>{label}</div>
      <div style={{ fontSize: "1.1rem", fontWeight: "600" }}>{value}</div>
    </div>
  </div>
)

const ForecastCard = ({ forecast }) => (
  <div
    style={{
      backgroundColor: "#f8fafc",
      borderRadius: "12px",
      padding: "1.5rem",
      textAlign: "center",
      border: "1px solid #f1f5f9",
    }}
  >
    <div style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "0.5rem", fontWeight: "500" }}>
      {forecast.day}
    </div>
    <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{forecast.icon}</div>
    <div style={{ fontSize: "0.9rem", color: "#374151", marginBottom: "0.5rem" }}>{forecast.condition}</div>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
      <span style={{ fontWeight: "600", color: "#1f2937" }}>{forecast.high}°</span>
      <span style={{ color: "#6b7280" }}>{forecast.low}°</span>
    </div>
    <div style={{ fontSize: "0.8rem", color: "#06b6d4", fontWeight: "500" }}>
      💧 {forecast.precipitation}%
    </div>
  </div>
)

export default WeatherPage
