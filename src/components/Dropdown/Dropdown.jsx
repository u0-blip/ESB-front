/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './Dropdown.scss';

function Dropdown(props) {
  const [dropDownActive, setDropDownActive] = useState(false);
  const wrapperRef = useRef(null);

  const handleClickOutside = event => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      if (dropDownActive) {
        setDropDownActive(false);
      }
    }
  };

  useEffect(() => {
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <div
      ref={wrapperRef}
      className={`DropdownComponent dropdown${dropDownActive ? ' is-active' : ''}`}
      onClick={() => setDropDownActive(!dropDownActive)}
    >
      <div className='dropdown-trigger'>
        <button className='button' aria-haspopup='true' aria-controls='dropdown-menu'>
          <span className='dropdown-label'>{props.label}</span>
          <span className='icon is-small'>
            <i className='fas fa-angle-down' aria-hidden='true'></i>
          </span>
        </button>
      </div>
      <div className='dropdown-menu' id='dropdown-menu' role='menu'>
        <div className='dropdown-content'>{props.children}</div>
      </div>
    </div>
  );
}

Dropdown.propTypes = {
  label: PropTypes.string
};

export default Dropdown;
