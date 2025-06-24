import React from 'react';
import { ToastProvider } from 'react-toast-notifications';

import ScoreCardSection from '../../components/ScoreCardSection/ScoreCardSection';

function Scorecard(props) {
  return (
    <ToastProvider>
      <ScoreCardSection /> 
    </ToastProvider>
  )
}

export default Scorecard;