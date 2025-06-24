import React from 'react';
import PropTypes from 'prop-types';

import './Loader.scss';

const Loader = props => {
  return (
    <>
      {props.isActive && <div className='wrapper-cssload-loader'><div id="cssload-loader">Loading ESB</div></div>}
    </>
  );
};

Loader.propTypes = {
  isActive: PropTypes.bool
};

export default Loader;
