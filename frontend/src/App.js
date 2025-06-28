import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { UserProvider } from "./context/UserContext"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import FarmerDashboard from "./pages/FarmerDashboard"
import BuyerDashboard from "./pages/BuyerDashboard"
import TransporterDashboard from "./pages/TransporterDashboard"
import EquipmentDashboard from "./pages/EquipmentDashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/farmer-dashboard"
            element={
              <ProtectedRoute userType="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer-dashboard"
            element={
              <ProtectedRoute userType="buyer">
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transporter-dashboard"
            element={
              <ProtectedRoute userType="transporter">
                <TransporterDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/equipment-dashboard"
            element={
              <ProtectedRoute userType="equipment_seller">
                <EquipmentDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
