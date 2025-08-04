import React, { useState } from 'react';
import TermsAndConditionsModal from '../components/common/TermsAndConditionsModal';

const RequestWithTerms = ({ onSubmit }) => {
  const [showModal, setShowModal] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleAgree = () => {
    setAgreed(true);
    setShowModal(false);
  };

  const handleSubmit = () => {
    if (!agreed) {
      setShowModal(true);
    } else {
      onSubmit();
    }
  };

  return (
    <div className="container mt-4">
      <h2>Submit a Request</h2>
      <p>Click the button below to submit your request. You must agree to the terms and conditions before proceeding.</p>
      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit Request
      </button>

      <TermsAndConditionsModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onAgree={handleAgree}
      />
    </div>
  );
};

export default RequestWithTerms;
