import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    
    // Don't set Content-Type for FormData - let browser handle it
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
  getCurrentUser: () => {
    console.log('API: Making request to /auth/dashboard/');
    return api.get('/auth/dashboard/')
      .then(response => {
        console.log('API: Dashboard response received:', response);
        return response;
      })
      .catch(error => {
        console.error('API: Dashboard request failed:', error);
        throw error;
      });
  },
};

// Equipment API calls
export const equipmentAPI = {
  getAll: () => api.get('/equipment/'),
  create: (data) => api.post('/equipment/', data),
  update: (id, data) => api.put(`/equipment/${id}/`, data),
  delete: (id) => api.delete(`/equipment/${id}/`),
  
  // Rental requests
  getRentalRequests: () => api.get('/equipment-rental-requests/'),
  createRentalRequest: (data) => api.post('/equipment-rental-requests/', data),
  approveRental: (id) => api.post(`/equipment-rental-requests/${id}/approve/`),
  rejectRental: (id) => api.post(`/equipment-rental-requests/${id}/reject/`),
};

// Transport API calls
export const transportAPI = {
  getAll: () => api.get('/transports/'),
  create: (data) => api.post('/transports/', data),
  update: (id, data) => api.put(`/transports/${id}/`, data),
  delete: (id) => api.delete(`/transports/${id}/`),
  
  // Transport requests
  getTransportRequests: () => api.get('/transport-requests/'),
  createTransportRequest: (data) => api.post('/transport-requests/', data),
  approveTransport: (id) => api.post(`/transport-requests/${id}/approve/`),
  rejectTransport: (id) => api.post(`/transport-requests/${id}/reject/`),
};

// Marketplace API calls
export const marketplaceAPI = {
  getProducts: () => api.get('/products/'),
  createProduct: (data) => api.post('/products/', data),
  updateProduct: (id, data) => api.put(`/products/${id}/`, data),
  deleteProduct: (id) => api.delete(`/products/${id}/`),
  
  // Product orders
  getOrders: () => api.get('/product-orders/'),
  createOrder: (data) => api.post('/product-orders/', data),
  approveOrder: (id) => api.post(`/product-orders/${id}/approve/`),
  rejectOrder: (id) => api.post(`/product-orders/${id}/reject/`),
};

// Weather API calls
export const weatherAPI = {
  getWeatherData: () => api.get('/weather/'),
  getSouthSudanWeather: () => api.get('/weather/south-sudan/'),
  fetchWeather: (location) => api.get(`/weather/fetch/?location=${location}`),
};

// Education API calls
export const educationAPI = {
  getResources: () => api.get('/educational-resources/'),
  createResource: (data) => api.post('/educational-resources/', data),
};

export default api;
