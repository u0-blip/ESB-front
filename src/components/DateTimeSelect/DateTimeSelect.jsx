import React from 'react';
import PropTypes from 'prop-types';
import DateTime from 'react-datetime';

import './DateTimeSelect.scss';

function DateTimeSelect(props) {
  return <DateTime open={props.open} onChange={props.onChange} value={props.value} input={props.showInput} />;
}

DateTimeSelect.propTypes = {
  value: PropTypes.object,
  showInput: PropTypes.bool,
  onChange: PropTypes.func,
  open: PropTypes.bool
};

export default DateTimeSelect;
