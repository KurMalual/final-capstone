import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const TermsAndConditions = ({ onAgree }) => {
  const [showModal, setShowModal] = useState(true);

  const handleClose = () => setShowModal(false);
  const handleAgree = () => {
    setShowModal(false);
    onAgree();
  };

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Terms and Conditions</h5>
              <button
                type="button"
                className="close"
                onClick={handleClose}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>
                Please read and agree to the terms and conditions before
                proceeding.
              </p>
              <p>
                <strong>Equipment:</strong> Equipment should be used responsibly.
                Any damage caused by the farmer will result in a penalty.
                Equipment is rented for a maximum of one week.
              </p>
              <p>
                <strong>Transport:</strong> Vehicles should be used responsibly.
                Any damage caused by the farmer will result in a penalty.
                Vehicles are rented for a maximum of one week.
              </p>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAgree}>
                I Agree
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TermsAndConditions;
