// src/App.js
import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';

// Import your components
import PublicLandingPage from './components/public/PublicLandingPage';
import MainApp from './MainApp';

// Configure Amplify
Amplify.configure(awsExports);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // User not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setShowAuth(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSignInRequest = () => {
    setShowAuth(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading StockSim...</p>
        </div>
      </div>
    );
  }

  // Show authentication form when requested
  if (showAuth && !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Custom header for auth page */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowAuth(false)}
                className="text-blue-600 hover:text-blue-800 font-medium text-lg"
              >
                ← Back to StockSim
              </button>
              <h1 className="text-xl font-bold text-gray-900">Sign In / Sign Up</h1>
              <div></div> {/* Spacer for centering */}
            </div>
          </div>
        </div>
        
        {/* Centered authenticator */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-md">
            <Authenticator socialProviders={[]}>
              {({ user: authUser }) => {
                if (authUser) {
                  setUser(authUser);
                  setShowAuth(false);
                }
                return null;
              }}
            </Authenticator>
          </div>
        </div>
      </div>
    );
  }

  // Show main app if user is authenticated
  if (user) {
    return <MainApp user={user} signOut={handleSignOut} />;
  }

  // Show public landing page if user is not authenticated
  return <PublicLandingPage onSignIn={handleSignInRequest} />;
}

export default App;