import React from 'react';
import { ToastProvider } from 'react-toast-notifications';

import PicksSection from '../../components/PicksSection/PicksSection';

import './Picks.scss';

function Picks(props) {
  return (
    <ToastProvider>
      <PicksSection />
    </ToastProvider>
  )
}

export default Picks;