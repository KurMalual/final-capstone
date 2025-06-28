// API configuration for single-app deployment
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "" // Same origin in production (served by Django)
    : process.env.REACT_APP_API_URL || "http://localhost:8000"

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/users/login/`,
    REGISTER: `${API_BASE_URL}/api/users/register/`,
    LOGOUT: `${API_BASE_URL}/api/users/logout/`,
  },
  PRODUCTS: {
    LIST: `${API_BASE_URL}/api/products/`,
    MY_PRODUCTS: `${API_BASE_URL}/api/products/my_products/`,
    ORDERS: `${API_BASE_URL}/api/products/orders/`,
  },
  EQUIPMENT: {
    LIST: `${API_BASE_URL}/api/equipment/`,
    RENTALS: `${API_BASE_URL}/api/equipment/rentals/`,
  },
  TRANSPORT: {
    LIST: `${API_BASE_URL}/api/transports/`,
    AVAILABLE: `${API_BASE_URL}/api/transports/available_jobs/`,
  },
  WEATHER: {
    CURRENT: `${API_BASE_URL}/api/weather/data/current/`,
  },
  EDUCATION: {
    VIDEOS: `${API_BASE_URL}/api/education/videos/`,
  },
}

export default API_ENDPOINTS
