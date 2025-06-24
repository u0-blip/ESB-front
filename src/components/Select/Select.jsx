import React from 'react';
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';

function Select(props) {
  const item = props.value;
  const isRequired = props.touched && props.required && (!item || !item.value);
  const borderColor = isRequired ? '#f14668' : 'hsl(0,0%,80%)';

  const menuFixedProps = () => {
    return props.isMenuFixed
      ? {
          menuPosition: 'fixed',
          menuPlacement: 'bottom',
        }
      : {};
  };

  return (
    <ReactSelect
      value={item}
      options={props.options}
      onChange={props.onChange}
      isSearchable={props.isSearchable}
      isDisabled={props.isDisabled}
      styles={{
        control: (styles, state) => ({
          ...styles,
          borderColor,
        }),
      }}
      {...menuFixedProps()}
    />
  );
}

Select.propTypes = {
  value: PropTypes.any,
  options: PropTypes.array,
  onChange: PropTypes.func,
  isSearchable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isMenuFixed: PropTypes.bool,
  touched: PropTypes.bool,
  required: PropTypes.bool,
};

export default Select;
