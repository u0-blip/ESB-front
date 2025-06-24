import React from 'react';
// import PropTypes from 'prop-types';
import footerLogo from '../../assets/images/esbfooterlogo.png';

import './Footer.scss';

function Footer(props) {
  return (
    <footer className="FooterComponent footer has-background-dark">

      <div className="footer_inner">
        <img src={footerLogo} alt="esb beat the game" />
        <div className="has-text-white is-size-7">© 2019 - Elite Sports Bets</div>
      </div>

    </footer>
  )
}

Footer.propTypes = {
  
}

export default Footer;