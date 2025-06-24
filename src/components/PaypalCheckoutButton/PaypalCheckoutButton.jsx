import React from 'react';
import PropTypes from 'prop-types';
import PaypalExpressBtn from 'react-paypal-express-checkout';

function PaypalCheckoutButton(props) {
  const onSuccess = payment => {
    // 1, 2, and ... Poof! You made it, everything's fine and dandy!
    // console.log('Payment successful!', payment);
    props.handlePaymentSuccess(props.packageId, payment);
    // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
  };

  const onCancel = data => {
    // The user pressed "cancel" or closed the PayPal popup
    console.log('Payment cancelled!', data);
    // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
  };

  const onError = err => {
    // The main Paypal script could not be loaded or something blocked the script from loading
    console.log('Error!', err);
    // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
    // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
  };

  let env = process.env.REACT_APP_ENV === 'production' ? 'production' : 'sandbox'; // you can set this string to 'production'
  let currency = 'USD'; // you can set this string from your props or state
  let total = props.total; // this is the total amount (based on currency) to charge
  // Document on Paypal's currency code: https://developer.paypal.com/docs/classic/api/currency_codes/

  const client = {
    sandbox: process.env.REACT_APP_PAYPAL_CLIENT_ID,
    production: process.env.REACT_APP_PAYPAL_CLIENT_ID
  };
  // In order to get production's app-ID, you will have to send your app to Paypal for approval first
  // For your sandbox Client-ID (after logging into your developer account, please locate the "REST API apps" section, click "Create App" unless you have already done so):
  //   => https://developer.paypal.com/docs/classic/lifecycle/sb_credentials/
  // Note: IGNORE the Sandbox test AppID - this is ONLY for Adaptive APIs, NOT REST APIs)
  // For production app-ID:
  //   => https://developer.paypal.com/docs/classic/lifecycle/goingLive/

  // NB. You can also have many Paypal express checkout buttons on page, just pass in the correct amount and they will work!
  return (
    <PaypalExpressBtn
      env={env}
      client={client}
      currency={currency}
      total={total}
      onError={onError}
      onSuccess={onSuccess}
      onCancel={onCancel}
      style={{ color: 'black', shape: 'rect', size: 'responsive', label: 'buynow' }}
    />
  );
}

PaypalCheckoutButton.propTypes = {
  handlePaymentSuccess: PropTypes.func.isRequired,
  packageId: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
};

export default PaypalCheckoutButton;
