import { Link } from "react-router-dom"

const DashboardFooter = () => {
  return (
    <footer className="dashboard-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Smart Farm Connect</h3>
          <p>
            Connecting farmers, buyers, equipment providers, and transporters in South Sudan for a more efficient
            agricultural ecosystem.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Services</h3>
          <ul className="footer-links">
            <li>
              <Link to="/marketplace">Marketplace</Link>
            </li>
            <li>
              <Link to="/equipment">Equipment Rental</Link>
            </li>
            <li>
              <Link to="/transport">Transportation</Link>
            </li>
            <li>
              <Link to="/weather">Weather Information</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@smartfarmconnect.com</p>
          <p>Phone: +211 928 000 000</p>
          <p>Address: Juba, South Sudan</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Smart Farm Connect. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default DashboardFooter
