// src/config/apiEndpoints.js

// Use Vercel's environment variable for production, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 
                     (process.env.NODE_ENV === 'production' 
                      ? window.location.origin 
                      : 'http://localhost:8000');

const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login/`,
    REGISTER: `${API_BASE_URL}/api/auth/register/`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout/`,
    PROFILE: `${API_BASE_URL}/api/auth/profile/`,
    CSRF: `${API_BASE_URL}/api/auth/csrf/`, // Added CSRF endpoint
  },

  // Users
  USERS: {
    LIST: `${API_BASE_URL}/api/users/`,
    DETAIL: (id) => `${API_BASE_URL}/api/users/${id}/`,
    PROFILE: `${API_BASE_URL}/api/users/profile/`,
  },

  // Products
  PRODUCTS: {
    LIST: `${API_BASE_URL}/api/products/`,
    DETAIL: (id) => `${API_BASE_URL}/api/products/${id}/`,
    MY_PRODUCTS: `${API_BASE_URL}/api/products/my_products/`,
    ORDERS: `${API_BASE_URL}/api/products/orders/`,
  },

  // Equipment
  EQUIPMENT: {
    LIST: `${API_BASE_URL}/api/equipment/`,
    DETAIL: (id) => `${API_BASE_URL}/api/equipment/${id}/`,
    RENTALS: `${API_BASE_URL}/api/equipment/rentals/`,
    AVAILABLE: `${API_BASE_URL}/api/equipment/available/`,
  },

  // Transportation
  TRANSPORT: {
    LIST: `${API_BASE_URL}/api/transports/`,
    DETAIL: (id) => `${API_BASE_URL}/api/transports/${id}/`,
    AVAILABLE: `${API_BASE_URL}/api/transports/available_jobs/`,
    VEHICLES: `${API_BASE_URL}/api/transports/vehicles/`,
  },

  // Weather
  WEATHER: {
    CURRENT: `${API_BASE_URL}/api/weather/data/current/`,
    FORECAST: `${API_BASE_URL}/api/weather/data/forecast/`,
    ALERTS: `${API_BASE_URL}/api/weather/alerts/`,
    LOCATIONS: `${API_BASE_URL}/api/weather/locations/`,
  },

  // Education
  EDUCATION: {
    VIDEOS: `${API_BASE_URL}/api/education/videos/`,
    DETAIL: (id) => `${API_BASE_URL}/api/education/videos/${id}/`,
    CATEGORIES: `${API_BASE_URL}/api/education/categories/`,
  },

  // Utility function for easy API calls
  createRequest: (endpoint, method = 'GET', data = null) => {
    return {
      url: endpoint,
      method,
      data,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': localStorage.getItem('csrftoken') || '',
      },
    };
  },
};

export default API_ENDPOINTS;