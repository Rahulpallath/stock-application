// src/components/auth/AuthWrapper.js
import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import MainApp from '../../MainApp';
import PublicLandingPage from '../public/PublicLandingPage';

const AuthWrapper = () => {
  return (
    <Authenticator socialProviders={[]}>
      {({ signOut, user }) => {
        if (user) {
          // User is authenticated - show the main app
          return <MainApp user={user} signOut={signOut} />;
        } else {
          // User is not authenticated - show public landing page
          return (
            <PublicLandingPage 
              onSignIn={() => {
                // This will trigger the Authenticator to show sign-in form
                // The Authenticator handles this automatically
              }}
            />
          );
        }
      }}
    </Authenticator>
  );
};

export default AuthWrapper;