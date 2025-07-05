const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL || "https://smart-farm-advisory-d46b4015b13a.herokuapp.com"
    : "http://localhost:8000";

const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,

  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login/`,
    REGISTER: `${API_BASE_URL}/api/auth/register/`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout/`,
    PROFILE: `${API_BASE_URL}/api/auth/profile/`,
  },

  USERS: {
    LIST: `${API_BASE_URL}/api/users/`,
    PROFILE: `${API_BASE_URL}/api/users/profile/`,
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
    VEHICLES: `${API_BASE_URL}/api/transports/vehicles/`,
  },

  WEATHER: {
    CURRENT: `${API_BASE_URL}/api/weather/data/current/`,
    DATA: `${API_BASE_URL}/api/weather/data/`,
    ALERTS: `${API_BASE_URL}/api/weather/alerts/`,
  },

  EDUCATION: {
    VIDEOS: `${API_BASE_URL}/api/education/videos/`,
    CATEGORIES: `${API_BASE_URL}/api/education/categories/`,
  },
};

export default API_ENDPOINTS;
