import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';

// Dashboard components for different roles
import FarmerDashboard from '../components/dashboard/FarmerDashboard';
import BuyerDashboard from '../components/dashboard/BuyerDashboard';
import EquipmentSellerDashboard from '../components/dashboard/EquipmentSellerDashboard';
import TransporterDashboard from '../components/dashboard/TransporterDashboard';
import ProfileCompletion from '../components/common/ProfileCompletion';

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Profile completion feature - to be implemented in future
  // eslint-disable-next-line no-unused-vars
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Dashboard: Fetching data for user:', user);
      const response = await authAPI.getCurrentUser();
      console.log('Dashboard: API response:', response);
      console.log('Dashboard: API response data:', response.data);
      setDashboardData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data: ' + (err.response?.data?.detail || err.message));
      console.error('Dashboard error:', err);
      console.error('Dashboard error response:', err.response);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const renderDashboard = () => {
    // Check if user has a valid role
    if (!user?.role) {
      return <ProfileCompletion onComplete={handleProfileComplete} />;
    }

    console.log('Dashboard: Rendering dashboard for role:', user.role);
    console.log('Dashboard: Data to pass to component:', dashboardData);

    switch (user.role) {
      case 'farmer':
        return <FarmerDashboard data={dashboardData} onRefresh={fetchDashboardData} />;
      case 'buyer':
        return <BuyerDashboard data={dashboardData} onRefresh={fetchDashboardData} />;
      case 'equipment_seller':
        return <EquipmentSellerDashboard data={dashboardData} onRefresh={fetchDashboardData} />;
      case 'transporter':
        return <TransporterDashboard data={dashboardData} onRefresh={fetchDashboardData} />;
      default:
        return <ProfileCompletion onComplete={handleProfileComplete} />;
    }
  };

  const handleProfileComplete = (updatedUser) => {
    setUser(updatedUser);
    setShowProfileCompletion(false);
    // Refresh dashboard data with new role
    fetchDashboardData();
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          {renderDashboard()}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
