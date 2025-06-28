"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import "../App.css"

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [error, setError] = useState(null)

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: null,
  })

  // Refs for scrolling
  const aboutRef = useRef(null)
  const featuresRef = useRef(null)
  const contactRef = useRef(null)

  // Use useCallback to prevent recreation of this function on each render
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:8000/api/products/")
      // Ensure we always set an array, even if response.data is not an array
      setProducts(Array.isArray(response.data) ? response.data : [])
      setError(null)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to load products. Please try again later.")
      // Set empty array on error to prevent filter errors
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Only fetch once when component mounts
    fetchProducts()

    // Handle hash links on page load
    if (window.location.hash) {
      const id = window.location.hash.substring(1)
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    }
  }, [fetchProducts])

  // Function to handle smooth scrolling
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Handle contact form input changes
  const handleContactInputChange = (e) => {
    const { name, value } = e.target
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setFormStatus({
        submitting: false,
        success: false,
        error: "Please fill in all fields",
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactForm.email)) {
      setFormStatus({
        submitting: false,
        success: false,
        error: "Please enter a valid email address",
      })
      return
    }

    setFormStatus({
      submitting: true,
      success: false,
      error: null,
    })

    try {
      // In a real application, you would send this to your backend API
      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demonstration, log the form data
      console.log("Form submitted:", contactForm)

      // Reset form and show success message
      setContactForm({
        name: "",
        email: "",
        message: "",
      })

      setFormStatus({
        submitting: false,
        success: true,
        error: null,
      })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormStatus((prev) => ({
          ...prev,
          success: false,
        }))
      }, 5000)
    } catch (error) {
      console.error("Error submitting form:", error)
      setFormStatus({
        submitting: false,
        success: false,
        error: "Failed to send message. Please try again later.",
      })
    }
  }

  // Memoize filtered products to prevent recalculation on every render
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => {
        const matchesSearch =
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory ? product.category === selectedCategory : true
        return matchesSearch && matchesCategory
      })
    : []

  const categories = ["vegetables", "fruits", "grains", "livestock", "dairy", "other"]

  return (
    <div className="home-container">
      <Navbar />

      <header className="hero-section">
        <div className="hero-content">
          <div>
            <h1>Welcome to Smart Farm Connect</h1>
            <p>Empowering South Sudan's Agricultural Future Through Technology</p>
            <p className="hero-subtitle">
              Connecting farmers, buyers, transporters, and equipment providers in one unified platform
            </p>
            <div className="hero-buttons">
              <Link to="/signup" className="btn btn-primary">
                Get Started
              </Link>
              <a
                href="#about"
                className="btn btn-secondary"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection("about")
                }}
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="South Sudan Agriculture - Farmers working in green fields"
              onError={(e) => {
                e.target.onerror = null // Prevent infinite loop
                e.target.src =
                  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                e.target.alt = "Agricultural farming scene"
              }}
            />
          </div>
        </div>
      </header>

      <section id="about" className="about-section" ref={aboutRef}>
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About Smart Farm Connect</h2>
              <p>
                Smart Farm Connect is a revolutionary platform designed specifically for South Sudan's agricultural
                sector. We bridge the gap between farmers, buyers, equipment providers, and transporters, creating a
                thriving ecosystem that supports food security and economic growth.
              </p>
              <p>
                Our mission is to modernize agriculture in South Sudan by providing farmers with access to markets,
                equipment, transportation services, and real-time weather information tailored to local conditions.
              </p>
              <div className="about-stats">
                <div className="stat">
                  <h3>500+</h3>
                  <p>Registered Farmers</p>
                </div>
                <div className="stat">
                  <h3>200+</h3>
                  <p>Products Listed</p>
                </div>
                <div className="stat">
                  <h3>50+</h3>
                  <p>Equipment Available</p>
                </div>
                <div className="stat">
                  <h3>24/7</h3>
                  <p>Weather Updates</p>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Modern farming technology and equipment"
                onError={(e) => {
                  e.target.onerror = null // Prevent infinite loop
                  e.target.src =
                    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  e.target.alt = "Agricultural landscape"
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="marketplace" className="marketplace-section">
        <div className="container">
          <h2>Public Marketplace</h2>
          <p>Browse and purchase fresh agricultural products directly from South Sudanese farmers</p>

          <div className="filter-container">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchProducts} className="btn btn-primary">
                Try Again
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, 6).map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      {product.image ? (
                        <img
                          src={
                            product.image ||
                            "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror = null // Prevent infinite loop
                            e.target.src =
                              "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                          }}
                        />
                      ) : (
                        <div className="placeholder-image">
                          <span className="product-icon">🌾</span>
                        </div>
                      )}
                    </div>
                    <div className="product-details">
                      <h3>{product.name}</h3>
                      <p className="product-category">{product.category}</p>
                      <p className="product-description">
                        {product.description
                          ? `${product.description.substring(0, 100)}...`
                          : "No description available"}
                      </p>
                      <div className="product-meta">
                        <span className="product-price">
                          ${product.price} per {product.unit}
                        </span>
                        <span className="product-quantity">
                          Available: {product.quantity} {product.unit}
                        </span>
                      </div>
                      <button className="order-btn" onClick={() => (window.location.href = `/product/${product.id}`)}>
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-products">
                  <span className="no-products-icon">📦</span>
                  <p>No products found matching your criteria.</p>
                  <Link to="/signup" className="btn btn-primary">
                    Join as Farmer to Add Products
                  </Link>
                </div>
              )}
            </div>
          )}

          {filteredProducts.length > 6 && (
            <div className="view-more">
              <Link to="/signup" className="btn btn-primary">
                View All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      <section id="features" className="features-section" ref={featuresRef}>
        <div className="container">
          <h2>Why Choose Smart Farm Connect?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>For Farmers</h3>
              <p>
                Sell your produce directly to buyers, access modern equipment, and get reliable transportation services
              </p>
              <ul>
                <li>Direct market access</li>
                <li>Equipment rental</li>
                <li>Weather updates</li>
                <li>Educational resources</li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛒</div>
              <h3>For Buyers</h3>
              <p>Purchase fresh, quality produce directly from verified farmers across South Sudan</p>
              <ul>
                <li>Fresh produce</li>
                <li>Direct from farmers</li>
                <li>Quality guaranteed</li>
                <li>Competitive prices</li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>For Transporters</h3>
              <p>Connect with farmers and buyers who need reliable transportation services</p>
              <ul>
                <li>Regular job opportunities</li>
                <li>Fair pricing</li>
                <li>Route optimization</li>
                <li>Secure payments</li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚜</div>
              <h3>For Equipment Providers</h3>
              <p>Rent out your agricultural equipment to farmers who need modern tools</p>
              <ul>
                <li>Equipment rental income</li>
                <li>Asset utilization</li>
                <li>Maintenance tracking</li>
                <li>Insurance coverage</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="weather-preview-section">
        <div className="container">
          <h2>Real-Time Weather for South Sudan</h2>
          <p>Get accurate weather forecasts tailored for agricultural planning</p>
          <div className="weather-preview">
            <div className="weather-card-preview">
              <h3>Juba</h3>
              <div className="weather-info">
                <span className="weather-icon">☀️</span>
                <span className="temperature">32°C</span>
              </div>
              <p>Perfect for planting season</p>
            </div>
            <div className="weather-card-preview">
              <h3>Wau</h3>
              <div className="weather-info">
                <span className="weather-icon">🌧️</span>
                <span className="temperature">28°C</span>
              </div>
              <p>Good for irrigation</p>
            </div>
            <div className="weather-card-preview">
              <h3>Malakal</h3>
              <div className="weather-info">
                <span className="weather-icon">⛅</span>
                <span className="temperature">30°C</span>
              </div>
              <p>Ideal farming conditions</p>
            </div>
          </div>
          <Link to="/signup" className="btn btn-primary">
            Get Detailed Weather Updates
          </Link>
        </div>
      </section>

      <section id="contact" className="contact-section" ref={contactRef}>
        <div className="container">
          <h2>Get In Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Contact Information</h3>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <h4>Address</h4>
                  <p>Juba, South Sudan</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <h4>Phone</h4>
                  <p>+211 123 456 789</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <h4>Email</h4>
                  <p>info@smartfarmconnect.ss</p>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <h3>Send us a Message</h3>
              {formStatus.success ? (
                <div className="success-message">
                  <p>Thank you for your message! We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  {formStatus.error && (
                    <div className="error-message">
                      <p>{formStatus.error}</p>
                    </div>
                  )}
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={handleContactInputChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={handleContactInputChange}
                    required
                  />
                  <textarea
                    placeholder="Your Message"
                    name="message"
                    rows="5"
                    value={contactForm.message}
                    onChange={handleContactInputChange}
                    required
                  ></textarea>
                  <button type="submit" className="btn btn-primary" disabled={formStatus.submitting}>
                    {formStatus.submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage
