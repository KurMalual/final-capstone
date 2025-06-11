"use client"

import { createContext, useState, useContext, type ReactNode } from "react"
import { api } from "../services/api"

interface User {
  id: number
  username: string
  email: string
  role: "farmer" | "buyer" | "transporter" | "equipment_seller"
  first_name: string
  last_name: string
}

interface UserContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  // Check if there's a token in localStorage on initial load
  useState(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const response = await api.get("/auth/user/")
          setUser(response.data)
        } catch (error) {
          console.error("Authentication error:", error)
          localStorage.removeItem("token")
        }
      }
    }

    checkAuth()
  })

  const login = async (username: string, password: string) => {
    setLoading(true)
    try {
      const response = await api.post("/auth/login/", { username, password })
      localStorage.setItem("token", response.data.token)

      // Get user details
      const userResponse = await api.get("/auth/user/")
      setUser(userResponse.data)
      setLoading(false)
      return true
    } catch (error) {
      console.error("Login error:", error)
      setLoading(false)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
