// src/components/auth/AuthWrapper.js
import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import MainApp from '../../MainApp';

const AuthWrapper = () => {
  return (
    <Authenticator>
      {({ user }) => (
        <MainApp user={user} />
      )}
    </Authenticator>
  );
};

export default AuthWrapper;