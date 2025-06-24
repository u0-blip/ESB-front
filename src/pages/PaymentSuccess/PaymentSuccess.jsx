import React from 'react';
import { Redirect } from 'react-router-dom';
import { MENU_ITEM } from '../../utils/constants';
import { useState } from 'react';
import { useEffect } from 'react';

function PaymentSuccess(props) {

  const [componentToRender, setComponentToRender] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(4);

  useEffect(() => {
    setComponentToRender(<ThankYouMessage />)
  }, []);

  setTimeout(() => {
    clearInterval(secondsInterval);
    setComponentToRender(<RedirectToRoute />);
  }, 4000);

  const secondsInterval = setInterval(() => {
    setSecondsLeft(secondsLeft - 1);
  }, 1);

  const ThankYouMessage = () => {
    return (
      <div className='PaymentSuccessComponent'
        style={{
          padding: '50px',
          width: '100%',
          textAlign: 'center'
        }}
      >
        <p className='subtitle'>Thanks for your purchase</p>
        <p className='subtitle'>{`Redirecting to Dashboard in ${secondsLeft} seconds!`}</p>
      </div>
    );
  }

  const RedirectToRoute = () => {
    return <Redirect to={MENU_ITEM.HOME.PATH} />;
  }

  return componentToRender;
}

export default PaymentSuccess;