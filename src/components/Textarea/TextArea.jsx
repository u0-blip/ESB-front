import React from 'react';
import PropTypes from 'prop-types';

function Textarea(props) {
  const isRequired = props.touched && props.required && !props.value ? 'is-danger' : '';

  return (
    <textarea
      rows={props.rows}
      value={props.value}
      onChange={props.onChange}
      className={`textarea ${isRequired}`}
      placeholder={props.placeholder}
    />
  );
}

Textarea.propTypes = {
  rows: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  touched: PropTypes.bool,
  required: PropTypes.bool,
};

export default Textarea;
