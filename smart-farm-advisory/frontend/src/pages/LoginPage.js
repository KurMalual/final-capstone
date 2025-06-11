"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/UserContext"

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Configure axios to include credentials for session-based auth
      axios.defaults.withCredentials = true

      const response = await axios.post("http://localhost:8000/api/auth/login/", credentials, {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      })

      // Set the user in context
      login(response.data)

      // Redirect based on user type
      switch (response.data.user_type) {
        case "farmer":
          navigate("/farmer-dashboard")
          break
        case "buyer":
          navigate("/buyer-dashboard")
          break
        case "transporter":
          navigate("/transporter-dashboard")
          break
        case "equipment_seller":
          navigate("/equipment-dashboard")
          break
        default:
          navigate("/")
      }
    } catch (err) {
      console.error("Login error:", err)
      if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError("Invalid username or password. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2>Login to Your Account</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="signup-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </div>

        <div className="guest-link">
          <Link to="/">Continue as Guest to Marketplace</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
