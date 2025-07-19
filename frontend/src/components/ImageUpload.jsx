import React, { useState, useRef } from 'react';
import { Form, Button, Alert, Image } from 'react-bootstrap';

const ImageUpload = ({ 
  onImageSelect, 
  currentImage = null, 
  placeholder = "Upload Image", 
  accept = "image/*",
  maxSize = 5 * 1024 * 1024 // 5MB default
}) => {
  const [preview, setPreview] = useState(currentImage);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return false;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return false;
    }
    
    // Check file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
      return false;
    }
    
    setError('');
    return true;
  };

  const handleFileSelect = (file) => {
    if (!validateFile(file)) return;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    // Call parent handler
    if (onImageSelect) {
      onImageSelect(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageSelect) {
      onImageSelect(null);
    }
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>Equipment/Vehicle Image</Form.Label>
      
      {error && <Alert variant="danger" className="mb-2">{error}</Alert>}
      
      <div
        className={`border rounded p-3 text-center ${
          dragOver ? 'border-primary bg-light' : 'border-secondary'
        }`}
        style={{ 
          minHeight: '200px', 
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <div className="position-relative">
            <Image
              src={preview}
              alt="Preview"
              fluid
              style={{ maxHeight: '200px', objectFit: 'cover' }}
              className="rounded"
            />
            <Button
              variant="danger"
              size="sm"
              className="position-absolute top-0 end-0 m-2"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
            >
              ✕
            </Button>
          </div>
        ) : (
          <div className="py-4">
            <div className="mb-3">
              <i className="fas fa-cloud-upload-alt fa-3x text-muted"></i>
            </div>
            <p className="text-muted mb-2">{placeholder}</p>
            <p className="small text-muted">
              Drag & drop an image here, or click to select
              <br />
              <small>Supported formats: JPG, PNG, GIF (Max: {Math.round(maxSize / (1024 * 1024))}MB)</small>
            </p>
          </div>
        )}
      </div>
      
      <Form.Control
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={accept}
        className="d-none"
      />
      
      <Form.Text className="text-muted">
        Adding a clear image helps users identify your equipment/vehicle better
      </Form.Text>
    </Form.Group>
  );
};

export default ImageUpload;
