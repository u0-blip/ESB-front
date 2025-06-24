import React, { useState } from 'react';
import PropTypes from 'prop-types';
import logo from '../../assets/images/logo.png';

import { Link } from '../../utils/router';
import { useAuth } from '../../utils/auth';
import { MENU_ITEM, VIBRATOR_DURATION } from '../../utils/constants';
// import { AuthService } from '../../service/AuthService';
import NavbarItemDropdown from '../NavbarItemDropdown/NavbarItemDropdown';

// CSS
import './Navbar.scss';

function Navbar(props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  // const [isValidAuthorizationToken, setIsValidAuthorizationToken] = useState(false);

  // AUTH
  const auth = useAuth();

  const handleClickMenuItem = (idMenu) => {
    !!window.navigator.vibrate && window.navigator.vibrate(VIBRATOR_DURATION);
    setActive(idMenu);
    setMenuOpen(false);
  };

  const handleClickOpenCloseMenu = () => {
    !!window.navigator.vibrate && window.navigator.vibrate(VIBRATOR_DURATION);
    setMenuOpen(!menuOpen);
  };

  // AuthService.isValidAuthorizationToken().subscribe(isValid => setIsValidAuthorizationToken(isValid));

  return (
    <nav
      className={
        'NavbarComponent navbar' +
        (props.color ? ` is-${props.color}` : '') +
        (props.isSpaced ? ' is-spaced' : '') +
        (props.isFixedTop ? ' is-fixed-top' : '')
      }
    >
      <div className='navbar-brand'>
        <div className='navbar-item'>
          <a href={process.env.REACT_APP_ESB_WEBSITE_URL}>
            <img className='image' src={logo} alt='Logo' />
          </a>
        </div>
        <div
          className={'navbar-burger burger' + (menuOpen ? ' is-active' : '')}
          onClick={() => handleClickOpenCloseMenu()}
        >
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
        </div>
      </div>
      <div className={'navbar-menu' + (menuOpen ? ' is-active' : '')}>
        {/* ### BEGIN - navbar-start ### */}
        <div className='navbar-start'>
          <Link
            className={`navbar-item is-uppercase${active.includes(MENU_ITEM.HOME.LABEL) ? ' is-active' : ''}`}
            to={MENU_ITEM.HOME.PATH}
            onClick={() => handleClickMenuItem(MENU_ITEM.HOME.LABEL)}
          >
            {MENU_ITEM.HOME.LABEL}
          </Link>
          <Link
            className={`navbar-item is-uppercase${
              active.includes(MENU_ITEM.PICKS.LABEL) ? ' is-active' : ''
            }`}
            to={MENU_ITEM.PICKS.PATH}
            onClick={() => handleClickMenuItem(MENU_ITEM.PICKS.LABEL)}
          >
            {MENU_ITEM.PICKS.LABEL}
          </Link>
          <Link
            className={`navbar-item is-uppercase${
              active.includes(MENU_ITEM.SCORECARD.LABEL) ? ' is-active' : ''
            }`}
            to={MENU_ITEM.SCORECARD.PATH}
            onClick={() => handleClickMenuItem(MENU_ITEM.SCORECARD.LABEL)}
          >
            {MENU_ITEM.SCORECARD.LABEL}
          </Link>
          {auth.isValidAuthorizationToken() && (
            <Link
              className={`navbar-item is-uppercase${
                active.includes(MENU_ITEM.PACKAGES.LABEL) ? ' is-active' : ''
              }`}
              to={MENU_ITEM.PACKAGES.PATH}
              onClick={() => handleClickMenuItem(MENU_ITEM.PACKAGES.LABEL)}
            >
              {MENU_ITEM.PACKAGES.LABEL}
            </Link>
          )}
          {auth.isValidAuthorizationToken() && auth.isAdminUser() && (
            <NavbarItemDropdown>
              <div className='navbar-link is-uppercase'>{MENU_ITEM.ADMIN.LABEL}</div>
              <div className='navbar-dropdown is-boxed'>
                <Link
                  className={`navbar-item is-uppercase${
                    active.includes(MENU_ITEM.ADMIN_DASHBOARD.LABEL)
                      ? ' is-active has-text-black has-text-weight-bold'
                      : ''
                  }`}
                  to={MENU_ITEM.ADMIN_DASHBOARD.PATH}
                  onClick={() => handleClickMenuItem(MENU_ITEM.ADMIN_DASHBOARD.LABEL)}
                >
                  {MENU_ITEM.ADMIN_DASHBOARD.LABEL}
                </Link>
                <Link
                  className={`navbar-item is-uppercase${
                    active.includes(MENU_ITEM.ADMIN_SPORTS.LABEL)
                      ? ' is-active has-text-black has-text-weight-bold'
                      : ''
                  }`}
                  to={MENU_ITEM.ADMIN_SPORTS.PATH}
                  onClick={() => handleClickMenuItem(MENU_ITEM.ADMIN_SPORTS.LABEL)}
                >
                  {MENU_ITEM.ADMIN_SPORTS.LABEL}
                </Link>
                <Link
                  className={`navbar-item is-uppercase${
                    active.includes(MENU_ITEM.ADMIN_TEAMS.LABEL)
                      ? ' is-active has-text-black has-text-weight-bold'
                      : ''
                  }`}
                  to={MENU_ITEM.ADMIN_TEAMS.PATH}
                  onClick={() => handleClickMenuItem(MENU_ITEM.ADMIN_TEAMS.LABEL)}
                >
                  {MENU_ITEM.ADMIN_TEAMS.LABEL}
                </Link>
                <Link
                  className={`navbar-item is-uppercase${
                    active.includes(MENU_ITEM.ADMIN_PICKS.LABEL)
                      ? ' is-active has-text-black has-text-weight-bold'
                      : ''
                  }`}
                  to={MENU_ITEM.ADMIN_PICKS.PATH}
                  onClick={() => handleClickMenuItem(MENU_ITEM.ADMIN_PICKS.LABEL)}
                >
                  {MENU_ITEM.ADMIN_PICKS.LABEL}
                </Link>
                <Link
                  className={`navbar-item is-uppercase${
                    active.includes(MENU_ITEM.ADMIN_USERS.LABEL)
                      ? ' is-active has-text-black has-text-weight-bold'
                      : ''
                  }`}
                  to={MENU_ITEM.ADMIN_USERS.PATH}
                  onClick={() => handleClickMenuItem(MENU_ITEM.ADMIN_USERS.LABEL)}
                >
                  {MENU_ITEM.ADMIN_USERS.LABEL}
                </Link>
                <Link
                  className={`navbar-item is-uppercase${
                    active.includes(MENU_ITEM.ADMIN_PACKAGES.LABEL)
                      ? ' is-active has-text-black has-text-weight-bold'
                      : ''
                  }`}
                  to={MENU_ITEM.ADMIN_PACKAGES.PATH}
                  onClick={() => handleClickMenuItem(MENU_ITEM.ADMIN_PACKAGES.LABEL)}
                >
                  {MENU_ITEM.ADMIN_PACKAGES.LABEL}
                </Link>
                <Link
                  className={`navbar-item is-uppercase${
                    active.includes(MENU_ITEM.ADMIN_PURCHASE_HISTORY.LABEL)
                      ? ' is-active has-text-black has-text-weight-bold'
                      : ''
                  }`}
                  to={MENU_ITEM.ADMIN_PURCHASE_HISTORY.PATH}
                  onClick={() => handleClickMenuItem(MENU_ITEM.ADMIN_PURCHASE_HISTORY.LABEL)}
                >
                  {MENU_ITEM.ADMIN_PURCHASE_HISTORY.LABEL}
                </Link>
              </div>
            </NavbarItemDropdown>
          )}
        </div>
        {/* ### END - navbar-start ### */}

        {/* ### BEGIN - navbar-end ### */}
        <div className='navbar-end'>
          {auth.isValidAuthorizationToken() && (
            <NavbarItemDropdown>
              <div className='navbar-link'>{auth?.user?.email}</div>
              <div className='navbar-dropdown is-boxed'>
                <Link
                  className={`navbar-item is-uppercase${
                    active.includes(MENU_ITEM.ACCOUNT.LABEL)
                      ? ' is-active has-text-black has-text-weight-bold'
                      : ''
                  }`}
                  to={MENU_ITEM.ACCOUNT.PATH}
                  onClick={() => handleClickMenuItem(MENU_ITEM.ACCOUNT.LABEL)}
                >
                  {MENU_ITEM.ACCOUNT.LABEL}
                </Link>
                {!auth.isAdminUser() && (
                  <Link
                    className={`navbar-item is-uppercase${
                      active.includes(MENU_ITEM.PURCHASE_HISTORY.LABEL)
                        ? ' is-active has-text-black has-text-weight-bold'
                        : ''
                    }`}
                    to={MENU_ITEM.PURCHASE_HISTORY.PATH}
                    onClick={() => handleClickMenuItem(MENU_ITEM.PURCHASE_HISTORY.LABEL)}
                  >
                    {MENU_ITEM.PURCHASE_HISTORY.LABEL}
                  </Link>
                )}
                <Link
                  className={`navbar-item is-uppercase${
                    active.includes(MENU_ITEM.SIGNOUT.LABEL)
                      ? ' is-active has-text-black has-text-weight-bold'
                      : ''
                  }`}
                  to={MENU_ITEM.SIGNOUT.PATH}
                  onClick={() => handleClickMenuItem(MENU_ITEM.SIGNOUT.LABEL)}
                >
                  {MENU_ITEM.SIGNOUT.LABEL}
                </Link>
              </div>
            </NavbarItemDropdown>
          )}

          {!auth.isValidAuthorizationToken() && (
            <>
              <div className='navbar-item'>
                <a className='button is-dark is-uppercase' href={process.env.REACT_APP_COGNITO_SIGNUP_URL}>
                  {MENU_ITEM.SIGNUP.LABEL}
                </a>
              </div>
              <div className='navbar-item'>
                <a className='button is-dark is-uppercase' href={process.env.REACT_APP_COGNITO_SIGNIN_URL}>
                  {MENU_ITEM.SIGNIN.LABEL}
                </a>
              </div>
            </>
          )}
        </div>
        {/* ### END - navbar-end ### */}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  color: PropTypes.string,
  isSpaced: PropTypes.bool,
  isFixedTop: PropTypes.bool,
};

export default Navbar;
