import React from 'react';
import PropTypes from 'prop-types';

import Label from '../Label/Label';

const Field = props => {
  return (
    <div className='FieldComponent field'>
      <Label text={props.label} />
      <div
        className={`control${props.hasIconAtRight ? ' has-icons-right' : ''}${
          props.hasIconAtLeft ? ' has-icons-left' : ''
        }`}
      >
        {props.children}
      </div>
    </div>
  );
};

Field.propTypes = {
  label: PropTypes.string,
  hasIconAtRight: PropTypes.bool,
  hasIconAtLeft: PropTypes.bool
};

export default Field;
