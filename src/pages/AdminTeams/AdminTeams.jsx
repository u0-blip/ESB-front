import React from 'react';
import { ToastProvider } from 'react-toast-notifications';
import AdminTeamsSection from '../../components/AdminTeamsSection/AdminTeamsSection';

const AdminTeams = () => {
  return (
    <ToastProvider>
      <AdminTeamsSection />
    </ToastProvider>
  );
};

export default AdminTeams;
