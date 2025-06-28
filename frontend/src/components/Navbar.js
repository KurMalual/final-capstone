"use client"

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Function to handle smooth scrolling to sections
  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false) // Close mobile menu

    // If we're on the homepage
    if (window.location.pathname === "/") {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      // If we're on another page, navigate to homepage with hash
      window.location.href = `/#${sectionId}`
    }
  }

  // Handle hash links on page load
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1)
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    }
  }, [])

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🌱</span>
          Smart Farm Connect
        </Link>

        <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <a
            href="#about"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("about")
            }}
          >
            About
          </a>
          <a
            href="#features"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("features")
            }}
          >
            Features
          </a>
          <a
            href="#contact"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("contact")
            }}
          >
            Contact
          </a>
          <Link to="/login" className="nav-link nav-cta" onClick={() => setIsMenuOpen(false)}>
            Login
          </Link>
          <Link to="/signup" className="nav-link nav-cta-secondary" onClick={() => setIsMenuOpen(false)}>
            Sign Up
          </Link>
        </div>

        <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
