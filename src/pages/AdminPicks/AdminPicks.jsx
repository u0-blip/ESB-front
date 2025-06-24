import React from 'react'
import { ToastProvider } from 'react-toast-notifications';
import AdminPicksSection from '../../components/AdminPicksSection/AdminPicksSection';

const AdminPicks = () => {
  return (
    <ToastProvider>
      <AdminPicksSection />
    </ToastProvider>
  );
}

export default AdminPicks;