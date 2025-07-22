// Simple test to check if the Equipment component is working
import React from 'react';
import { Container, Alert } from 'react-bootstrap';

const EquipmentTest = () => {
  console.log('EquipmentTest component rendered');
  
  return (
    <Container fluid className="p-4">
      <Alert variant="info">
        <h4>Equipment Test Component</h4>
        <p>This is a test to verify the component structure is working.</p>
      </Alert>
    </Container>
  );
};

export default EquipmentTest;
