"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const UserContext = createContext()

export const useAuth = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Configure axios defaults
    axios.defaults.withCredentials = true
    axios.defaults.baseURL = "http://localhost:8000"

    // Add request interceptor to handle CSRF
    axios.interceptors.request.use(
      (config) => {
        // For POST requests, ensure we're sending JSON
        if (config.method === "post" || config.method === "put" || config.method === "patch") {
          config.headers["Content-Type"] = "application/json"
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Add response interceptor to handle auth errors
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear user state on 401 errors
          setUser(null)
        }
        return Promise.reject(error)
      },
    )

    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/auth/profile/")
        setUser(response.data)
      } catch (error) {
        console.log("No active session")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = (userData) => {
    setUser(userData)
  }

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout/")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      // Clear any stored session data
      localStorage.clear()
      sessionStorage.clear()
      // Redirect to home page
      window.location.href = "/"
    }
  }

  return <UserContext.Provider value={{ user, loading, login, logout }}>{children}</UserContext.Provider>
}
