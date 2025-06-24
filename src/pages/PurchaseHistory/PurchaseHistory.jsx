import React from 'react';
import { ToastProvider } from 'react-toast-notifications'

import PurchaseHistorySection from '../../components/PurchaseHistorySection/PurchaseHistorySection';

const PurchaseHistory = () => {
  return (
    <ToastProvider>
      <PurchaseHistorySection />
    </ToastProvider>
  );
};

export default PurchaseHistory;