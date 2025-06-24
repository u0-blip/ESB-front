import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const NavbarItemDropdown = (props) => {
  const [dropDownActive, setDropDownActive] = useState(false);

  const wrapperRef = useRef(null);

  const handleClickOutside = (event) => {
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
      className={`NavbarItemDropdownComponent navbar-item has-dropdown${dropDownActive ? ' is-active' : ''}`}
      onClick={() => setDropDownActive(!dropDownActive)}
    >
      {props.children}
    </div>
  );
};

NavbarItemDropdown.propTypes = {
  children: PropTypes.array,
};

export default NavbarItemDropdown;
