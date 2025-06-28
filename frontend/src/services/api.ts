import axios from "axios"

// Create axios instance with base URL
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// API services for different resources
export const authService = {
  login: (username: string, password: string) => api.post("/auth/login/", { username, password }),
  register: (userData: any) => api.post("/auth/register/", userData),
  getCurrentUser: () => api.get("/auth/user/"),
}

export const productsService = {
  getProducts: () => api.get("/products/"),
  getProduct: (id: number) => api.get(`/products/${id}/`),
  createProduct: (productData: any) => api.post("/products/", productData),
  updateProduct: (id: number, productData: any) => api.put(`/products/${id}/`, productData),
  deleteProduct: (id: number) => api.delete(`/products/${id}/`),
}

export const equipmentService = {
  getEquipment: () => api.get("/equipment/"),
  getEquipmentItem: (id: number) => api.get(`/equipment/${id}/`),
  createEquipment: (equipmentData: any) => api.post("/equipment/", equipmentData),
  updateEquipment: (id: number, equipmentData: any) => api.put(`/equipment/${id}/`, equipmentData),
  deleteEquipment: (id: number) => api.delete(`/equipment/${id}/`),
  requestEquipment: (id: number, requestData: any) => api.post(`/equipment/${id}/request/`, requestData),
}

export const transportService = {
  getTransports: () => api.get("/transports/"),
  getTransport: (id: number) => api.get(`/transports/${id}/`),
  createTransport: (transportData: any) => api.post("/transports/", transportData),
  updateTransport: (id: number, transportData: any) => api.put(`/transports/${id}/`, transportData),
  deleteTransport: (id: number) => api.delete(`/transports/${id}/`),
  requestTransport: (id: number, requestData: any) => api.post(`/transports/${id}/request/`, requestData),
}

export const weatherService = {
  getWeather: (location: string) => api.get(`/weather/?location=${location}`),
}
