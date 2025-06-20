import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './AppWithAuth'; // Changed from './App'
import reportWebVitals from './reportWebVitals';

import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
Amplify.configure(awsExports); // ✅ REQUIRED for Auth, Storage, API, etc.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
