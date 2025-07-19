import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { weatherAPI } from '../services/api';

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSouthSudanWeather();
  }, []);

  const loadSouthSudanWeather = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await weatherAPI.getSouthSudanWeather();
      setWeatherData(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (err) {
      // Fallback to general weather data if South Sudan specific fails
      try {
        const response = await weatherAPI.getWeatherData();
        setWeatherData(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (fallbackErr) {
        setError('Failed to load weather data');
        console.error('Error loading weather:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!location.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await weatherAPI.fetchWeather(location);
      // Add the new weather data to the existing list
      setWeatherData([response.data, ...weatherData]);
      setLocation(''); // Clear the input
    } catch (err) {
      setError('Failed to fetch weather for the specified location. Please check the location name and try again.');
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherAdvice = (description, temperature) => {
    const desc = description?.toLowerCase() || '';
    const temp = parseFloat(temperature) || 0;

    // Priority 1: Check for rain/precipitation first
    if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower')) {
      return { text: 'Natural irrigation for crops', color: 'info' };
    }
    
    // Priority 2: Check temperature ranges  
    if (temp > 35) {
      return { text: 'Too hot - provide shade', color: 'danger' };
    } else if (temp < 15) {
      return { text: 'Too cool for most crops', color: 'warning' };
    }
    
    // Priority 3: Check sky conditions for good farming weather (15-35°C)
    if (desc.includes('clear') || desc.includes('sunny')) {
      return { text: 'Excellent for farming', color: 'success' };
    } else if (desc.includes('few clouds') || desc.includes('scattered clouds')) {
      return { text: 'Good for farming', color: 'success' };
    } else if (desc.includes('broken clouds') || desc.includes('overcast')) {
      return { text: 'Fair conditions', color: 'warning' };
    } else {
      return { text: 'Moderate conditions', color: 'secondary' };
    }
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <h2>🌤️ Weather Information</h2>
          <p className="text-muted">Stay informed about weather conditions for better farming decisions</p>
        </Col>
      </Row>

      {/* Location Search */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Search Weather by Location</Card.Title>
              <Form onSubmit={handleLocationSearch}>
                <Form.Group className="mb-3">
                  <Form.Label>Enter City or Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., New York, London, Paris"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Searching...' : 'Get Weather'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

      {loading && (
        <Row className="mb-4">
          <Col className="d-flex justify-content-center">
            <Spinner animation="border" />
          </Col>
        </Row>
      )}

      {/* Weather Display */}
      {weatherData && weatherData.length > 0 && !loading && (
        <Row>
          <Col>
            <h3 className="mb-4">South Sudan Weather Information</h3>
            <Row>
              {weatherData.map((weather, index) => {
                const advice = getWeatherAdvice(weather.description, weather.temperature);
                return (
                  <Col md={6} lg={4} className="mb-4" key={weather.id || index}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <Card.Title className="mb-1">{weather.location}</Card.Title>
                            <small className="text-muted">
                              {new Date(weather.timestamp).toLocaleDateString()}
                            </small>
                          </div>
                          <span className={`badge bg-${advice.color}`}>
                            {advice.text}
                          </span>
                        </div>
                        
                        <div className="text-center mb-3">
                          <h2 className="display-4 mb-0">{Math.round(weather.temperature)}°C</h2>
                          <p className="text-capitalize text-muted mb-0">{weather.description}</p>
                        </div>
                        
                        <div className="d-flex justify-content-between">
                          <div className="text-center">
                            <div className="fw-bold">{weather.humidity}%</div>
                            <small className="text-muted">Humidity</small>
                          </div>
                          <div className="text-center">
                            <div className="fw-bold">
                              {weather.temperature > 30 ? 'Hot' : weather.temperature < 20 ? 'Cool' : 'Warm'}
                            </div>
                            <small className="text-muted">Condition</small>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      )}

      {/* No weather data message */}
      {!loading && (!weatherData || weatherData.length === 0) && (
        <Row>
          <Col>
            <Alert variant="info" className="text-center">
              <h5>No weather data available</h5>
              <p>Try searching for a specific location or check back later.</p>
              <Button variant="primary" onClick={loadSouthSudanWeather}>
                Reload Weather Data
              </Button>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Weather Tips */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>🌱 Farming Weather Tips</Card.Title>
              <Row>
                <Col md={6}>
                  <h6>☀️ Sunny Weather</h6>
                  <ul>
                    <li>Ideal for harvesting and hay making</li>
                    <li>Good for soil cultivation</li>
                    <li>Monitor irrigation needs</li>
                    <li>Best time for pesticide application</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>🌧️ Rainy Weather</h6>
                  <ul>
                    <li>Avoid heavy machinery in fields</li>
                    <li>Natural irrigation for crops</li>
                    <li>Good time for indoor farm tasks</li>
                    <li>Monitor for fungal diseases</li>
                  </ul>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <h6>💨 Windy Weather</h6>
                  <ul>
                    <li>Avoid spraying chemicals</li>
                    <li>Secure loose farm structures</li>
                    <li>Good for drying crops</li>
                    <li>Risk of erosion on bare soil</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>❄️ Cold Weather</h6>
                  <ul>
                    <li>Protect sensitive plants</li>
                    <li>Use frost protection measures</li>
                    <li>Check livestock water sources</li>
                    <li>Plan for heating needs</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Weather;
