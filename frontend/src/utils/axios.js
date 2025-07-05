import axios from "axios"
import API_ENDPOINTS from "../config/api"

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: 30000, // 30 seconds timeout
  withCredentials: true, // Important for CORS with credentials
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add CSRF token if available
    const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]")?.value
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken
    }

    // Log request for debugging
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    console.log(`🌐 Full URL: ${config.baseURL}${config.url}`)
    if (config.headers.Authorization) {
      console.log("🔑 Auth token included")
    }

    return config
  },
  (error) => {
    console.error("❌ Request interceptor error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`)
    console.error("Error details:", error.response?.data)

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      console.log("🔓 Unauthorized - clearing token")
      localStorage.removeItem("token")
      // Optionally redirect to login
      // window.location.href = '/login'
    }

    // Handle 403 errors (forbidden)
    if (error.response?.status === 403) {
      console.log("🚫 Forbidden - check authentication")
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
