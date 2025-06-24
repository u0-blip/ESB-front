import React from 'react';
import { ToastProvider } from 'react-toast-notifications';
import UserDashboardSection from '../../components/UserDashboardSection/UserDashboardSection';

const Home = () => {
  return (
    <ToastProvider>
      <UserDashboardSection />
    </ToastProvider>
  )
}

export default Home;
