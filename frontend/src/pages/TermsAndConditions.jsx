import React from 'react';
import { Container } from 'react-bootstrap';
import './TermsAndConditions.css';
import Footer from '../components/Footer';

const TermsAndConditions = () => {
  return (
    <>
      <Container className="terms-container py-4">
        <h1 className="terms-title">Terms and Conditions</h1>
        <p className="terms-intro">
          Please read the following terms and conditions carefully before using our services:
        </p>

        <h2 className="terms-section-title">Equipment</h2>
        <p className="terms-text">
          Equipment should be used responsibly. Any damage caused by the farmer will result in a penalty. Equipment is rented for a maximum of one week.
        </p>

        <h2 className="terms-section-title">Transport</h2>
        <p className="terms-text">
          Vehicles should be used responsibly. Any damage caused by the farmer will result in a penalty. Vehicles are rented for a maximum of one week.
        </p>

        <h2 className="terms-section-title">General</h2>
        <p className="terms-text">
          By using our services, you agree to adhere to these terms and conditions. Failure to comply may result in penalties or suspension of services.
        </p>
      </Container>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
