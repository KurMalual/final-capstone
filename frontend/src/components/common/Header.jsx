import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'farmer':
        return '🌾';
      case 'buyer':
        return '🛒';
      case 'equipment_seller':
        return '🚜';
      case 'transporter':
        return '🚛';
      default:
        return '👤';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'farmer':
        return 'Farmer';
      case 'buyer':
        return 'Buyer';
      case 'equipment_seller':
        return 'Equipment Seller';
      case 'transporter':
        return 'Transporter';
      default:
        return 'User';
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar bg="success" variant="dark" expand="lg" fixed="top" className="shadow">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard" className="fw-bold">
          🌾 Smart Farm APMS
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/dashboard" 
              className={isActive('/dashboard') ? 'active' : ''}
            >
              🏠 Dashboard
            </Nav.Link>
            
            {user?.role === 'farmer' && (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/equipment" 
                  className={isActive('/equipment') ? 'active' : ''}
                >
                  🚜 Equipment
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/transport" 
                  className={isActive('/transport') ? 'active' : ''}
                >
                  🚛 Transport
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/marketplace" 
                  className={isActive('/marketplace') ? 'active' : ''}
                >
                  🛒 Marketplace
                </Nav.Link>
              </>
            )}
            
            {user?.role === 'buyer' && (
              <Nav.Link 
                as={Link} 
                to="/marketplace" 
                className={isActive('/marketplace') ? 'active' : ''}
              >
                🛒 Products
              </Nav.Link>
            )}
            
            {user?.role === 'equipment_seller' && (
              <Nav.Link 
                as={Link} 
                to="/equipment" 
                className={isActive('/equipment') ? 'active' : ''}
              >
                🚜 My Equipment
              </Nav.Link>
            )}
            
            {user?.role === 'transporter' && (
              <Nav.Link 
                as={Link} 
                to="/transport" 
                className={isActive('/transport') ? 'active' : ''}
              >
                🚛 My Vehicles
              </Nav.Link>
            )}
            
            <Nav.Link 
              as={Link} 
              to="/weather" 
              className={isActive('/weather') ? 'active' : ''}
            >
              🌤️ Weather
            </Nav.Link>
            
            {user?.role === 'farmer' && (
              <Nav.Link 
                as={Link} 
                to="/education" 
                className={isActive('/education') ? 'active' : ''}
              >
                📚 Education
              </Nav.Link>
            )}
          </Nav>
          
          <Nav>
            <NavDropdown 
              title={
                <span>
                  {getRoleIcon(user?.role)} {user?.first_name || user?.username}
                  <Badge bg="light" text="dark" className="ms-2">
                    {getRoleLabel(user?.role)}
                  </Badge>
                </span>
              } 
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/profile">
                👤 Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                🚪 Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
