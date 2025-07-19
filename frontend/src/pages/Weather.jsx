import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { weatherAPI } from '../services/api';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCurrentWeather();
  }, []);

  const loadCurrentWeather = async () => {
    try {
      setLoading(true);
      const response = await weatherAPI.getWeatherData();
      setWeatherData(response.data);
    } catch (err) {
      setError('Failed to load weather data');
      console.error('Error loading weather:', err);
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
      setWeatherData(response.data);
    } catch (err) {
      setError('Failed to fetch weather for the specified location');
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
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
      {weatherData && !loading && (
        <>
          {weatherData.error ? (
            <Alert variant="warning" className="mb-3">
              {weatherData.error}
            </Alert>
          ) : (
            <Row>
              {/* Current Weather */}
              <Col lg={8} className="mb-4">
                <Card className="h-100">
                  <Card.Body>
                    <Card.Title>Current Weather</Card.Title>
                    {weatherData.current ? (
                      <Row>
                        <Col md={6}>
                          <h3>{weatherData.location?.name || 'Unknown Location'}</h3>
                          <p className="text-muted">
                            {weatherData.location?.region && `${weatherData.location.region}, `}
                            {weatherData.location?.country}
                          </p>
                          <div className="d-flex align-items-center mb-3">
                            <h1 className="me-3">{Math.round(weatherData.current.temp_c)}°C</h1>
                            <div>
                              <p className="mb-0">{weatherData.current.condition?.text}</p>
                              <small className="text-muted">
                                Feels like {Math.round(weatherData.current.feelslike_c)}°C
                              </small>
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <Row className="g-3">
                            <Col xs={6}>
                              <Card className="bg-light border-0">
                                <Card.Body className="p-3">
                                  <small className="text-muted">Humidity</small>
                                  <div className="fw-bold">{weatherData.current.humidity}%</div>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col xs={6}>
                              <Card className="bg-light border-0">
                                <Card.Body className="p-3">
                                  <small className="text-muted">Wind Speed</small>
                                  <div className="fw-bold">{weatherData.current.wind_kph} km/h</div>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col xs={6}>
                              <Card className="bg-light border-0">
                                <Card.Body className="p-3">
                                  <small className="text-muted">Pressure</small>
                                  <div className="fw-bold">{weatherData.current.pressure_mb} mb</div>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col xs={6}>
                              <Card className="bg-light border-0">
                                <Card.Body className="p-3">
                                  <small className="text-muted">UV Index</small>
                                  <div className="fw-bold">{weatherData.current.uv}</div>
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    ) : (
                      <p>No current weather data available</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Weather Summary */}
              <Col lg={4} className="mb-4">
                <Card className="h-100">
                  <Card.Body>
                    <Card.Title>Weather Summary</Card.Title>
                    {weatherData.current ? (
                      <div>
                        <p><strong>Visibility:</strong> {weatherData.current.vis_km} km</p>
                        <p><strong>Cloud Cover:</strong> {weatherData.current.cloud}%</p>
                        <p><strong>Wind Direction:</strong> {weatherData.current.wind_dir}</p>
                        <p><strong>Precipitation:</strong> {weatherData.current.precip_mm} mm</p>
                        
                        <div className="mt-4">
                          <h6>Farming Conditions</h6>
                          <div className="mb-2">
                            {weatherData.current.precip_mm > 5 ? (
                              <span className="badge bg-warning">Wet conditions - Avoid field work</span>
                            ) : weatherData.current.precip_mm > 0 ? (
                              <span className="badge bg-info">Light rain - Be cautious</span>
                            ) : (
                              <span className="badge bg-success">Dry conditions - Good for farming</span>
                            )}
                          </div>
                          <div className="mb-2">
                            {weatherData.current.wind_kph > 25 ? (
                              <span className="badge bg-danger">High winds - Avoid spraying</span>
                            ) : weatherData.current.wind_kph > 15 ? (
                              <span className="badge bg-warning">Moderate winds</span>
                            ) : (
                              <span className="badge bg-success">Calm winds</span>
                            )}
                          </div>
                          <div>
                            {weatherData.current.temp_c > 30 ? (
                              <span className="badge bg-danger">Hot - Ensure adequate irrigation</span>
                            ) : weatherData.current.temp_c < 5 ? (
                              <span className="badge bg-primary">Cold - Protect sensitive crops</span>
                            ) : (
                              <span className="badge bg-success">Moderate temperature</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p>No weather summary available</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </>
      )}

      {/* Weather Tips */}
      <Row>
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
