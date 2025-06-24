import React from 'react';
import { ToastProvider } from 'react-toast-notifications'

import PackagesSection from '../../components/PackagesSection/PackagesSection';

function Packages(props) {
  return (
    <ToastProvider>
      <PackagesSection />
    </ToastProvider>
  );
}

export default Packages;