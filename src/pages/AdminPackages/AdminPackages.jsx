import React from 'react';
import { ToastProvider } from 'react-toast-notifications';
import AdminPackagesSection from '../../components/AdminPackagesSection/AdminPackagesSection';

const AdminPackages = () => {
  return (
    <ToastProvider>
      <AdminPackagesSection />
    </ToastProvider>
  );
};

export default AdminPackages;
