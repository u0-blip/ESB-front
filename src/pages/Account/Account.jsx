import React from 'react';
import { ToastProvider } from 'react-toast-notifications';

import AccountSection from '../../components/AccountSection/AccountSection';

const Account = () => {
  return (
    <ToastProvider>
      <AccountSection />
    </ToastProvider>
  )
}

export default Account;
