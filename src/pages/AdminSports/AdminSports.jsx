import React from 'react';
import { ToastProvider } from 'react-toast-notifications';
import AdminSportsSection from '../../components/AdminSportsSection/AdminSportsSection';

const AdminSports = () => {
  return (
    <ToastProvider>
      <AdminSportsSection />
    </ToastProvider>
  );
};

export default AdminSports;
