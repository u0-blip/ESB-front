import React from 'react';
import { useAuth } from '../../utils/auth';

function SignOut(props) {

  const auth = useAuth();
  auth.signout();
  setTimeout(() => {
    window.location.href = process.env.REACT_APP_ESB_WEBSITE_URL;
  }, 500);

  return (
    <div className='SignOutComponent'
      style={{
        padding: '50px',
        width: '100%',
        textAlign: 'center'
      }}
    >
      Thank you. See you soon.
    </div>
  )
}

export default SignOut;