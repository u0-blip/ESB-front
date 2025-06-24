import React from 'react';
import PropTypes from 'prop-types';

const Label = props => {
  return (
    <label className="LabelComponent label">{props.text}</label>
  )
}

Label.propTypes = {
  text: PropTypes.string
}

export default Label;