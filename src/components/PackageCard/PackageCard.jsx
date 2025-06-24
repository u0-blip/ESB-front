import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PaypalCheckoutButton from '../PaypalCheckoutButton/PaypalCheckoutButton';

// CSS
import './PackageCard.scss';

function PackageCard(props) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`PackageCardComponent pricing-plan pricing-plan__${props.packageId} is-dark${isActive ? ' is-active' : ''}`} onMouseOver={() => setIsActive(true)} onMouseLeave={() => setIsActive(false)}>
      <div className={`plan-header ${props.packageId === 3 ? ' is-size-4' : ''}`}>{props.packageName}</div>

      <div className="plan-price">
        <span className="plan-price-amount">
          <span className="plan-price-currency">$</span>
          {props.packagePrice}
        </span>
      </div>

      <div className="plan-items">{props.packageItems.map((packageItem, idx) => packageItem(idx))}</div>
      <div className="plan-footer">
        <PaypalCheckoutButton packageId={props.packageId} handlePaymentSuccess={props.handlePaymentSuccess} total={props.packagePrice} />
      </div>
    </div>
  );
}

PackageCard.propTypes = {
  packageId: PropTypes.number.isRequired,
  packageName: PropTypes.string,
  packagePrice: PropTypes.number.isRequired,
  packageBilling: PropTypes.string,
  packageItems: PropTypes.array,
  handlePaymentSuccess: PropTypes.func.isRequired
};

export default PackageCard;
