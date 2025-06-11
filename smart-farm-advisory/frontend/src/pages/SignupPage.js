"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/UserContext"

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    location: "",
    user_type: "farmer",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target

    // Handle the form field name mapping
    let fieldName = name
    if (name === "firstName") fieldName = "first_name"
    if (name === "lastName") fieldName = "last_name"
    if (name === "phoneNumber") fieldName = "phone_number"
    if (name === "userType") fieldName = "user_type"

    setFormData({
      ...formData,
      [fieldName]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    console.log("Submitting form data:", formData) // Debug log

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      setLoading(false)
      return
    }

    try {
      // Configure axios to include credentials
      axios.defaults.withCredentials = true

      // Prepare registration data
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        location: formData.location,
        user_type: formData.user_type,
      }

      console.log("Sending registration data:", registrationData) // Debug log

      // Register the user
      const registerResponse = await axios.post("http://localhost:8000/api/auth/register/", registrationData, {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      })

      console.log("Registration response:", registerResponse.data) // Debug log

      // After successful registration, log the user in
      const loginData = {
        username: formData.username,
        password: formData.password,
      }

      console.log("Attempting login with:", loginData) // Debug log

      const loginResponse = await axios.post("http://localhost:8000/api/auth/login/", loginData, {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      })

      console.log("Login response:", loginResponse.data) // Debug log

      // Set the user in context
      login(loginResponse.data)

      // Redirect based on user type
      switch (formData.user_type) {
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
      console.error("Registration/Login error:", err)
      if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else if (err.response?.data?.username) {
        setError("Username already exists. Please choose a different username.")
      } else if (err.response?.data?.email) {
        setError("Email already exists. Please use a different email.")
      } else {
        setError("Registration failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h2>Create Your Account</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="First name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Your location"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="userType">I am a: *</label>
            <select id="userType" name="userType" value={formData.user_type} onChange={handleChange} required>
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
              <option value="transporter">Transporter</option>
              <option value="equipment_seller">Equipment Seller</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
              placeholder="At least 8 characters"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="8"
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
