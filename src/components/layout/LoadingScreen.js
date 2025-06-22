// src/components/layout/LoadingScreen.js
import React from 'react';
import { Loader } from 'lucide-react';

const LoadingScreen = ({ message = "Loading your portfolio..." }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;