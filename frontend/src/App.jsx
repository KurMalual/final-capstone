import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth.js';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Header from './components/common/Header';
import Layout from './components/common/Layout';
import PrivateRoute from './components/common/PrivateRoute';

// Pages
import LandingPage from './pages/LandingPage';
import TestPage from './pages/TestPage';
import Login from './pages/Login';
import Register from './pages/Register-Simple';
import Dashboard from './pages/Dashboard';
import Equipment from './pages/Equipment';
import Transport from './pages/Transport';
import Marketplace from './pages/Marketplace';
import Weather from './pages/Weather';
import Education from './pages/Education';
import RequestWithTerms from './pages/RequestWithTerms';
import TermsAndConditions from './pages/TermsAndConditions';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      {/* Don't render header here, it's handled by Layout for protected routes */}
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={<LandingPage />} 
        />
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} 
        />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } 
        />
        
        {/* Module routes */}
        <Route 
          path="/equipment" 
          element={
            <PrivateRoute>
              <Layout>
                <Equipment />
              </Layout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/transport" 
          element={
            <PrivateRoute>
              <Layout>
                <Transport />
              </Layout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/marketplace" 
          element={
            <PrivateRoute>
              <Layout>
                <Marketplace />
              </Layout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/weather" 
          element={
            <PrivateRoute>
              <Layout>
                <Weather />
              </Layout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/education" 
          element={
            <PrivateRoute>
              <Layout>
                <Education />
              </Layout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/request-with-terms" 
          element={
            <PrivateRoute>
              <Layout>
                <RequestWithTerms onSubmit={() => alert('Request submitted successfully!')} />
              </Layout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Layout>
                <div className="container mt-4">
                  <h2>👤 Profile Page</h2>
                  <p>Coming soon...</p>
                </div>
              </Layout>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/terms-and-conditions" 
          element={<TermsAndConditions />} 
        />
        
        {/* Default redirect - removed since / is now the landing page */}
        
        {/* 404 route */}
        <Route 
          path="*" 
          element={
            <div className="container mt-4 text-center">
              <h2>404 - Page Not Found</h2>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
