"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const UserContext = createContext()

// Helper function to get CSRF cookie
function getCookie(name) {
  let cookieValue = null
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

export const useAuth = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Configure axios defaults
    axios.defaults.withCredentials = true
    axios.defaults.baseURL = "http://localhost:8000"

    // Add request interceptor to handle authentication and CSRF token
    axios.interceptors.request.use(
      async (config) => {
        console.log(`🔄 Making ${config.method?.toUpperCase()} request to: ${config.url}`)

        // Get token from localStorage
        const token = localStorage.getItem("authToken")
        if (token) {
          config.headers.Authorization = `Token ${token}`
        }

        // Handle CSRF token for state-changing requests
        if (["post", "put", "patch", "delete"].includes(config.method?.toLowerCase())) {
          let csrfToken = getCookie("csrftoken")

          // If no CSRF token, get one from the server
          if (!csrfToken) {
            try {
              console.log("🔄 Getting CSRF token...")
              const csrfResponse = await axios.get("/api/users/csrf/", {
                withCredentials: true,
                headers: {}, // Don't include auth headers for CSRF request
              })
              csrfToken = getCookie("csrftoken")
              console.log("✅ CSRF token obtained")
            } catch (error) {
              console.warn("⚠️ Failed to get CSRF token:", error)
            }
          }

          if (csrfToken) {
            config.headers["X-CSRFToken"] = csrfToken
            console.log("✅ CSRF token added to request")
          } else {
            console.warn("⚠️ No CSRF token available")
          }
        }

        // Set content type for non-FormData requests
        if (config.method !== "get" && !(config.data instanceof FormData)) {
          config.headers["Content-Type"] = "application/json"
        }

        console.log("📤 Request headers:", {
          Authorization: config.headers.Authorization ? "Token ***" : "None",
          "X-CSRFToken": config.headers["X-CSRFToken"] ? "Present" : "Missing",
          "Content-Type": config.headers["Content-Type"],
        })

        return config
      },
      (error) => {
        console.error("❌ Request interceptor error:", error)
        return Promise.reject(error)
      },
    )

    // Add response interceptor
    axios.interceptors.response.use(
      (response) => {
        console.log(`✅ ${response.status} response from: ${response.config.url}`)
        return response
      },
      (error) => {
        console.error("❌ Response error:", {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        })

        if (error.response?.status === 401) {
          console.log("🔄 401 error - clearing user state")
          setUser(null)
          localStorage.removeItem("authToken")
        }
        return Promise.reject(error)
      },
    )

    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("/api/users/profile/")
        if (response.data) {
          setUser(response.data)
          console.log("✅ User authenticated:", response.data.username)
        }
      } catch (error) {
        console.log("ℹ️ Not authenticated")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (username, password) => {
    try {
      console.log("🔄 Starting login process for:", username)

      // First get CSRF token
      await axios.get("/api/users/csrf/")
      console.log("✅ CSRF token obtained for login")

      const response = await axios.post("/api/auth/login/", {
        username,
        password,
      })

      console.log("📥 Login response:", response.data)

      if (response.data.success) {
        setUser(response.data.user)
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token)
        }
        console.log("✅ Login successful for:", response.data.user.username)
        return { success: true }
      } else {
        console.log("❌ Login failed:", response.data.error)
        return { success: false, error: response.data.error }
      }
    } catch (error) {
      console.error("❌ Login error:", error)
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      }
    }
  }

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout/")
    } catch (error) {
      console.error("❌ Logout error:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("authToken")
      window.location.href = "/"
    }
  }

  const signup = async (userData) => {
    try {
      // First get CSRF token
      await axios.get("/api/users/csrf/")

      const response = await axios.post("/api/auth/signup/", userData)

      if (response.data.success) {
        return { success: true }
      } else {
        return { success: false, error: response.data.error }
      }
    } catch (error) {
      console.error("❌ Signup error:", error)
      return {
        success: false,
        error: error.response?.data?.error || "Signup failed",
      }
    }
  }

  const value = {
    user,
    login,
    logout,
    signup,
    loading,
    isAuthenticated: !!user,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
