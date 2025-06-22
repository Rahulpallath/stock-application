// src/App.js
import React from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import AuthWrapper from './components/auth/AuthWrapper';

// Configure Amplify
Amplify.configure(awsExports);

function App() {
  return <AuthWrapper />;
}

export default App;