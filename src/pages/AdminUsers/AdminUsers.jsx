import React from 'react';
import { ToastProvider } from 'react-toast-notifications';
import AdminUsersSection from '../../components/AdminUsersSection/AdminUsersSection';

const AdminUsers = () => {
  return (
    <ToastProvider>
      <AdminUsersSection />
    </ToastProvider>
  );
};

export default AdminUsers;
