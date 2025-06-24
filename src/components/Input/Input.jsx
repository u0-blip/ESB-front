import React from 'react';
import PropTypes from 'prop-types';

function Input(props) {
  const isRequired = props.touched && props.required && !props.value ? 'is-danger' : '';

  return (
    <input
      {...props.disabled}
      className={`InputComponent input ${isRequired}`}
      type={props.type}
      value={props.value}
      onChange={e => props.onChange(e.target.value)}
      onClick={() => props.onClick()}
    />
  );
}

Input.defaultProps = {
  disabled: { disabled: false },
  onClick: () => 'clicked'
};

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  disabled: PropTypes.object,
  touched: PropTypes.bool,
  required: PropTypes.bool,
};

export default Input;
