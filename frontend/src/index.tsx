import React from 'react';
import ReactDOM from 'react-dom/client';
// Remove CSS import for now
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);