"use client"

import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🌱</span>
              <h3>Smart Farm Connect</h3>
            </div>
            <p>Connecting farmers, buyers, transporters, and equipment providers across South Sudan.</p>
            <div className="social-links">
              <button className="social-link" aria-label="Facebook">
                📘
              </button>
              <button className="social-link" aria-label="Twitter">
                🐦
              </button>
              <button className="social-link" aria-label="Instagram">
                📷
              </button>
              <button className="social-link" aria-label="LinkedIn">
                💼
              </button>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/#about">About Us</Link>
              </li>
              <li>
                <Link to="/#features">Features</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li>
                <button className="footer-link">Marketplace</button>
              </li>
              <li>
                <button className="footer-link">Equipment Rental</button>
              </li>
              <li>
                <button className="footer-link">Transportation</button>
              </li>
              <li>
                <button className="footer-link">Weather Updates</button>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p>📍 Juba, South Sudan</p>
              <p>📞 +211 123 456 789</p>
              <p>✉️ info@smartfarmconnect.ss</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Smart Farm Connect. All rights reserved.</p>
          <div className="footer-links">
            <button className="footer-link">Privacy Policy</button>
            <button className="footer-link">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
