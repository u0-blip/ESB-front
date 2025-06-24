import React from 'react';
import PropTypes from 'prop-types';
import { VIBRATOR_DURATION } from '../../utils/constants';
import { Link } from '../../utils/router';

const Button = props => {
  const handleClick = () => {
    !!props.vibrateOnClick && !!window.navigator.vibrate && window.navigator.vibrate(VIBRATOR_DURATION);
    !!props.handleClick && props.handleClick();
  };

  return (
    <Link
      className={`
        ButtonComponent button
        ${!!props.color ? ` is-${props.color}` : ''}
        ${!!props.isUpperCase ? ' is-uppercase' : ''}
        ${!!props.className ? ` ${props.className}` : ''}
      `}
      onClick={() => handleClick()}
      to={props.redirectTo}
    >
      {props.children}
      {props.label && <span>{props.label}</span>}
    </Link>
  );
};

Button.propTypes = {
  color: PropTypes.string,
  isUpperCase: PropTypes.bool,
  label: PropTypes.string,
  handleClick: PropTypes.func,
  vibrateOnClick: PropTypes.bool,
  redirectTo: PropTypes.string,
  className: PropTypes.string
};

export default Button;
