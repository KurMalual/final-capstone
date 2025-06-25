"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/UserContext"
import Footer from "../components/Footer"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("🔄 Attempting login with:", { username: formData.username })

      // Use the login function from UserContext
      const result = await login(formData.username, formData.password)

      if (result.success) {
        console.log("✅ Login successful, redirecting...")

        // Get user from context to determine redirect
        // We'll redirect in a moment to let the context update
        setTimeout(() => {
          // Default redirect - the context should have the user by now
          navigate("/farmer-dashboard")
        }, 100)
      } else {
        console.log("❌ Login failed:", result.error)
        setError(result.error || "Login failed. Please try again.")
      }
    } catch (error) {
      console.error("❌ Login error:", error)
      setError("Login failed. Please check your credentials and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <header className="auth-header">
        <Link to="/" className="home-link">
          <span className="logo-icon">🌱</span>
          Smart Farm Connect
        </Link>
      </header>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header-content">
            <h1>Welcome Back</h1>
            <p>Sign in to your Smart Farm Connect account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/signup">Sign up here</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default LoginPage
