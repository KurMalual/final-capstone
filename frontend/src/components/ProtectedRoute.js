"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/UserContext"

const ProtectedRoute = ({ children, userType }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  // If userType is specified, check if the user has the required role
  if (userType && user.user_type !== userType) {
    // Redirect to the appropriate dashboard based on user type
    switch (user.user_type) {
      case "farmer":
        return <Navigate to="/farmer-dashboard" />
      case "buyer":
        return <Navigate to="/buyer-dashboard" />
      case "transporter":
        return <Navigate to="/transporter-dashboard" />
      case "equipment_seller":
        return <Navigate to="/equipment-dashboard" />
      default:
        return <Navigate to="/" />
    }
  }

  return children
}

export default ProtectedRoute
