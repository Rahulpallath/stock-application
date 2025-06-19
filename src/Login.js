import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const Login = ({ children }) => {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div>
          {/* Pass user info and signOut function to children */}
          {React.cloneElement(children, { user, signOut })}
        </div>
      )}
    </Authenticator>
  );
};

export default Login;