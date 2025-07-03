// API Configuration
const API_BASE_URL = process.env.NODE_ENV === "production" ? window.location.origin : "http://localhost:8000"

const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,

  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login/`,
    REGISTER: `${API_BASE_URL}/api/auth/register/`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout/`,
    PROFILE: `${API_BASE_URL}/api/auth/profile/`,
  },

  // Users
  USERS: {
    LIST: `${API_BASE_URL}/api/users/`,
    PROFILE: `${API_BASE_URL}/api/users/profile/`,
  },

  // Products - Updated to match ViewSet pattern
  PRODUCTS: {
    LIST: `${API_BASE_URL}/api/products/`,
    MY_PRODUCTS: `${API_BASE_URL}/api/products/my_products/`,
    ORDERS: `${API_BASE_URL}/api/products/orders/`,
  },

  // Equipment
  EQUIPMENT: {
    LIST: `${API_BASE_URL}/api/equipment/`,
    RENTALS: `${API_BASE_URL}/api/equipment/rentals/`,
  },

  // Transportation - Updated to match your working pattern
  TRANSPORT: {
    LIST: `${API_BASE_URL}/api/transports/`,
    AVAILABLE: `${API_BASE_URL}/api/transports/available_jobs/`,
    VEHICLES: `${API_BASE_URL}/api/transports/vehicles/`,
  },

  // Weather - Updated to match your working pattern
  WEATHER: {
    CURRENT: `${API_BASE_URL}/api/weather/data/current/`,
    DATA: `${API_BASE_URL}/api/weather/data/`,
    ALERTS: `${API_BASE_URL}/api/weather/alerts/`,
  },

  // Education - FIXED: Removed the extra "api" in the path
  EDUCATION: {
    VIDEOS: `${API_BASE_URL}/api/education/videos/`,
    CATEGORIES: `${API_BASE_URL}/api/education/categories/`,
  },
}

export default API_ENDPOINTS
