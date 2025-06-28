"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const WeatherDashboard = ({ userLocation }) => {
  const [weatherData, setWeatherData] = useState(null)
  const [weatherAlerts, setWeatherAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState(userLocation || "Juba")

  const southSudanCities = ["Juba", "Wau", "Malakal", "Yei", "Aweil", "Bentiu", "Bor", "Torit"]

  useEffect(() => {
    fetchWeatherData()
  }, [selectedCity])

  const fetchWeatherData = async () => {
    try {
      setLoading(true)

      // Fetch current weather
      const weatherResponse = await axios.get(
        `http://localhost:8000/api/weather/data/current/?location=${selectedCity}`,
      )
      setWeatherData(weatherResponse.data)

      // Fetch weather alerts
      const alertsResponse = await axios.get(`http://localhost:8000/api/weather/alerts/?location=${selectedCity}`)
      setWeatherAlerts(alertsResponse.data)

      setLoading(false)
    } catch (error) {
      console.error("Error fetching weather data:", error)
      setLoading(false)
    }
  }

  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) return "🌧️"
    if (conditionLower.includes("cloud")) return "☁️"
    if (conditionLower.includes("sun") || conditionLower.includes("clear")) return "☀️"
    if (conditionLower.includes("storm")) return "⛈️"
    if (conditionLower.includes("snow")) return "❄️"
    return "🌤️"
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case "rain":
        return "🌧️"
      case "heat":
        return "🔥"
      case "storm":
        return "⛈️"
      case "drought":
        return "🏜️"
      case "frost":
        return "❄️"
      default:
        return "⚠️"
    }
  }

  if (loading) {
    return (
      <div className="weather-loading">
        <div className="loading-spinner"></div>
        <p>Loading weather data...</p>
      </div>
    )
  }

  return (
    <div className="weather-dashboard">
      <div className="weather-header">
        <h2>Weather Information</h2>
        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="city-selector">
          {southSudanCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {weatherData && (
        <div className="current-weather">
          <div className="weather-card main-weather">
            <div className="weather-icon">{getWeatherIcon(weatherData.weather_condition)}</div>
            <div className="weather-info">
              <h3>{weatherData.location}</h3>
              <div className="temperature">{Math.round(weatherData.temperature)}°C</div>
              <div className="condition">{weatherData.weather_condition}</div>
              <div className="last-updated">Updated: {new Date(weatherData.date).toLocaleString()}</div>
            </div>
          </div>

          <div className="weather-details">
            <div className="weather-detail-card">
              <div className="detail-icon">💧</div>
              <div className="detail-info">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weatherData.humidity}%</span>
              </div>
            </div>

            <div className="weather-detail-card">
              <div className="detail-icon">🌧️</div>
              <div className="detail-info">
                <span className="detail-label">Rainfall</span>
                <span className="detail-value">{weatherData.rainfall}mm</span>
              </div>
            </div>

            <div className="weather-detail-card">
              <div className="detail-icon">💨</div>
              <div className="detail-info">
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">{Math.round(weatherData.wind_speed)} km/h</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {weatherAlerts.length > 0 && (
        <div className="weather-alerts">
          <h3>Weather Alerts</h3>
          {weatherAlerts.map((alert, index) => (
            <div key={index} className={`alert-card severity-${alert.severity}`}>
              <div className="alert-icon">{getAlertIcon(alert.alert_type)}</div>
              <div className="alert-content">
                <div className="alert-type">{alert.alert_type.toUpperCase()} ALERT</div>
                <div className="alert-message">{alert.message}</div>
                <div className="alert-time">{new Date(alert.start_date).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="farming-tips">
        <h3>Today's Farming Tips</h3>
        <div className="tips-grid">
          {weatherData && weatherData.temperature > 30 && (
            <div className="tip-card">
              <div className="tip-icon">🌡️</div>
              <div className="tip-content">
                <h4>High Temperature Alert</h4>
                <p>Consider watering crops early morning or late evening to avoid heat stress.</p>
              </div>
            </div>
          )}

          {weatherData && weatherData.rainfall > 5 && (
            <div className="tip-card">
              <div className="tip-icon">🌧️</div>
              <div className="tip-content">
                <h4>Rainy Weather</h4>
                <p>Good time for planting. Ensure proper drainage to prevent waterlogging.</p>
              </div>
            </div>
          )}

          {weatherData && weatherData.humidity < 40 && (
            <div className="tip-card">
              <div className="tip-icon">💧</div>
              <div className="tip-content">
                <h4>Low Humidity</h4>
                <p>Monitor crops for signs of water stress and increase irrigation if needed.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WeatherDashboard
