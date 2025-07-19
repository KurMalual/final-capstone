import React from 'react';

const SimpleLanding = () => {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1 style={{ color: 'green', fontSize: '3rem' }}>🌾 Smart Farm Connect</h1>
      <p style={{ fontSize: '1.5rem', margin: '20px 0' }}>
        Welcome to Smart Farm Connect - Your Agricultural Management Platform
      </p>
      <div style={{ marginTop: '30px' }}>
        <button style={{ 
          padding: '15px 30px', 
          fontSize: '1.2rem', 
          backgroundColor: '#4CAF50', 
          color: 'white', 
          border: 'none', 
          borderRadius: '10px',
          marginRight: '20px',
          cursor: 'pointer'
        }}>
          Get Started
        </button>
        <button style={{ 
          padding: '15px 30px', 
          fontSize: '1.2rem', 
          backgroundColor: 'white', 
          color: '#4CAF50', 
          border: '2px solid #4CAF50', 
          borderRadius: '10px',
          cursor: 'pointer'
        }}>
          Learn More
        </button>
      </div>
      <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center', gap: '50px' }}>
        <div>
          <h3 style={{ color: '#4CAF50' }}>500+</h3>
          <p>Registered Farmers</p>
        </div>
        <div>
          <h3 style={{ color: '#4CAF50' }}>200+</h3>
          <p>Products Listed</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleLanding;
